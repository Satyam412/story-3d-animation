import React, { useRef, useState } from 'react'
import { useGLTF, Float } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

export default function Lotus(props) {
  const { nodes, materials } = useGLTF('/models/lotus.glb')
  const group = useRef()
  const carBody = useRef()
  const { pointer } = useThree()
  const [hovered, setHovered] = useState(false)
  
  // Create a custom material variant
  const [paintMat] = useState(() => {
    const m = materials.paint__paint.clone()
    m.roughness = 0.2
    m.metalness = 0.8
    return m
  })

  useFrame((state) => {
    if (!group.current) return;
    // Smooth tilt based on mouse
    const targetX = (pointer.x * Math.PI) / 8;
    const targetY = (pointer.y * Math.PI) / 8;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.1);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 0.1);
    
    // Scale up slightly on hover
    const targetScale = hovered ? 1.05 : 1;
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    
    // "AI Scan" effect: turn shell into wireframe when hovered
    paintMat.wireframe = hovered;
  });

  const handleClick = () => {
    // 360 Spin
    gsap.to(carBody.current.rotation, {
      y: carBody.current.rotation.y + Math.PI * 2,
      duration: 1.5,
      ease: "power2.inOut"
    });
    // Change color flash
    gsap.to(paintMat.color, {
      r: Math.random(),
      g: Math.random(),
      b: Math.random(),
      duration: 0.5,
      yoyo: true,
      repeat: 1
    });
  }

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1} {...props}>
      <group 
        ref={group} 
        onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
        onClick={handleClick}
      >
        <group ref={carBody} rotation={[-Math.PI / 2, 0, 0]} scale={2}>
          <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group position={[3.757, 3.471, -5.846]} rotation={[-0.041, -0.006, -0.047]}>
              <group rotation={[-1.495, -0.039, 0.006]}>
                <mesh geometry={nodes.Cylinder_025_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                <mesh geometry={nodes.Cylinder_025_SUB2_engine__engine_0.geometry} material={materials.engine__engine} />
                <mesh geometry={nodes.Cylinder_025_SUB1_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
              </group>
            </group>
            <group position={[3.905, 2.58, 17.368]} rotation={[-0.051, 0, 0]}>
              <mesh geometry={nodes.Cylinder_260_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
              <mesh geometry={nodes.Cylinder_261_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
              <group position={[2.313, 0.01, -1.741]} rotation={[3.025, -0.001, 3.132]}>
                <mesh geometry={nodes.Cylinder_264_2_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} rotation={[-Math.PI / 2, 0, 0]} />
                <mesh geometry={nodes.Cylinder_127_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
              </group>
            </group>
            <group position={[-3.905, 2.58, 17.368]} rotation={[-0.113, 0, 0]}>
              <mesh geometry={nodes.Cylinder_126_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
              <mesh geometry={nodes.Cylinder_129_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
              <group position={[-2.313, 0.071, -1.727]} rotation={[3.025, -0.028, -3.138]}>
                <mesh geometry={nodes.Cylinder_263_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
                <mesh geometry={nodes.Cylinder_262_2_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} rotation={[-Math.PI / 2, 0, 0]} />
              </group>
            </group>
            <group position={[3.678, 1.616, 15.074]}>
              <mesh geometry={nodes.Cylinder_259_2_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} rotation={[-Math.PI / 2, 0, 0]} />
            </group>
            <mesh geometry={nodes.Cube_052_2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} rotation={[-Math.PI / 2, 0, 0]} />
            <group position={[0, 8.341, -20.833]} rotation={[-0.017, 0, 0]}>
              <mesh geometry={nodes.Cube_042_2_paint__paint_0.geometry} material={paintMat} rotation={[-1.553, 0, 0]} />
            </group>
            <mesh geometry={nodes.Cylinder_117_2_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cylinder_208_2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} rotation={[-Math.PI / 2, 0, 0]} />
            <group position={[4.129, 1.914, 23.62]} rotation={[-0.017, 0, 0]}>
              <mesh geometry={nodes.Cube_010_2_paint__paint_0.geometry} material={paintMat} rotation={[-1.553, 0, 0]} />
            </group>
            <mesh geometry={nodes.Cube_008_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cube_029_2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cube_006_2_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cylinder_056_2_gauge_glass_0.geometry} material={materials.gauge_glass} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cylinder_197_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
            <group position={[1.895, 3.442, -13.856]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cylinder_007_SUB0_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                <mesh geometry={nodes.Cylinder_007_SUB2_brakedisc__Brake_Disc_01_png_0.geometry} material={materials.brakedisc__Brake_Disc_01_png} />
                <mesh geometry={nodes.Cylinder_007_SUB1_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                <mesh geometry={nodes.Cylinder_007_SUB3_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
              </group>
            </group>
            <group position={[-3.678, 1.616, 15.074]} rotation={[0.039, 0.004, 0]}>
              <mesh geometry={nodes.Cylinder_086_2_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} rotation={[-Math.PI / 2, 0, 0]} />
            </group>
            <group position={[2.099, 1.549, -12.534]} rotation={[0, 0, 0.056]}>
              <group position={[0.854, -0.783, -0.65]} rotation={[0, 0, -0.05]}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh geometry={nodes.Cylinder_054_SUB1_blacknouv__blackuv_0.geometry} material={materials.blacknouv__blackuv} />
                  <mesh geometry={nodes.Cylinder_054_SUB0_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
                </group>
              </group>
              <mesh geometry={nodes.Cylinder_113_SUB2_blacknouv__blackuv_0.geometry} material={materials.blacknouv__blackuv} />
              <mesh geometry={nodes.Cylinder_113_SUB1_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
              <mesh geometry={nodes.Cylinder_113_SUB0_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
            </group>
            <group position={[1.629, 1.128, -13.584]} rotation={[0, 0, 0.135]} scale={[1.034, 1.001, 1]}>
              <mesh geometry={nodes.Cylinder_554_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
              <mesh geometry={nodes.Cylinder_554_SUB1_engine__engine_0.geometry} material={materials.engine__engine} />
              <mesh geometry={nodes.Cylinder_554_SUB2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
            </group>
            <group position={[2.295, 8.694, 0.004]} rotation={[-Math.PI / 2, 0, 0]}>
              <group position={[-1.481, -8.103, -2.234]} rotation={[Math.PI / 2, 0, 2.055]}>
                <mesh geometry={nodes.Cube_056_2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <group position={[-1.481, -8.103, -2.295]} rotation={[Math.PI / 2, 0, -1.71]}>
                <mesh geometry={nodes.Cube_024_2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <group position={[-3.107, -8.103, -2.295]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cube_055_2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <group position={[-3.107, -8.103, -2.234]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cube_100_2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <group position={[-2.153, -6.448, -2.661]} rotation={[1.815, 0, 0]}>
                <group position={[-0.142, -7.414, -4.801]} rotation={[-0.244, 0, 0]}>
                  <mesh geometry={nodes.GEO_Steer_SUB1_steeringwheel__dashboard_0.geometry} material={materials.steeringwheel__dashboard} />
                  <mesh geometry={nodes.GEO_Steer_SUB0_steeringwheel_2__steeringwheel_0.geometry} material={materials.steeringwheel_2__steeringwheel} />
                  <mesh geometry={nodes.GEO_Steer_SUB2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
                </group>
              </group>
              <group position={[-4.286, -7.17, -5.608]} rotation={[Math.PI / 2, 0, 0.401]}>
                <mesh geometry={nodes.Cylinder_54_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} position={[0.027, 0.016, 0.049]} rotation={[-Math.PI / 2, 0.401, 0]} />
              </group>
              <group position={[-2.294, -8.086, -2.261]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                <mesh geometry={nodes.polymsh_detached_2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} rotation={[0, 0, -0.001]} />
              </group>
              <group position={[-2.294, -8.086, -2.261]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cylinder_078_2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <mesh geometry={nodes.Cylinder_337_2_engine__engine_0.geometry} material={materials.engine__engine} />
              <mesh geometry={nodes.Cylinder_311_2_cockpit_metal__cockpit_metal_0.geometry} material={materials.cockpit_metal__cockpit_metal} position={[-0.173, -0.066, 0.112]} />
              <mesh geometry={nodes.Circle_001_2_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
              <mesh geometry={nodes.Cylinder_128_2_dashboard__dashboard_0.geometry} material={materials.dashboard__dashboard} />
              <mesh geometry={nodes.Cylinder_121_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
              <mesh geometry={nodes.Cube_064_2_seat__dashboard_0.geometry} material={materials.seat__dashboard} />
              <mesh geometry={nodes.Cylinder_057_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
              <mesh geometry={nodes.Cylinder_055_2_full_chrome__cockpit_metal_0.geometry} material={materials.full_chrome__cockpit_metal} />
            </group>
            <mesh geometry={nodes.Cylinder_549_2_cockpit_metal__cockpit_metal_0.geometry} material={materials.cockpit_metal__cockpit_metal} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cylinder_135_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cylinder_340_2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cylinder_189_2_blacknouv__blackuv_0.geometry} material={materials.blacknouv__blackuv} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.LAMP_2_light__light_png_0.geometry} material={materials.light__light_png} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.mirrors_2_MIRROR_PLACEMENT__MIRROR_PLACEMENT_dds_0.geometry} material={materials.MIRROR_PLACEMENT__MIRROR_PLACEMENT_dds} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cube_005_2_logo__Logo_dds_0.geometry} material={materials.logo__Logo_dds} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cylinder_316_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
            <group position={[3.742, 4.544, -13.191]} rotation={[0, 0, 0.096]} scale={[0.97, 1, 1]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cube_003_SUB2_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                <mesh geometry={nodes.Cube_003_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                <mesh geometry={nodes.Cube_003_SUB1_engine__engine_0.geometry} material={materials.engine__engine} />
              </group>
            </group>
            <group position={[7.419, 2.824, 15.151]} rotation={[0, 0, 0.026]}>
              <group position={[-0.188, 0.59, 1.317]} rotation={[0, -0.001, 3.13]}>
                <group rotation={[Math.PI / 2, 0, Math.PI]}>
                  <mesh geometry={nodes.Cylinder_342_SUB1_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                  <mesh geometry={nodes.Cylinder_342_SUB0_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
                </group>
              </group>
              <group position={[0.694, 0, -0.023]}>
                <mesh geometry={nodes.Cylinder_105_2_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} rotation={[-Math.PI / 2, 0, 0]} />
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh geometry={nodes.Cube_068_SUB0_blacknouv__blackuv_0.geometry} material={materials.blacknouv__blackuv} />
                  <mesh geometry={nodes.Cube_068_SUB1_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                </group>
                <group position={[-1.014, -0.022, 0.009]} rotation={[-0.02, -0.048, 3.098]}>
                  <mesh geometry={nodes.Cylinder_552_SUB1_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                  <mesh geometry={nodes.Cylinder_552_SUB0_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
                </group>
              </group>
              <group position={[0.694, 0, -0.023]} scale={0.961}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh geometry={nodes.Cylinder_273_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                  <mesh geometry={nodes.Cylinder_273_SUB1_engine__engine_0.geometry} material={materials.engine__engine} />
                </group>
                <mesh geometry={nodes.Cylinder_269_2_rims__rims_0.geometry} material={materials.rims__rims} rotation={[-Math.PI / 2, 0, 0]} />
                <mesh geometry={nodes.Cube_045_2_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} rotation={[-Math.PI / 2, 0, 0]} />
                <mesh geometry={nodes.Cylinder_267_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh geometry={nodes.Cylinder_268_SUB1_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
                  <mesh geometry={nodes.Cylinder_268_SUB0_engine__engine_0.geometry} material={materials.engine__engine} />
                </group>
                <mesh geometry={nodes.Cylinder_270_2_tyres__Tyres_D2_dds_0.geometry} material={materials.tyres__Tyres_D2_dds} />
              </group>
            </group>
            <mesh geometry={nodes.Cylinder_207_2_engine__engine_0.geometry} material={materials.engine__engine} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cube_001_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cylinder_003_2_engine__engine_0.geometry} material={materials.engine__engine} rotation={[-Math.PI / 2, 0, 0]} />
            <group position={[-4.508, 3.951, 15.128]} rotation={[0, 0, 0.001]}>
              <mesh geometry={nodes.Cylinder_266_2_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} rotation={[-Math.PI / 2, 0, 0]} />
              <mesh geometry={nodes.Cylinder_033_2_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} rotation={[-Math.PI / 2, 0, 0]} />
            </group>
            <group position={[4.508, 3.951, 15.128]} rotation={[-0.021, 0.018, -0.007]}>
              <mesh geometry={nodes.Cylinder_265_2_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} rotation={[-Math.PI / 2, 0, 0]} />
              <mesh geometry={nodes.Cylinder_059_2_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} rotation={[-Math.PI / 2, 0, 0]} />
            </group>
            <mesh geometry={nodes.Cylinder_132_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
            <group position={[2.259, 3.452, -13.856]} rotation={[-Math.PI / 2, -0.08, 0]}>
              <group rotation={[Math.PI / 2, 0, 0.032]}>
                <mesh geometry={nodes.Cylinder_028_SUB1_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                <mesh geometry={nodes.Cylinder_028_SUB0_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
              </group>
            </group>
            <mesh geometry={nodes.Cube_018_2_seat__dashboard_0.geometry} material={materials.seat__dashboard} rotation={[-Math.PI / 2, 0, 0]} />
            <group position={[-7.419, 2.823, 15.151]} rotation={[0, 0, -0.026]}>
              <group position={[0.189, 0.567, 1.317]} rotation={[0, 0.001, 0.025]}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh geometry={nodes.Cylinder_112_SUB1_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                  <mesh geometry={nodes.Cylinder_112_SUB0_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
                </group>
              </group>
              <group position={[-0.694, 0, -0.023]}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh geometry={nodes.Cube_047_SUB0_blacknouv__blackuv_0.geometry} material={materials.blacknouv__blackuv} />
                  <mesh geometry={nodes.Cube_047_SUB1_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                </group>
                <mesh geometry={nodes.Cylinder_271_2_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} rotation={[-Math.PI / 2, 0, 0]} />
                <group position={[1.014, 0.001, 0.009]} rotation={[3.141, -0.049, -0.036]}>
                  <group rotation={[-3.141, -0.049, 0.01]}>
                    <mesh geometry={nodes.Cylinder_097_SUB1_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                    <mesh geometry={nodes.Cylinder_097_SUB0_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
                  </group>
                </group>
              </group>
              <group position={[-0.694, 0, -0.023]} scale={0.961}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh geometry={nodes.Cylinder_255_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                  <mesh geometry={nodes.Cylinder_255_SUB1_engine__engine_0.geometry} material={materials.engine__engine} />
                </group>
                <mesh geometry={nodes.Cube_017_2_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} rotation={[-Math.PI / 2, 0, 0]} />
                <mesh geometry={nodes.Cylinder_213_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
                <mesh geometry={nodes.Cylinder_246_2_rims__rims_0.geometry} material={materials.rims__rims} rotation={[-Math.PI / 2, 0, 0]} />
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh geometry={nodes.Cylinder_139_SUB1_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
                  <mesh geometry={nodes.Cylinder_139_SUB0_engine__engine_0.geometry} material={materials.engine__engine} />
                </group>
                <mesh geometry={nodes.Cylinder_2_tyres__Tyres_D2_dds_0.geometry} material={materials.tyres__Tyres_D2_dds} />
              </group>
            </group>
            <group position={[8.909, 3.7, -13.624]} rotation={[0, 0, 0.017]}>
              <group position={[-2.514, 0.203, -0.069]}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh geometry={nodes.Cylinder_219_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                  <mesh geometry={nodes.Cylinder_219_SUB1_engine__engine_0.geometry} material={materials.engine__engine} />
                </group>
              </group>
              <group position={[-3.401, -1.893, 1.265]} rotation={[0.002, -0.022, 0.02]}>
                <mesh geometry={nodes.Cylinder_249_2_engine__engine_0.geometry} material={materials.engine__engine} rotation={[-1.576, 0, 0]} />
              </group>
              <group position={[-3.405, -1.919, -1.086]} rotation={[0.007, 0, -0.008]} scale={[1, 1.101, 1]}>
                <mesh geometry={nodes.Cylinder_248_2_engine__engine_0.geometry} material={materials.engine__engine} rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cube_033_SUB0_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                <mesh geometry={nodes.Cube_033_SUB1_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
              </group>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cylinder_006_SUB0_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
                <mesh geometry={nodes.Cylinder_006_SUB1_engine__engine_0.geometry} material={materials.engine__engine} />
              </group>
              <mesh geometry={nodes.Cylinder_004_2_rims__rims_0.geometry} material={materials.rims__rims} rotation={[-Math.PI / 2, 0, 0]} />
              <mesh geometry={nodes.Cylinder_001_2_tyres__Tyres_D2_dds_0.geometry} material={materials.tyres__Tyres_D2_dds} />
            </group>
            <group position={[3.31, 5.602, -12.659]} rotation={[0.094, 0, 0]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cylinder_043_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                <mesh geometry={nodes.Cylinder_043_SUB1_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
              </group>
            </group>
            <mesh geometry={nodes.Circle_003_2_steeringwheel_2__steeringwheel_0.geometry} material={materials.steeringwheel_2__steeringwheel} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cube_086_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cylinder_060_2_pipe__pipe_0.geometry} material={materials.pipe__pipe} rotation={[-Math.PI / 2, 0, 0]} />
            <group position={[3.857, 5.469, -5.344]} rotation={[0.03, -0.002, -0.007]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cylinder_005_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                <mesh geometry={nodes.Cylinder_005_SUB2_engine__engine_0.geometry} material={materials.engine__engine} />
                <mesh geometry={nodes.Cylinder_005_SUB1_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
              </group>
            </group>
            <group position={[2.118, 1.434, 13.799]} rotation={[0, 0, -0.092]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cylinder_204_SUB0_blacknouv__blackuv_0.geometry} material={materials.blacknouv__blackuv} />
                <mesh geometry={nodes.Cylinder_204_SUB1_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
              </group>
              <group position={[0.817, -0.672, -0.085]} rotation={[0.033, 0.003, 0.105]}>
                <mesh geometry={nodes.Cylinder_272_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
              </group>
            </group>
            <group position={[-2.118, 1.434, 13.799]} rotation={[0, 0, 0.092]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cube_053_SUB0_blacknouv__blackuv_0.geometry} material={materials.blacknouv__blackuv} />
                <mesh geometry={nodes.Cube_053_SUB1_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
              </group>
              <group position={[-0.817, -0.672, -0.085]} rotation={[0.013, 0.015, -0.12]}>
                <mesh geometry={nodes.Cylinder_203_2_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} rotation={[-Math.PI / 2, 0, 0]} />
              </group>
            </group>
            <group position={[3.286, 5.221, -12.339]} rotation={[0.07, -0.006, -0.035]}>
              <group rotation={[-1.641, -0.072, 0]}>
                <mesh geometry={nodes.Cylinder_014_SUB0_blacknouv__blackuv_0.geometry} material={materials.blacknouv__blackuv} />
                <mesh geometry={nodes.Cylinder_014_SUB1_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
              </group>
            </group>
            <mesh geometry={nodes.Cylinder_148_2_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} rotation={[-Math.PI / 2, 0, 0]} />
            <group position={[-3.757, 3.471, -5.846]} rotation={[0.035, 0.002, 0.005]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cylinder_251_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                <mesh geometry={nodes.Cylinder_251_SUB2_engine__engine_0.geometry} material={materials.engine__engine} />
                <mesh geometry={nodes.Cylinder_251_SUB1_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
              </group>
            </group>
            <group position={[-3.742, 4.544, -13.191]} rotation={[0, 0, -0.094]} scale={[0.969, 1, 1]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cube_075_SUB2_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                <mesh geometry={nodes.Cube_075_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                <mesh geometry={nodes.Cube_075_SUB1_engine__engine_0.geometry} material={materials.engine__engine} />
              </group>
            </group>
            <group position={[-1.629, 1.126, -13.584]} rotation={[0, 0, -0.118]} scale={[1.034, 1, 1]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cylinder_017_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                <mesh geometry={nodes.Cylinder_017_SUB1_engine__engine_0.geometry} material={materials.engine__engine} />
                <mesh geometry={nodes.Cylinder_017_SUB2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
              </group>
            </group>
            <group position={[-8.909, 3.7, -13.624]} rotation={[0, 0, -0.017]}>
              <group position={[2.564, 0.128, -0.069]}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh geometry={nodes.Cylinder_256_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                  <mesh geometry={nodes.Cylinder_256_SUB1_engine__engine_0.geometry} material={materials.engine__engine} />
                </group>
              </group>
              <group position={[3.401, -1.817, 1.265]} rotation={[0, 0, -0.015]}>
                <mesh geometry={nodes.Cylinder_254_2_engine__engine_0.geometry} material={materials.engine__engine} rotation={[-Math.PI / 2, 0.002, 0]} />
              </group>
              <group position={[3.405, -1.919, -1.086]} rotation={[-0.006, 0, 0.006]} scale={[1, 1.101, 1]}>
                <mesh geometry={nodes.Cylinder_058_2_engine__engine_0.geometry} material={materials.engine__engine} rotation={[-Math.PI / 2, 0, 0]} />
              </group>
              <mesh geometry={nodes.Cylinder_250_2_tyres__Tyres_D2_dds_0.geometry} material={materials.tyres__Tyres_D2_dds} />
              <mesh geometry={nodes.Cylinder_343_2_rims__rims_0.geometry} material={materials.rims__rims} rotation={[-Math.PI / 2, 0, 0]} />
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cylinder_252_SUB0_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
                <mesh geometry={nodes.Cylinder_252_SUB1_engine__engine_0.geometry} material={materials.engine__engine} />
              </group>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cube_002_SUB0_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                <mesh geometry={nodes.Cube_002_SUB1_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
              </group>
            </group>
            <group position={[-3.857, 5.468, -5.344]} rotation={[0.022, -0.004, -0.003]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cylinder_026_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                <mesh geometry={nodes.Cylinder_026_SUB2_engine__engine_0.geometry} material={materials.engine__engine} />
                <mesh geometry={nodes.Cylinder_026_SUB1_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
              </group>
            </group>
            <group position={[-2.258, 3.452, -13.856]} rotation={[-Math.PI / 2, 0.122, 0]}>
              <group rotation={[Math.PI / 2, 0, 0.031]}>
                <mesh geometry={nodes.Cylinder_324_SUB1_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                <mesh geometry={nodes.Cylinder_324_SUB0_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
              </group>
            </group>
            <group position={[-3.31, 5.602, -12.659]} rotation={[0.094, 0, 0]}>
              <mesh geometry={nodes.Cylinder_553_SUB0_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
              <mesh geometry={nodes.Cylinder_553_SUB1_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
            </group>
            <group position={[-1.895, 3.442, -13.856]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cylinder_328_SUB0_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                <mesh geometry={nodes.Cylinder_328_SUB2_brakedisc__Brake_Disc_01_png_0.geometry} material={materials.brakedisc__Brake_Disc_01_png} />
                <mesh geometry={nodes.Cylinder_328_SUB1_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                <mesh geometry={nodes.Cylinder_328_SUB3_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
              </group>
            </group>
            <group position={[-2.099, 1.549, -12.534]} rotation={[-Math.PI / 2, 0.091, 0]}>
              <group position={[-0.854, 0.65, -0.783]} rotation={[Math.PI / 2, 0, 0.085]}>
                <group rotation={[-Math.PI / 2, 0.001, 0]}>
                  <mesh geometry={nodes.Cylinder_023_SUB1_blacknouv__blackuv_0.geometry} material={materials.blacknouv__blackuv} />
                  <mesh geometry={nodes.Cylinder_023_SUB0_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
                </group>
              </group>
              <mesh geometry={nodes.Cylinder_551_SUB2_blacknouv__blackuv_0.geometry} material={materials.blacknouv__blackuv} />
              <mesh geometry={nodes.Cylinder_551_SUB1_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
              <mesh geometry={nodes.Cylinder_551_SUB0_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
            </group>
            <group position={[-3.286, 5.221, -12.339]} rotation={[-0.001, 0.015, -0.024]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh geometry={nodes.Cylinder_010_SUB0_blacknouv__blackuv_0.geometry} material={materials.blacknouv__blackuv} />
                <mesh geometry={nodes.Cylinder_010_SUB1_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
              </group>
            </group>
            <group position={[2.295, 8.694, 0.004]} rotation={[-Math.PI / 2, 0, 0]}>
              <mesh geometry={nodes.Cylinder_339_SUB0_paint_inner__paint_0.geometry} material={materials.paint_inner__paint} />
              <mesh geometry={nodes.Cylinder_339_SUB2_full_chrome__dashboard_0.geometry} material={materials.full_chrome__dashboard} />
              <mesh geometry={nodes.Cylinder_339_SUB1_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
              <mesh geometry={nodes.Cylinder_020_2_steeringwheel_2__steeringwheel_0.geometry} material={materials.steeringwheel_2__steeringwheel} />
              <mesh geometry={nodes.Cube_059_2_seatbelt__seatbelt_png_0.geometry} material={materials.seatbelt__seatbelt_png} />
              <mesh geometry={nodes.CINTURE_OFF_000_2_engine__engine_0.geometry} material={materials.engine__engine} />
              <mesh geometry={nodes.Cube_2_seatbelt__seatbelt_png_0.geometry} material={materials.seatbelt__seatbelt_png} />
            </group>
            <mesh geometry={nodes.Cube_021_2_cooler__cooler_png_0.geometry} material={materials.cooler__cooler_png} position={[0, 3.309, -4.956]} rotation={[-Math.PI / 2, 0, 0]} />
            <group position={[-1.885, 2.846, 14.951]}>
              <group position={[-0.648, 0, 0]}>
                <mesh geometry={nodes.GEO_DISC_R_SUB3_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                <mesh geometry={nodes.GEO_DISC_R_SUB1_brakedisc__Brake_Disc_01_png_0.geometry} material={materials.brakedisc__Brake_Disc_01_png} />
                <mesh geometry={nodes.GEO_DISC_R_SUB2_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                <mesh geometry={nodes.GEO_DISC_R_SUB0_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
              </group>
            </group>
            <group position={[1.884, 2.846, 14.951]}>
              <group position={[0.65, 0, 0]}>
                <mesh geometry={nodes.GEO_DISC_L_SUB3_blackuv__blackuv_0.geometry} material={materials.blackuv__blackuv} />
                <mesh geometry={nodes.GEO_DISC_L_SUB1_brakedisc__Brake_Disc_01_png_0.geometry} material={materials.brakedisc__Brake_Disc_01_png} />
                <mesh geometry={nodes.GEO_DISC_L_SUB2_cockpit_screw__Vite_Diffuse_dds_0.geometry} material={materials.cockpit_screw__Vite_Diffuse_dds} />
                <mesh geometry={nodes.GEO_DISC_L_SUB0_full_chrome__full_chrome_0.geometry} material={materials.full_chrome__full_chrome} />
              </group>
            </group>
            <mesh geometry={nodes.Cube_060_2_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cube_062_SUB1_glass_0.geometry} material={materials.glass} rotation={[-Math.PI / 2, 0, 0]} />
            <mesh geometry={nodes.Cube_090_2_engine__engine_0.geometry} material={materials.engine__engine} />
            <mesh geometry={nodes.Cube_041_SUB0_paint__paint_0.geometry} material={paintMat} />
            <mesh geometry={nodes.Cube_041_SUB1_paint_inner__paint_0.geometry} material={materials.paint_inner__paint} />
            <mesh geometry={nodes.polymsh_extracted_2_Extra_Glass_Visible_0.geometry} material={materials.Extra_Glass_Visible} />
            <group position={[0, 1.186, -13.594]} rotation={[-Math.PI / 2, 0, 0]}>
              <mesh geometry={nodes.missing_engine_Cylinder_144_SUB1_dashboard_nonm__blackuv_0.geometry} material={materials.dashboard_nonm__blackuv} />
              <mesh geometry={nodes.missing_engine_Cylinder_144_SUB0_dashboard_nonm__dashboard_0.geometry} material={materials.dashboard_nonm__dashboard} />
            </group>
          </group>
        </group>
      </group>
    </Float>
  )
}

useGLTF.preload('/models/lotus.glb')

