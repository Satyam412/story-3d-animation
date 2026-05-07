import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useGLTF, PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'

function Shockwave({ trigger }) {
  const pointsRef = useRef();
  
  const [positions, initialDirections] = useMemo(() => {
    const pos = new Float32Array(1000 * 3);
    const dirs = new Float32Array(1000 * 3);
    for(let i=0; i<1000; i++) {
      pos[i*3] = 0; pos[i*3+1] = 0; pos[i*3+2] = 0;
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(Math.random() * 0.4 + 0.1);
      dirs[i*3] = v.x; dirs[i*3+1] = v.y; dirs[i*3+2] = v.z;
    }
    return [pos, dirs];
  }, []);

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setActive(true);
      for(let i=0; i<1000; i++) {
        pointsRef.current.geometry.attributes.position.array[i*3] = 0;
        pointsRef.current.geometry.attributes.position.array[i*3+1] = 0;
        pointsRef.current.geometry.attributes.position.array[i*3+2] = 0;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      setTimeout(() => setActive(false), 1500);
    }
  }, [trigger]);

  useFrame(() => {
    if (active && pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array;
      for(let i=0; i<1000; i++) {
        pos[i*3] += initialDirections[i*3];
        pos[i*3+1] += initialDirections[i*3+1];
        pos[i*3+2] += initialDirections[i*3+2];
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} visible={active}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial transparent color="#ff3b30" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.8} />
    </points>
  );
}

export default function Pokeball(props) {
  const { nodes, materials } = useGLTF('/models/pokeball.glb')
  const groupRef = useRef()
  const meshRef = useRef()
  const scanRingRef = useRef()
  const [clickCount, setClickCount] = useState(0)
  
  useEffect(() => {
    const mat = materials['Material.002'].clone()
    mat.emissive = new THREE.Color('#ff0000')
    mat.emissiveIntensity = 2
    nodes.Torus002_Material002_0.material = mat
    return () => { mat.dispose(); }
  }, [materials, nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2
      meshRef.current.rotation.y += 0.01;
      
      if (scanRingRef.current) {
        scanRingRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 4;
        scanRingRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 6) * 0.1);
      }
    }
  });

  const handleClick = () => {
    setClickCount(c => c + 1)
    gsap.to(meshRef.current.rotation, {
      y: meshRef.current.rotation.y + Math.PI * 4,
      duration: 1.5,
      ease: 'power3.out'
    })
  }

  return (
    <group {...props} dispose={null}>
      <group ref={groupRef}>
        <group ref={meshRef} position={[0, -32.05, 0]}>
          <group scale={0.01}>
            <group position={[-24.129, 3205.677, 0]} scale={368.844}>
              <mesh geometry={nodes.Sphere_upper_red_0.geometry} material={materials.upper_red} />
              <mesh geometry={nodes.Sphere_lower_white_0.geometry} material={materials.lower_white} />
              <mesh geometry={nodes.Sphere_Material_0.geometry} material={materials.Material} />
            </group>
            <group position={[-24.129, 3205.677, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={352.951}>
              <mesh geometry={nodes.Sphere001_inside_black_0.geometry} material={materials.inside_black} />
              <mesh geometry={nodes.Sphere001_Material_0.geometry} material={materials.Material} />
            </group>
            <mesh geometry={nodes.Cylinder_mettalic_silver002_0.geometry} material={materials['mettalic_silver.002']} position={[-24.129, 3205.677, 335.695]} scale={32.412} />
            <mesh geometry={nodes.Torus_mettalic_silver_0.geometry} material={materials.mettalic_silver} position={[-24.129, 3205.677, 335.695]} scale={91.026} />
            <mesh geometry={nodes.Torus001_mettalic_silver001_0.geometry} material={materials['mettalic_silver.001']} position={[-24.129, 3205.677, 335.695]} rotation={[0, 0, -Math.PI]} scale={[50.618, 50.618, 108.964]} />
            <mesh geometry={nodes.Torus002_Material002_0.geometry} material={materials['Material.002']} position={[-24.129, 3205.677, 350.127]} scale={35.82} />
          </group>
          <mesh visible={false} onClick={handleClick}>
            <sphereGeometry args={[4, 16, 16]} />
            <meshBasicMaterial />
          </mesh>
        </group>
        
        <mesh ref={scanRingRef} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5, 0.05, 16, 100]} />
          <meshBasicMaterial color="#ff3b30" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>

        <Shockwave trigger={clickCount} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/pokeball.glb')
