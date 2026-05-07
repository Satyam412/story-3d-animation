import React, { useState, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import SkullTestLab from './SkullTestLab'

const MODES = [
  {
    id: 'DEFAULT',
    label: 'Default',
    tech: 'Material Cloning',
    desc: 'Clone each material slot (upper / lower_new / tooth) and override roughness, metalness, and color without polluting the shared GLB cache.',
  },
  {
    id: 'XRAY',
    label: 'X-Ray',
    tech: 'ShaderMaterial · Fresnel · Additive',
    desc: 'Custom ShaderMaterial with fresnel (1 − N·V)² driving both opacity and rim brightness. DoubleSide + AdditiveBlending + depthWrite=false gives the see-through glow.',
  },
  {
    id: 'HOLOGRAPHIC',
    label: 'Holographic',
    tech: 'ShaderMaterial · Scanlines · Glitch',
    desc: 'GLSL scanlines from fract(worldY · freq + time), stochastic glitch via fract(sin(t)·large), fresnel edge glow, and per-vertex flicker — all in a single ShaderMaterial.',
  },
  {
    id: 'THERMAL',
    label: 'Thermal',
    tech: 'ShaderMaterial · HSL · NDotV',
    desc: 'Inline HSL→RGB in GLSL. Maps NdotV (camera-facing = hottest) to a hue sweep from deep violet → cyan → yellow → white hot. Adds sine noise for heat shimmer.',
  },
  {
    id: 'DISPLACEMENT',
    label: 'Displacement',
    tech: 'onBeforeCompile · Vertex Shader Injection',
    desc: 'Injects a sin(y·18+t)·cos(x·14+t)·amount term into the #include <begin_vertex> chunk of MeshStandardMaterial — deforms geometry on the GPU while preserving all PBR lighting.',
  },
  {
    id: 'WIREFRAME',
    label: 'Wireframe',
    tech: 'EdgesGeometry · lineSegments',
    desc: 'EdgesGeometry(geo, 15°) extracts only hard feature edges. Cranium rendered in cyan, jaw in red, over a near-black fill mesh — showing topology without every triangle edge.',
  },
  {
    id: 'PARTICLES',
    label: 'Particles',
    tech: 'MeshSurfaceSampler · vertexColors',
    desc: '14,000 points placed with MeshSurfaceSampler on the cranium geometry. Each point colored by Y position via setHSL(0.45 + t·0.35) giving a cyan-to-violet gradient.',
  },
  {
    id: 'INSTANCES',
    label: 'Instances',
    tech: '9-Clone Grid · Per-Instance HSL',
    desc: 'Nine skull clones in a 3×3 grid. Each shares the same geometry buffer (zero extra GPU memory) but gets its own MeshStandardMaterial with a unique setHSL hue and emissive.',
  },
  {
    id: 'SLICED',
    label: 'Sliced',
    tech: 'THREE.Plane · localClippingEnabled',
    desc: 'A THREE.Plane with normal (0,1,0) animates its constant through the skull in world-space. A BackSide red cap mesh fills the cut face, revealing bone cross-section.',
  },
  {
    id: 'DECOMPOSED',
    label: 'Decomposed',
    tech: 'Per-Group Transform Animation',
    desc: 'GLB hierarchy split into three ref groups (cranium, upper teeth, lower jaw). Each driven by sin(t) in useFrame — cranium lifts, jaw drops, teeth fly forward independently.',
  },
]

const ACCENT  = '#6ee7b7'
const PANEL   = 'rgba(4, 8, 6, 0.9)'
const BORDER  = 'rgba(110, 231, 183, 0.18)'
const DIM     = '#3a3a3a'

const btn = (active) => ({
  background:    active ? ACCENT : PANEL,
  color:         active ? '#050505' : ACCENT,
  border:        `1px solid ${active ? ACCENT : BORDER}`,
  borderRadius:  3,
  padding:       '6px 13px',
  fontSize:      9,
  letterSpacing: 2,
  cursor:        'pointer',
  fontFamily:    'monospace',
  backdropFilter:'blur(10px)',
  transition:    'all 0.12s',
  textTransform: 'uppercase',
  outline:       'none',
})

const glass = {
  background:    PANEL,
  border:        `1px solid ${BORDER}`,
  backdropFilter:'blur(14px)',
  borderRadius:  5,
}

export default function SkullTestExperience() {
  const [mode,  setMode]  = useState('DEFAULT')
  const [stats, setStats] = useState({ vertices: 0, meshes: 0 })
  const onStats = useCallback(s => setStats(s), [])

  const info = MODES.find(m => m.id === mode)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#050505' }}>

      {/* ── Canvas ── */}
      <Canvas
        camera={{ position: [0, 0, 9], fov: 42 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        shadows
      >
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]}  intensity={2.5} castShadow />
        <directionalLight position={[-8, -8, -4]} intensity={0.8} color="#4338ca" />
        <spotLight position={[0, 8, 0]} intensity={3} angle={0.5} penumbra={1} color="#6ee7b7" />
        <Environment preset="studio" />

        <Suspense fallback={null}>
          <SkullTestLab mode={mode} onStats={onStats} />
        </Suspense>

        <OrbitControls makeDefault enablePan={false} minDistance={2} maxDistance={22} />

        <EffectComposer disableNormalPass>
          <Bloom intensity={0.55} luminanceThreshold={0.18} luminanceSmoothing={0.9} />
          <Vignette eskil={false} offset={0.12} darkness={1.15} />
        </EffectComposer>
      </Canvas>

      {/* ── HTML Overlay ── */}
      <div style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        fontFamily: 'monospace',
      }}>

        {/* Header */}
        <div style={{ ...glass, position: 'absolute', top: 20, left: 20, padding: '10px 18px', pointerEvents: 'all' }}>
          <div style={{ color: ACCENT, fontSize: 9, letterSpacing: 4, marginBottom: 5 }}>
            SKULL.GLB — MANIPULATION LAB
          </div>
          <div style={{ color: DIM, fontSize: 8, letterSpacing: 2 }}>
            {stats.vertices.toLocaleString()} VERTS &nbsp;·&nbsp; {stats.meshes} MESHES &nbsp;·&nbsp; 3 MAT SLOTS &nbsp;·&nbsp; DRAG TO ORBIT
          </div>
        </div>

        {/* Back */}
        <a
          href="/"
          style={{
            ...glass,
            position: 'absolute', top: 20, right: 20,
            padding: '8px 16px',
            color: DIM,
            fontSize: 9, letterSpacing: 2,
            textDecoration: 'none',
            textTransform: 'uppercase',
            pointerEvents: 'all',
            display: 'block',
          }}
        >
          ← Main Scene
        </a>

        {/* Mode info card */}
        <div style={{
          ...glass,
          position: 'absolute',
          bottom: 96, left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 22px',
          maxWidth: 520,
          minWidth: 300,
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{ color: ACCENT, fontSize: 9, letterSpacing: 3, marginBottom: 4 }}>
            {info?.label?.toUpperCase()} &nbsp;—&nbsp; {info?.tech?.toUpperCase()}
          </div>
          <div style={{ color: '#6a6a6a', fontSize: 9, lineHeight: 1.7, letterSpacing: 0.4 }}>
            {info?.desc}
          </div>
        </div>

        {/* Mode Buttons */}
        <div style={{
          position: 'absolute',
          bottom: 24, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 5,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '92vw',
          pointerEvents: 'all',
        }}>
          {MODES.map(m => (
            <button key={m.id} style={btn(mode === m.id)} onClick={() => setMode(m.id)}>
              {m.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
