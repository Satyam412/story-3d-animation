import React, { useMemo, useRef } from 'react'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three-stdlib'

// ── Layer config: large → medium → small → tiny → dust ───────────────────────
// assemble = scroll range when they FLY IN (build phase)
// dissolve = scroll range when they FLY OUT (break phase, large first)
const LAYERS = [
  // 0 — large chunks  (first to scatter, fly the farthest)
  { N: 55,   size: 0.35, sm: 430, sx: 740, assemble: [0.65, 0.68], dissolve: [0.87, 0.91] },
  // 1 — medium pieces
  { N: 220,  size: 0.18, sm: 340, sx: 590, assemble: [0.66, 0.69], dissolve: [0.89, 0.93] },
  // 2 — small shards
  { N: 850,  size: 0.067,sm: 255, sx: 455, assemble: [0.67, 0.70], dissolve: [0.91, 0.95] },
  // 3 — fine fragments
  { N: 2700, size: 0.029,sm: 185, sx: 340, assemble: [0.68, 0.72], dissolve: [0.93, 0.97] },
  // 4 — dust particles (last to scatter, drift the least)
  { N: 7000, size: 0.019,sm: 125, sx: 260, assemble: [0.69, 0.73], dissolve: [0.96, 1.00] },
]

const ss = (x, a, b) => THREE.MathUtils.smoothstep(x, a, b)

export default function Skull(props) {
  const { nodes, materials } = useGLTF('/models/skull.glb')
  const group  = useRef()
  const scroll = useScroll()

  // ── Cloned materials — preserve all original textures/colors from the GLB ────
  const mats = useMemo(() => {
    const u = materials.upper.clone()
    const l = materials.lower_new.clone()
    const t = materials.tooth.clone()
    // Keep original roughness/metalness/color/maps untouched — only add fade control
    ;[u, l, t].forEach(m => { m.transparent = true; m.opacity = 0; m.depthWrite = true })
    return { u, l, t }
  }, [materials])

  // ── Soft-circle sprite texture so large chunks look like glowing orbs ────────
  const dotTex = useMemo(() => {
    const s = 64
    const cv = document.createElement('canvas')
    cv.width = cv.height = s
    const ctx = cv.getContext('2d')
    const g = ctx.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2)
    g.addColorStop(0,    'rgba(255,255,255,1.0)')
    g.addColorStop(0.45, 'rgba(255,255,255,0.75)')
    g.addColorStop(1.0,  'rgba(255,255,255,0.0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, s, s)
    return new THREE.CanvasTexture(cv)
  }, [])

  // ── Pre-compute origins + scatter for every layer in one pass ─────────────────
  const layerData = useMemo(() => {
    const geo = nodes.retopo_upper005_upper_0.geometry.clone()
    geo.computeBoundingBox()
    const { min, max } = geo.boundingBox
    const yRange = max.y - min.y

    const mesh    = new THREE.Mesh(geo)
    const sampler = new MeshSurfaceSampler(mesh).build()
    const tmp     = new THREE.Vector3()
    const col     = new THREE.Color()

    return LAYERS.map(({ N, sm, sx }) => {
      const origins   = new Float32Array(N * 3)
      const scattered = new Float32Array(N * 3)
      const colors    = new Float32Array(N * 3)
      const positions = new Float32Array(N * 3) // mutable working buffer

      for (let i = 0; i < N; i++) {
        sampler.sample(tmp)

        // Origin: on skull surface
        origins[i*3]   = tmp.x
        origins[i*3+1] = tmp.y
        origins[i*3+2] = tmp.z

        // Scatter direction: random outward with slight upward bias
        let dx = (Math.random() - 0.5) * 2
        let dy = Math.random() * 1.4 - 0.3
        let dz = (Math.random() - 0.5) * 2
        const len = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1
        dx /= len; dy /= len; dz /= len
        const dist = sm + Math.random() * (sx - sm)
        scattered[i*3]   = tmp.x + dx * dist
        scattered[i*3+1] = tmp.y + dy * dist
        scattered[i*3+2] = tmp.z + dz * dist

        // Initialize at assembled position (full skull)
        positions[i*3]   = origins[i*3]
        positions[i*3+1] = origins[i*3+1]
        positions[i*3+2] = origins[i*3+2]

        // Cyan (jaw) → violet (crown) gradient
        const t = (tmp.y - min.y) / yRange
        col.setHSL(0.45 + t * 0.38, 1.0, 0.62)
        colors[i*3]   = col.r
        colors[i*3+1] = col.g
        colors[i*3+2] = col.b
      }

      const bufGeo = new THREE.BufferGeometry()
      bufGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      bufGeo.setAttribute('color',    new THREE.BufferAttribute(colors,    3))

      return { origins, scattered, positions, geo: bufGeo, N }
    })
  }, [nodes])

  // Plain-object ref arrays (not React refs — just boxes to store pointers)
  const layerRefs = useMemo(() => LAYERS.map(() => ({
    pts: { current: null },
    mat: { current: null },
  })), [])

  // ── Per-frame: lerp positions + update mesh opacity ──────────────────────────
  const lastOffset = useRef(0)
  
  useFrame(() => {
    if (!scroll || !group.current || !group.current.visible) return
    const offset = scroll.offset
    
    // Only update if offset has changed significantly or if we are in the active range
    const isChanging = Math.abs(offset - lastOffset.current) > 0.0001
    const inRange = offset > 0.6 // The range where the skull appears and dissolves
    
    if (isChanging && inRange) {
      LAYERS.forEach(({ dissolve }, i) => {
        const { pts, mat } = layerRefs[i]
        if (!pts.current) return

        // conv: 0 = scattered, 1 = on skull surface
        const conv = 1 - ss(offset, dissolve[0], dissolve[1])
        const sc = 1 - conv

        const arr    = pts.current.geometry.attributes.position.array
        const { N, origins, scattered } = layerData[i]

        for (let j = 0; j < N; j++) {
          arr[j*3]   = scattered[j*3]   * sc + origins[j*3]   * conv
          arr[j*3+1] = scattered[j*3+1] * sc + origins[j*3+1] * conv
          arr[j*3+2] = scattered[j*3+2] * sc + origins[j*3+2] * conv
        }
        pts.current.geometry.attributes.position.needsUpdate = true

        if (mat.current) {
          const base = 0.5 - i * 0.07
          mat.current.opacity = base + conv * 0.45
        }
      })
    }
    
    lastOffset.current = offset

    // Skull mesh: fade out as chunks fly
    const meshConv = 1 - ss(offset, 0.87, 0.91)
    const op = ss(meshConv, 0.55, 1.0)
    mats.u.opacity = op
    mats.l.opacity = op
    mats.t.opacity = op

    if (group.current) group.current.rotation.y += 0.003
  })

  return (
    <group ref={group} {...props} dispose={null}>

      {/* Skull mesh — fades in when fully assembled */}
      <group scale={0.01}>
        <group position={[0, -3.205, 8.376]} rotation={[0.137, 0, 0]}>
          <mesh geometry={nodes.retopo_lower_lower_new_0.geometry}    material={mats.l} />
          <mesh geometry={nodes.incisor_tooth001_tooth_0.geometry}    material={mats.t} />
          <mesh geometry={nodes.incisor_tooth2001_tooth_0.geometry}   material={mats.t} />
          <mesh geometry={nodes.canine_tooth001_tooth_0.geometry}     material={mats.t} />
          <mesh geometry={nodes.premolar_tooth1001_tooth_0.geometry}  material={mats.t} />
          <mesh geometry={nodes.premlar_tooth2001_tooth_0.geometry}   material={mats.t} />
          <mesh geometry={nodes.molar_tooth1001_tooth_0.geometry}     material={mats.t} />
          <mesh geometry={nodes.molar_tooth2001_tooth_0.geometry}     material={mats.t} />
        </group>
        <mesh geometry={nodes['1incisor_tooth_tooth_0'].geometry}     material={mats.t} />
        <mesh geometry={nodes['2incisor_tooth2_tooth_0'].geometry}    material={mats.t} />
        <mesh geometry={nodes['3canine_tooth_tooth_0'].geometry}      material={mats.t} />
        <mesh geometry={nodes['4premolar_tooth1_tooth_0'].geometry}   material={mats.t} />
        <mesh geometry={nodes['5premlar_tooth2_tooth_0'].geometry}    material={mats.t} />
        <mesh geometry={nodes['6molar_tooth1_tooth_0'].geometry}      material={mats.t} />
        <mesh geometry={nodes.molar_tooth2_tooth_0.geometry}          material={mats.t} />
        <mesh geometry={nodes.shikotu_lower_new_0.geometry}           material={mats.l} />
        <mesh geometry={nodes.retopo_upper005_upper_0.geometry}       material={mats.u} />
      </group>

      {/* 5 particle layers — each with its own size, scatter distance, timing */}
      {layerData.map((data, i) => (
        <points
          key={i}
          ref={el => { layerRefs[i].pts.current = el }}
          geometry={data.geo}
          scale={0.01}
        >
          <pointsMaterial
            ref={el => { layerRefs[i].mat.current = el }}
            size={LAYERS[i].size}
            vertexColors
            sizeAttenuation
            transparent
            opacity={0.5 - i * 0.07}
            depthWrite={false}
            alphaMap={dotTex}
            alphaTest={0.01}
          />
        </points>
      ))}

    </group>
  )
}

useGLTF.preload('/models/skull.glb')
