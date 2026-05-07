import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, Environment, AdaptiveDpr, Bvh } from '@react-three/drei'
import { EffectComposer, Noise, Vignette, ToneMapping } from '@react-three/postprocessing'

import SceneElements from './SceneElements'
import HtmlContent from './HtmlContent'

export default function Experience() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 35 }}
      gl={{ 
        antialias: false, // Disabling antialias to save GPU cycles, post-processing can handle it
        powerPreference: "high-performance",
        stencil: false,
        depth: true
      }}
      dpr={[1, 1.5]} // Lowering DPR for better performance on high-res screens
    >
      <color attach="background" args={['#050505']} />
      
      {/* Performance optimization: Adaptive DPR will drop quality if FPS drops */}
      <AdaptiveDpr pixelated />
      
      {/* Lighting for the sleek technical look */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#4338ca" />
      <spotLight position={[0, 10, 0]} intensity={3} angle={0.5} penumbra={1} color="#6ee7b7" />
      
      <Environment preset="studio" />

      <Suspense fallback={null}>
        <Bvh firstHitOnly>
          <ScrollControls pages={6} damping={0.1}>
            
            {/* 3D Scene that reacts to scroll */}
            <SceneElements />

            {/* HTML Overlay that scrolls natively */}
            <Scroll html style={{ width: '100vw' }}>
              <HtmlContent />
            </Scroll>

          </ScrollControls>
        </Bvh>
      </Suspense>

      {/* Optimized post-processing */}
      <EffectComposer disableNormalPass multisampling={0}>
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <ToneMapping adaptive={true} />
      </EffectComposer>
    </Canvas>
  )
}
