import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

import Lotus from './models/Lotus'
import Pokeball from './models/Pokeball'
import Wyvern from './models/Wyvern'
import Skull from './models/Skull'

export default function SceneElements() {
  const scroll = useScroll()
  const { viewport } = useThree()
  
  const group1 = useRef()
  const group2 = useRef()
  const group3 = useRef()
  const group4 = useRef()
  const introGroup = useRef()

  useFrame((state) => {
    if (!scroll) return
    const offset = scroll.offset

    // We have 6 pages, meaning max offset is 1.0. The breakpoints are approx:
    // P1: 0 - 0.2 (Intro)
    // P2: 0.2 - 0.4 (Lotus)
    // P3: 0.4 - 0.6 (Pokeball)
    // P4: 0.6 - 0.8 (Wyvern)
    // P5: 0.8 - 1.0 (Skull)
    // We want the models to slide in smoothly from the bottom or sides based on scroll.

    // 1. Intro particles (fade out as we scroll)
    if (introGroup.current) {
      introGroup.current.position.y = offset * 10
      introGroup.current.rotation.y = state.clock.elapsedTime * 0.1
    }

    // Helper function to animate sections based on scroll ranges
    // r1: start visible, r2: fully visible, r3: start hiding, r4: hidden
    const animateSection = (ref, startIn, fullIn, startOut, hiddenOut, xPos, yOffset = 0) => {
      if (!ref.current) return
      let y = -viewport.height * 1.5 // hidden far below
      let scale = 0

      if (offset >= startIn && offset <= fullIn) {
        // animating in
        const p = (offset - startIn) / (fullIn - startIn)
        y = THREE.MathUtils.lerp(-viewport.height, 0, p)
        scale = THREE.MathUtils.lerp(0.5, 1, p)
      } else if (offset > fullIn && offset < startOut) {
        // fully visible
        y = 0
        scale = 1
      } else if (offset >= startOut && offset <= hiddenOut) {
        // animating out
        const p = (offset - startOut) / (hiddenOut - startOut)
        y = THREE.MathUtils.lerp(0, viewport.height, p)
        scale = THREE.MathUtils.lerp(1, 0.5, p)
      } else if (offset > hiddenOut) {
        y = viewport.height * 1.5
        scale = 0
      }

      ref.current.position.set(xPos, y + yOffset, 0)
      ref.current.scale.set(scale, scale, scale)
    }

    // P2: Lotus (HTML right, Lotus left)
    // Range: Starts at 0.05, full at 0.15, starts hiding at 0.25, gone at 0.35
    animateSection(group1, 0.05, 0.15, 0.25, 0.35, -viewport.width / 4, 0)

    // P3: Pokeball (HTML left, Pokeball right)
    // Range: Starts at 0.25, full at 0.35, starts hiding at 0.45, gone at 0.55
    animateSection(group2, 0.25, 0.35, 0.45, 0.55, viewport.width / 4, 0)

    // P4: Wyvern (HTML right, Wyvern left)
    // Range: Starts at 0.45, full at 0.55, starts hiding at 0.65, gone at 0.75
    animateSection(group3, 0.45, 0.55, 0.65, 0.75, -viewport.width / 4, -2)

    // P5: Skull (HTML center, Skull center)
    // Range: Starts at 0.65, full at 0.75. Stays till the end.
    if (group4.current) {
      if (offset < 0.65) {
        group4.current.position.y = -viewport.height
      } else if (offset >= 0.65 && offset <= 0.75) {
        const p = (offset - 0.65) / 0.1
        group4.current.position.y = THREE.MathUtils.lerp(-viewport.height, 0, p)
      } else {
        group4.current.position.y = 0
      }
      group4.current.position.x = 0
    }

    // New Performance Optimization: Hide groups when they are far outside the viewport
    if (group1.current) group1.current.visible = offset < 0.4
    if (group2.current) group2.current.visible = offset > 0.2 && offset < 0.6
    if (group3.current) group3.current.visible = offset > 0.4 && offset < 0.8
    if (group4.current) group4.current.visible = offset > 0.6
  })

  return (
    <>
      <group ref={introGroup}>
        <Sparkles count={500} scale={20} size={5} speed={0.4} opacity={0.3} color="#ffffff" />
      </group>

      <group ref={group1}>
        <group scale={3}>
          <Lotus />
        </group>
      </group>

      <group ref={group2}>
        <group scale={0.6}>
          <Pokeball />
        </group>
      </group>

      <group ref={group3}>
        <group scale={1.8} rotation={[0, Math.PI / 4, 0]}>
          <Wyvern />
        </group>
      </group>

      <group ref={group4}>
        <group scale={1.5} position={[0, -1, 0]}>
          <Skull />
        </group>
      </group>
    </>
  )
}
