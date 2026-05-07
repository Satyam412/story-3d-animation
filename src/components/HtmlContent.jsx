import React from 'react'

export default function HtmlContent() {
  return (
    <div style={{ position: 'relative', width: '100vw' }}>
      {/* PAGE 1: HERO */}
      <div className="section" style={{ height: '100vh', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', paddingLeft: '5vw' }}>
          <h1 className="hero-title">GENERATIVE<br/>MODELS.</h1>
          <div className="data-panel" style={{ marginTop: '4rem', maxWidth: '600px' }}>
            <div className="data-item">
              <span>STATUS</span>
              ACTIVE
            </div>
            <div className="data-item">
              <span>ALGORITHM</span>
              DEEP RECONSTRUCTION
            </div>
            <div className="data-item">
              <span>OUTPUT</span>
              REAL-TIME WEBGL
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2: LOTUS EXPLANATION */}
      <div className="section right" style={{ height: '100vh', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', paddingRight: '5vw' }}>
          <h2 className="section-title">01 / STRUCTURAL MESH</h2>
          <p className="section-text" style={{ marginLeft: 'auto' }}>
            AI-driven topology optimization. The system analyzes millions of micro-structures to reduce polygon count while preserving visual fidelity. Watch the wireframe manifestation in real-time.
          </p>
          <div className="data-panel" style={{ justifyContent: 'flex-end', marginLeft: 'auto', width: 'fit-content' }}>
            <div className="data-item" style={{ textAlign: 'right' }}>
              <span>VERTICES</span>
              24,501
            </div>
            <div className="data-item" style={{ textAlign: 'right' }}>
              <span>COMPRESSION</span>
              84.2%
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 3: POKEBALL ENERGY */}
      <div className="section" style={{ height: '100vh', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', paddingLeft: '5vw' }}>
          <h2 className="section-title">02 / KINETIC DATA</h2>
          <p className="section-text">
            Simulating high-energy physics within a browser environment. By manipulating the emissive properties and calculating particle diffusion via math shaders, we simulate volatile containment.
          </p>
          <div className="data-panel" style={{ width: 'fit-content' }}>
            <div className="data-item">
              <span>ENERGY</span>
              CRITICAL
            </div>
            <div className="data-item">
              <span>CONTAINMENT</span>
              STABLE
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 4: WYVERN RIGGING */}
      <div className="section right" style={{ height: '100vh', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', paddingRight: '5vw' }}>
          <h2 className="section-title">03 / BIO-RIGGING</h2>
          <p className="section-text" style={{ marginLeft: 'auto' }}>
            Automated inverse kinematics. The AI detects joint structures and automatically applies skeletal tracking, allowing the entity to perceive user interactions instantly.
          </p>
          <div className="data-panel" style={{ justifyContent: 'flex-end', marginLeft: 'auto', width: 'fit-content' }}>
            <div className="data-item" style={{ textAlign: 'right' }}>
              <span>IK TARGET</span>
              CURSOR_VEC3
            </div>
            <div className="data-item" style={{ textAlign: 'right' }}>
              <span>BONES</span>
              128
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 5: SKULL DISINTEGRATION */}
      <div className="section center" style={{ height: '100vh', pointerEvents: 'none', justifyContent: 'flex-start', paddingTop: '15vh' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <h2 className="section-title" style={{ fontSize: '3vw' }}>04 / NEURAL DECAY</h2>
          <p className="section-text" style={{ margin: '0 auto' }}>
            Procedural disintegration. We utilize GPU instantiation and custom surface sampling to break down rigid bodies into millions of autonomous particles driven by noise fields.
          </p>
          <div className="data-panel" style={{ justifyContent: 'center', margin: '2rem auto 0 auto', width: 'fit-content' }}>
            <div className="data-item" style={{ textAlign: 'center' }}>
              <span>PARTICLES</span>
              20,000+
            </div>
            <div className="data-item" style={{ textAlign: 'center' }}>
              <span>COMPUTE</span>
              GPU INSTANCED
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 6: FOOTER */}
      <div className="section center" style={{ height: '100vh', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <h1 className="hero-title" style={{ fontSize: '5vw' }}>END OF SIMULATION</h1>
          <p style={{ marginTop: '2rem', color: '#6ee7b7', fontFamily: 'monospace', letterSpacing: '2px', cursor: 'pointer' }} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            [ REBOOT SYSTEM ]
          </p>
        </div>
      </div>
    </div>
  )
}
