import React, { useMemo, useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three-stdlib'

// ── Shader Sources ────────────────────────────────────────────────────────────

const XRAY_VERT = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`
const XRAY_FRAG = /* glsl */`
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vec3 vd = normalize(cameraPosition - vWorldPos);
    float cosA = abs(dot(normalize(vNormal), vd));
    float f = pow(1.0 - cosA, 2.5);
    float pulse = 0.8 + 0.2 * sin(uTime * 2.3);
    vec3 col = mix(vec3(0.0, 0.35, 0.28), vec3(0.0, 1.0, 0.8), f) * pulse;
    gl_FragColor = vec4(col, f * 0.9 + 0.04);
  }
`

const HOLO_VERT = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vLocalPos = position;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`
const HOLO_FRAG = /* glsl */`
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;
  void main() {
    vec3 vd = normalize(cameraPosition - vWorldPos);
    float cosA = abs(dot(normalize(vNormal), vd));
    float fresnel = pow(1.0 - cosA, 1.5);
    float scan = step(0.45, fract(vWorldPos.y * 6.0 + uTime * 1.2));
    float glitch = step(0.985, fract(sin(uTime * 11.3 + vLocalPos.y * 4.0) * 43758.5));
    float flicker = 0.88 + 0.12 * sin(uTime * 23.7 + vLocalPos.x * 3.0);
    vec3 base = vec3(0.0, 0.65, 1.0) * (scan * 0.7 + 0.35);
    vec3 edge = vec3(0.4, 1.0, 1.0) * fresnel * 2.2;
    vec3 glt  = vec3(1.0, 0.05, 0.65) * glitch * 3.0;
    vec3 col = (base + edge + glt) * flicker;
    float a = clamp(scan * 0.5 + fresnel * 0.85 + glitch * 0.6, 0.0, 1.0);
    gl_FragColor = vec4(col, a * 0.88);
  }
`

const THERMAL_VERT = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vLocalPos = position;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`
const THERMAL_FRAG = /* glsl */`
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;
  // HSL to RGB helper
  vec3 hsl2rgb(float h, float s, float l) {
    float c = (1.0 - abs(2.0 * l - 1.0)) * s;
    float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
    float m = l - c * 0.5;
    vec3 rgb;
    if      (h < 1.0/6.0) rgb = vec3(c, x, 0.0);
    else if (h < 2.0/6.0) rgb = vec3(x, c, 0.0);
    else if (h < 3.0/6.0) rgb = vec3(0.0, c, x);
    else if (h < 4.0/6.0) rgb = vec3(0.0, x, c);
    else if (h < 5.0/6.0) rgb = vec3(x, 0.0, c);
    else                   rgb = vec3(c, 0.0, x);
    return rgb + m;
  }
  void main() {
    vec3 vd = normalize(cameraPosition - vWorldPos);
    float ndv = abs(dot(normalize(vNormal), vd));
    // Map NDotV to heat: facing camera = hottest
    float heat = pow(ndv, 0.7) * 0.8 + 0.15 * sin(vLocalPos.y * 12.0 + uTime * 1.5);
    heat = clamp(heat, 0.0, 1.0);
    // Hue: 0 = black, 0.1 = violet, 0.2 = blue, 0.4 = cyan, 0.6 = yellow, 0.8+ = red/white
    float hue = mix(0.66, 0.0, heat);
    float sat = mix(0.3, 1.0, heat);
    float lit = mix(0.1, 0.65, heat);
    vec3 col = hsl2rgb(hue, sat, lit);
    col += vec3(1.0) * max(0.0, heat - 0.85) * 2.5;
    gl_FragColor = vec4(col, 1.0);
  }
`

// ── Helpers ───────────────────────────────────────────────────────────────────

function EnableClipping() {
  const { gl } = useThree()
  useEffect(() => { gl.localClippingEnabled = true }, [gl])
  return null
}

function makeDisplaceMat(hex = '#ff7733') {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    roughness: 0.55,
    metalness: 0.2,
    side: THREE.DoubleSide,
  })
  mat.customProgramCacheKey = () => 'skull_displace'
  mat.onBeforeCompile = shader => {
    shader.uniforms.uTime = { value: 0 }
    shader.uniforms.uAmt  = { value: 0.14 }
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
       uniform float uTime;
       uniform float uAmt;`
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
       float d = sin(position.y * 18.0 + uTime * 4.0)
               * cos(position.x * 14.0 + uTime * 2.7)
               * uAmt;
       transformed += normalize(normal) * d;`
    )
    mat.userData.shader = shader
  }
  return mat
}

// ── Shared skull mesh tree ────────────────────────────────────────────────────
// Replicates the original GLB transform hierarchy.

function SkullMeshes({ nodes, mat, lowerMat, toothMat }) {
  const u = mat
  const l = lowerMat || mat
  const t = toothMat || mat
  return (
    <>
      <group position={[0, -3.205, 8.376]} rotation={[0.137, 0, 0]}>
        <mesh geometry={nodes.retopo_lower_lower_new_0.geometry}    material={l} />
        <mesh geometry={nodes.incisor_tooth001_tooth_0.geometry}    material={t} />
        <mesh geometry={nodes.incisor_tooth2001_tooth_0.geometry}   material={t} />
        <mesh geometry={nodes.canine_tooth001_tooth_0.geometry}     material={t} />
        <mesh geometry={nodes.premolar_tooth1001_tooth_0.geometry}  material={t} />
        <mesh geometry={nodes.premlar_tooth2001_tooth_0.geometry}   material={t} />
        <mesh geometry={nodes.molar_tooth1001_tooth_0.geometry}     material={t} />
        <mesh geometry={nodes.molar_tooth2001_tooth_0.geometry}     material={t} />
      </group>
      <mesh geometry={nodes['1incisor_tooth_tooth_0'].geometry}     material={t} />
      <mesh geometry={nodes['2incisor_tooth2_tooth_0'].geometry}    material={t} />
      <mesh geometry={nodes['3canine_tooth_tooth_0'].geometry}      material={t} />
      <mesh geometry={nodes['4premolar_tooth1_tooth_0'].geometry}   material={t} />
      <mesh geometry={nodes['5premlar_tooth2_tooth_0'].geometry}    material={t} />
      <mesh geometry={nodes['6molar_tooth1_tooth_0'].geometry}      material={t} />
      <mesh geometry={nodes.molar_tooth2_tooth_0.geometry}          material={t} />
      <mesh geometry={nodes.shikotu_lower_new_0.geometry}           material={l} />
      <mesh geometry={nodes.retopo_upper005_upper_0.geometry}       material={u} />
    </>
  )
}

// ── Mode 1: DEFAULT ───────────────────────────────────────────────────────────

function DefaultMode({ nodes, materials }) {
  const ref = useRef()
  const mats = useMemo(() => {
    const u = materials.upper.clone()
    u.roughness = 0.9; u.metalness = 0.1
    u.color.set('#c9beaf')
    const l = materials.lower_new.clone()
    l.roughness = 0.9; l.metalness = 0.1
    l.color.set('#c9beaf')
    const t = materials.tooth.clone()
    t.roughness = 0.35; t.metalness = 0.0
    t.color.set('#ede8dc')
    return { u, l, t }
  }, [materials])
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.004 })
  return (
    <group ref={ref} scale={0.01} position={[0, -1, 0]}>
      <SkullMeshes nodes={nodes} mat={mats.u} lowerMat={mats.l} toothMat={mats.t} />
    </group>
  )
}

// ── Mode 2: X-RAY ─────────────────────────────────────────────────────────────

function XRayMode({ nodes }) {
  const ref  = useRef()
  const mRef = useRef()
  const mat  = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: XRAY_VERT,
    fragmentShader: XRAY_FRAG,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])
  mRef.current = mat
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y += 0.005
    mRef.current.uniforms.uTime.value = clock.elapsedTime
  })
  return (
    <group ref={ref} scale={0.01} position={[0, -1, 0]}>
      <SkullMeshes nodes={nodes} mat={mat} />
    </group>
  )
}

// ── Mode 3: HOLOGRAPHIC ───────────────────────────────────────────────────────

function HoloMode({ nodes }) {
  const ref  = useRef()
  const mRef = useRef()
  const mat  = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: HOLO_VERT,
    fragmentShader: HOLO_FRAG,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])
  mRef.current = mat
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y += 0.004
    mRef.current.uniforms.uTime.value = clock.elapsedTime
  })
  return (
    <group ref={ref} scale={0.01} position={[0, -1, 0]}>
      <SkullMeshes nodes={nodes} mat={mat} />
    </group>
  )
}

// ── Mode 4: VERTEX DISPLACEMENT ──────────────────────────────────────────────

function DisplaceMode({ nodes }) {
  const ref = useRef()
  const mat = useMemo(() => makeDisplaceMat('#ff7733'), [])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y += 0.003
    if (mat.userData.shader) mat.userData.shader.uniforms.uTime.value = clock.elapsedTime
  })
  return (
    <group ref={ref} scale={0.01} position={[0, -1, 0]}>
      <SkullMeshes nodes={nodes} mat={mat} />
    </group>
  )
}

// ── Mode 5: WIREFRAME + EDGES ─────────────────────────────────────────────────

function WireframeMode({ nodes }) {
  const ref = useRef()
  const fillMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#080f0c', roughness: 1, side: THREE.DoubleSide,
  }), [])
  const lineMat = useMemo(() => new THREE.LineBasicMaterial({ color: '#00ffaa' }), [])
  const redLine = useMemo(() => new THREE.LineBasicMaterial({ color: '#ff3b30' }), [])

  const edgesCranium = useMemo(() =>
    new THREE.EdgesGeometry(nodes.retopo_upper005_upper_0.geometry, 15), [nodes])
  const edgesJaw = useMemo(() =>
    new THREE.EdgesGeometry(nodes.retopo_lower_lower_new_0.geometry, 15), [nodes])
  const edgesCheek = useMemo(() =>
    new THREE.EdgesGeometry(nodes.shikotu_lower_new_0.geometry, 15), [nodes])

  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.004 })

  return (
    <group ref={ref} scale={0.01} position={[0, -1, 0]}>
      {/* Fill all meshes dark */}
      <SkullMeshes nodes={nodes} mat={fillMat} />
      {/* Glowing edge overlays */}
      <lineSegments geometry={edgesCranium} material={lineMat} />
      <lineSegments geometry={edgesCheek}   material={lineMat} />
      <group position={[0, -3.205, 8.376]} rotation={[0.137, 0, 0]}>
        <lineSegments geometry={edgesJaw} material={redLine} />
      </group>
    </group>
  )
}

// ── Mode 6: SURFACE PARTICLES ─────────────────────────────────────────────────

function ParticlesMode({ nodes }) {
  const ref = useRef()
  const geo = useMemo(() => {
    const srcGeo = nodes.retopo_upper005_upper_0.geometry.clone()
    srcGeo.computeBoundingBox()
    const { min, max } = srcGeo.boundingBox
    const yRange = max.y - min.y

    const mesh    = new THREE.Mesh(srcGeo)
    const sampler = new MeshSurfaceSampler(mesh).build()
    const N       = 14000
    const pts     = new Float32Array(N * 3)
    const cols    = new Float32Array(N * 3)
    const tmp     = new THREE.Vector3()
    const col     = new THREE.Color()

    for (let i = 0; i < N; i++) {
      sampler.sample(tmp)
      pts[i * 3]     = tmp.x
      pts[i * 3 + 1] = tmp.y
      pts[i * 3 + 2] = tmp.z
      // Y gradient: cyan → blue → violet
      const t = (tmp.y - min.y) / yRange
      col.setHSL(0.45 + t * 0.35, 1.0, 0.62)
      cols[i * 3]     = col.r
      cols[i * 3 + 1] = col.g
      cols[i * 3 + 2] = col.b
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pts,  3))
    g.setAttribute('color',    new THREE.BufferAttribute(cols, 3))
    return g
  }, [nodes])

  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.004 })

  return (
    <points ref={ref} geometry={geo} scale={0.01} position={[0, -1, 0]}>
      <pointsMaterial
        size={0.022} vertexColors sizeAttenuation
        transparent opacity={0.95} depthWrite={false}
      />
    </points>
  )
}

// ── Mode 7: INSTANCED GRID ────────────────────────────────────────────────────

function InstancesMode({ nodes }) {
  const ref = useRef()
  const instances = useMemo(() => {
    const grid = [
      [-4.5, 0, -4.5], [0, 0, -4.5], [4.5, 0, -4.5],
      [-4.5, 0,  0  ], [0, 0,  0  ], [4.5, 0,  0  ],
      [-4.5, 0,  4.5], [0, 0,  4.5], [4.5, 0,  4.5],
    ]
    const hues = [0.0, 0.11, 0.22, 0.33, 0.55, 0.66, 0.77, 0.88, 0.95]
    return grid.map((pos, i) => ({
      pos,
      mat: new THREE.MeshStandardMaterial({
        color:    new THREE.Color().setHSL(hues[i], 0.9, 0.5),
        emissive: new THREE.Color().setHSL(hues[i], 0.6, 0.1),
        roughness: 0.55,
        metalness: 0.45,
      }),
    }))
  }, [])

  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.002 })

  return (
    <group ref={ref}>
      {instances.map((inst, i) => (
        <group key={i} position={inst.pos} scale={0.007}>
          <mesh geometry={nodes.retopo_upper005_upper_0.geometry}    material={inst.mat} />
          <mesh geometry={nodes.shikotu_lower_new_0.geometry}        material={inst.mat} />
          <group position={[0, -3.205, 8.376]} rotation={[0.137, 0, 0]}>
            <mesh geometry={nodes.retopo_lower_lower_new_0.geometry} material={inst.mat} />
          </group>
        </group>
      ))}
    </group>
  )
}

// ── Mode 8: CLIPPING PLANE SLICE ──────────────────────────────────────────────

function SlicedMode({ nodes, materials }) {
  const ref   = useRef()
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))

  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: '#d4c5a9', roughness: 0.85, metalness: 0.0,
      side: THREE.DoubleSide,
      clippingPlanes: [plane.current],
      clipShadows: true,
    })
    return m
  }, [])

  // Red inner-face cap (BackSide, no clipping so it fills the cut)
  const capMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#cc2200', roughness: 0.6, metalness: 0.0,
    side: THREE.BackSide,
    clippingPlanes: [plane.current],
  }), [])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y += 0.003
    // Sweep the plane Y constant from ~+1.5 (show top only) to ~-1.5 (show all)
    plane.current.constant = Math.sin(clock.elapsedTime * 0.75) * 1.8
  })

  return (
    <group ref={ref} scale={0.01} position={[0, -1, 0]}>
      <SkullMeshes nodes={nodes} mat={mat} />
      {/* Cap mesh to show red interior at cut face */}
      <SkullMeshes nodes={nodes} mat={capMat} />
    </group>
  )
}

// ── Mode 9: DECOMPOSED ────────────────────────────────────────────────────────

function DecomposedMode({ nodes }) {
  const craniRef  = useRef()
  const jawRef    = useRef()
  const teethRef  = useRef()

  const boneMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d0c4ae', roughness: 0.88, metalness: 0.0,
  }), [])
  const toothMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f0ece0', roughness: 0.32, metalness: 0.0,
  }), [])
  const emitMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c0b090', roughness: 0.88, metalness: 0.0,
    emissive: '#331100', emissiveIntensity: 0.6,
  }), [])

  useFrame(({ clock }) => {
    const t = (Math.sin(clock.elapsedTime * 0.75) + 1) * 0.5 // 0 → 1
    if (craniRef.current) {
      craniRef.current.position.y  =  t * 2.4
      craniRef.current.rotation.x  =  t * 0.35
      craniRef.current.rotation.z  =  Math.sin(clock.elapsedTime * 0.5) * t * 0.12
    }
    if (jawRef.current) {
      jawRef.current.position.y    = -t * 1.8
      jawRef.current.position.z    =  t * 0.9
      jawRef.current.rotation.x    = -t * 0.55
    }
    if (teethRef.current) {
      teethRef.current.position.z  =  t * 1.6
      teethRef.current.position.y  =  t * 0.5
      teethRef.current.rotation.x  = -t * 0.2
    }
  })

  return (
    <group scale={0.01} position={[0, -0.5, 0]}>
      {/* Cranium + cheekbone float up */}
      <group ref={craniRef}>
        <mesh geometry={nodes.retopo_upper005_upper_0.geometry} material={boneMat} />
        <mesh geometry={nodes.shikotu_lower_new_0.geometry}     material={emitMat} />
      </group>

      {/* Upper teeth fly forward */}
      <group ref={teethRef}>
        <mesh geometry={nodes['1incisor_tooth_tooth_0'].geometry}   material={toothMat} />
        <mesh geometry={nodes['2incisor_tooth2_tooth_0'].geometry}  material={toothMat} />
        <mesh geometry={nodes['3canine_tooth_tooth_0'].geometry}    material={toothMat} />
        <mesh geometry={nodes['4premolar_tooth1_tooth_0'].geometry} material={toothMat} />
        <mesh geometry={nodes['5premlar_tooth2_tooth_0'].geometry}  material={toothMat} />
        <mesh geometry={nodes['6molar_tooth1_tooth_0'].geometry}    material={toothMat} />
        <mesh geometry={nodes.molar_tooth2_tooth_0.geometry}        material={toothMat} />
      </group>

      {/* Lower jaw drops */}
      <group ref={jawRef} position={[0, -3.205, 8.376]} rotation={[0.137, 0, 0]}>
        <mesh geometry={nodes.retopo_lower_lower_new_0.geometry}   material={boneMat} />
        <mesh geometry={nodes.incisor_tooth001_tooth_0.geometry}   material={toothMat} />
        <mesh geometry={nodes.incisor_tooth2001_tooth_0.geometry}  material={toothMat} />
        <mesh geometry={nodes.canine_tooth001_tooth_0.geometry}    material={toothMat} />
        <mesh geometry={nodes.premolar_tooth1001_tooth_0.geometry} material={toothMat} />
        <mesh geometry={nodes.premlar_tooth2001_tooth_0.geometry}  material={toothMat} />
        <mesh geometry={nodes.molar_tooth1001_tooth_0.geometry}    material={toothMat} />
        <mesh geometry={nodes.molar_tooth2001_tooth_0.geometry}    material={toothMat} />
      </group>
    </group>
  )
}

// ── Mode 10: THERMAL IMAGING ──────────────────────────────────────────────────

function ThermalMode({ nodes }) {
  const ref  = useRef()
  const mRef = useRef()
  const mat  = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: THERMAL_VERT,
    fragmentShader: THERMAL_FRAG,
    side: THREE.DoubleSide,
  }), [])
  mRef.current = mat
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y += 0.004
    mRef.current.uniforms.uTime.value = clock.elapsedTime
  })
  return (
    <group ref={ref} scale={0.01} position={[0, -1, 0]}>
      <SkullMeshes nodes={nodes} mat={mat} />
    </group>
  )
}

// ── Main Export ───────────────────────────────────────────────────────────────

export default function SkullTestLab({ mode = 'DEFAULT', onStats }) {
  const { nodes, materials } = useGLTF('/models/skull.glb')

  useEffect(() => {
    if (!onStats) return
    let verts = 0, meshes = 0
    Object.values(nodes).forEach(n => {
      if (n.isMesh && n.geometry?.attributes?.position) {
        verts  += n.geometry.attributes.position.count
        meshes += 1
      }
    })
    onStats({ vertices: verts, meshes })
  }, [nodes, onStats])

  return (
    <>
      <EnableClipping />
      {mode === 'DEFAULT'      && <DefaultMode    nodes={nodes} materials={materials} />}
      {mode === 'XRAY'         && <XRayMode       nodes={nodes} />}
      {mode === 'HOLOGRAPHIC'  && <HoloMode       nodes={nodes} />}
      {mode === 'DISPLACEMENT' && <DisplaceMode   nodes={nodes} />}
      {mode === 'WIREFRAME'    && <WireframeMode  nodes={nodes} />}
      {mode === 'PARTICLES'    && <ParticlesMode  nodes={nodes} />}
      {mode === 'INSTANCES'    && <InstancesMode  nodes={nodes} />}
      {mode === 'SLICED'       && <SlicedMode     nodes={nodes} materials={materials} />}
      {mode === 'DECOMPOSED'   && <DecomposedMode nodes={nodes} />}
      {mode === 'THERMAL'      && <ThermalMode    nodes={nodes} />}
    </>
  )
}

useGLTF.preload('/models/skull.glb')
