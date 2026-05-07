import React from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, Text, Html, Line, Sphere } from '@react-three/drei'
import * as THREE from 'three'

import Lotus from './models/Lotus'
import Pokeball from './models/Pokeball'
import Wyvern from './models/Wyvern'
import Skull from './models/Skull'

export default function SceneManager() {
  const scroll = useScroll()
  const { camera } = useThree()

  useFrame((state) => {
    if (!scroll) return

    const offset = scroll.offset // 0 to 1

    let targetZ = 10
    let targetX = 0
    let targetY = 2

    let lookAtTarget = new THREE.Vector3(0, 0, 0)

    if (offset < 0.2) {
      // Intro -> Lotus
      const p = offset / 0.2
      targetZ = THREE.MathUtils.lerp(10, -10, p)
      targetX = THREE.MathUtils.lerp(0, 4, p) 
      lookAtTarget.set(0, 0, -15) 
    } else if (offset < 0.4) {
      // Lotus -> Pokeball
      const p = (offset - 0.2) / 0.2
      targetZ = THREE.MathUtils.lerp(-10, -30, p)
      targetX = THREE.MathUtils.lerp(4, -4, p) 
      lookAtTarget.set(0, 0, -35) 
    } else if (offset < 0.6) {
      // Pokeball -> Wyvern
      const p = (offset - 0.4) / 0.2
      targetZ = THREE.MathUtils.lerp(-30, -50, p)
      targetX = THREE.MathUtils.lerp(-4, 4, p) 
      lookAtTarget.set(0, 2, -55) 
    } else if (offset < 0.8) {
      // Wyvern -> Skull
      const p = (offset - 0.6) / 0.2
      targetZ = THREE.MathUtils.lerp(-50, -75, p)
      targetX = THREE.MathUtils.lerp(4, 0, p) 
      targetY = THREE.MathUtils.lerp(2, 5, p) 
      lookAtTarget.set(0, 5, -85) 
    } else {
      // Final approach to Skull
      const p = (offset - 0.8) / 0.2
      targetZ = THREE.MathUtils.lerp(-75, -80, p)
      targetY = THREE.MathUtils.lerp(5, 5, p)
      targetX = 0
      lookAtTarget.set(0, 5, -85)
    }

    camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.05)
    
    const currentLookAt = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position)
    currentLookAt.lerp(lookAtTarget, 0.05)
    camera.lookAt(currentLookAt)
  })

  // Frosted Glass UI Style for Technical Details
  const glassStyle = {
    background: 'rgba(20, 20, 20, 0.4)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '1.5rem',
    color: '#fff',
    fontFamily: 'monospace',
    width: '280px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  }

  return (
    <>
      {/* Intro Text */}
      <group position={[0, 3, 5]}>
        <Text fontSize={2.5} color="#ffffff" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeA.woff" anchorX="center" anchorY="middle" letterSpacing={0.1}>
          GENERATIVE ARCHIVE
        </Text>
        <Text position={[0, -1.5, 0]} fontSize={0.6} color="#888888" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeA.woff" anchorX="center" anchorY="middle">
          Analyzing Spatial Datasets via Neural Implants
        </Text>
        <Html position={[0, -3, 0]} center>
          <div style={{ color: '#6ee7b7', fontFamily: 'monospace', letterSpacing: '2px', fontSize: '12px', animation: 'pulse 2s infinite' }}>
            [ SCROLL TO INITIALIZE SCAN ]
          </div>
        </Html>
      </group>

      {/* Model 1: Lotus */}
      <group position={[0, -0.5, -15]}>
        <Lotus />
        
        {/* Technical UI */}
        <Html position={[-3, 2, 0]} center>
          <div style={glassStyle}>
            <div style={{ color: '#6ee7b7', marginBottom: '8px', fontWeight: 'bold' }}>MODEL: LOTUS_V2</div>
            <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.5' }}>
              &gt; Mesh Analysis: Complete<br/>
              &gt; Polygons: 24,501<br/>
              &gt; Material: PBR Workflow<br/>
              <br/>
              <span style={{ color: '#fff' }}>Click to isolate structural nodes. Hover for dynamic lighting response.</span>
            </div>
          </div>
        </Html>

        {/* Pointer Line */}
        <Line points={[[-1.5, 2, 0], [0, 0.5, 0]]} color="#6ee7b7" lineWidth={1} dashed dashSize={0.1} gapSize={0.1} />
        <Sphere args={[0.05]} position={[0, 0.5, 0]}>
          <meshBasicMaterial color="#6ee7b7" />
        </Sphere>
      </group>

      {/* Model 2: Pokeball */}
      <group position={[0, 0, -35]}>
        <Pokeball />
        
        <Html position={[3, 2, 0]} center>
          <div style={glassStyle}>
            <div style={{ color: '#ff3b30', marginBottom: '8px', fontWeight: 'bold' }}>ANOMALY DETECTED</div>
            <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.5' }}>
              &gt; Energy Signature: High<br/>
              &gt; Containment: Stable<br/>
              &gt; Physics Engine: Active<br/>
              <br/>
              <span style={{ color: '#fff' }}>Interaction required: Tap to discharge excess kinetic energy via particle diffusion.</span>
            </div>
          </div>
        </Html>

        <Line points={[[1.5, 2, 0], [0, 0, 0]]} color="#ff3b30" lineWidth={1} dashed dashSize={0.1} gapSize={0.1} />
      </group>

      {/* Model 3: Wyvern */}
      <group position={[0, -2.5, -55]}>
        <Wyvern />
        
        <Html position={[-4, 4, 0]} center>
          <div style={glassStyle}>
            <div style={{ color: '#a855f7', marginBottom: '8px', fontWeight: 'bold' }}>BIO-RIGGING ENGINE</div>
            <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.5' }}>
              &gt; Skeletal Mesh: Bound<br/>
              &gt; Inverse Kinematics: Active<br/>
              &gt; Target Tracking: Cursor<br/>
              <br/>
              <span style={{ color: '#fff' }}>Entity gaze is locked to user viewport coordinates. Scroll proximity triggers state machine transitions.</span>
            </div>
          </div>
        </Html>

        <Line points={[[-2, 4, 0], [0, 2, 0]]} color="#a855f7" lineWidth={1} dashed dashSize={0.1} gapSize={0.1} />
      </group>

      {/* Model 4: Skull */}
      <group position={[0, 5, -85]}>
        <Skull />
        
        <Html position={[0, -3, 0]} center>
          <div style={{...glassStyle, width: '400px', textAlign: 'center'}}>
            <div style={{ color: '#ffffff', marginBottom: '8px', fontWeight: 'bold', fontSize: '1.2rem' }}>TERMINAL NODE</div>
            <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.5' }}>
              &gt; Instanced Mesh Instantiation<br/>
              &gt; GPU Particle Compute<br/>
              <br/>
              <span style={{ color: '#6ee7b7' }}>System degradation initiated.</span>
            </div>
          </div>
        </Html>
      </group>
    </>
  )
}
