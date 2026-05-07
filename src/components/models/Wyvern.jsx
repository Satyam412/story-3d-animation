import React, { useEffect } from 'react'
import { useGraph, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

export default function Wyvern(props) {
  const group = React.useRef()
  const { scene, animations } = useGLTF('/models/wyvern.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, group)
  const { pointer } = useThree()

  const headBone = React.useRef(null)

  useEffect(() => {
    const actionNames = Object.keys(actions)
    const idleAnim = actionNames.find(n => n.toLowerCase().includes('idle') || n.toLowerCase().includes('breath')) || actionNames[0]
    
    if (actions[idleAnim]) {
      actions[idleAnim].reset().fadeIn(0.5).play()
    }

    // Find head bone once
    clone.traverse((child) => {
      if (child.isBone && child.name.toLowerCase().includes('head')) {
        headBone.current = child
      }
    })
  }, [actions, clone])

  useFrame(() => {
    if (!group.current) return;
    
    if (headBone.current) {
      const target = new THREE.Vector3(pointer.x * 5, pointer.y * 5, 5)
      if (!headBone.current.userData.originalRotation) headBone.current.userData.originalRotation = headBone.current.rotation.clone()
      
      headBone.current.lookAt(target)
      headBone.current.rotation.x = THREE.MathUtils.lerp(headBone.current.userData.originalRotation.x, headBone.current.rotation.x, 0.2)
      headBone.current.rotation.y = THREE.MathUtils.lerp(headBone.current.userData.originalRotation.y, headBone.current.rotation.y, 0.2)
    }
    
    // Add slow levitation
    group.current.position.y = Math.sin(Date.now() * 0.001) * 0.2;
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.239}>
          <group name="df05234dce964730bfd8622418b3fca4fbx" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Cube" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                <group name="metarig" position={[0, -481.299, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <group name="Object_6">
                    <primitive object={nodes._rootJoint} />
                    <group name="Object_8" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                    <skinnedMesh name="Object_9" geometry={nodes.Object_9.geometry} material={materials['Material.002']} skeleton={nodes.Object_9.skeleton} />
                    <skinnedMesh name="Object_10" geometry={nodes.Object_10.geometry} material={materials['Material.011']} skeleton={nodes.Object_10.skeleton} />
                    <skinnedMesh name="Object_11" geometry={nodes.Object_11.geometry} material={materials['Material.005']} skeleton={nodes.Object_11.skeleton} />
                    <skinnedMesh name="Object_12" geometry={nodes.Object_12.geometry} material={materials['Material.003']} skeleton={nodes.Object_12.skeleton} />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/wyvern.glb')
