import React from 'react'
import { Scroll } from '@react-three/drei'

export default function UIOverlay() {
  return (
    <Scroll html style={{ width: '100vw', height: '500vh' }}>
      
      {/* Page 1: Intro */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10vw' }}>
        <h1 style={{ fontSize: '6rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          The Vault
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#888', maxWidth: '400px', lineHeight: 1.5, marginTop: '1rem' }}>
          A curated exhibition of digital artifacts. Scroll down to begin the tour.
        </p>
      </div>

      {/* Page 2: Lotus */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', paddingRight: '10vw' }}>
        <h2 style={{ fontSize: '4rem', color: '#fff', textTransform: 'uppercase', margin: 0 }}>Exhibit 01</h2>
        <h3 style={{ fontSize: '2rem', color: '#6ee7b7', margin: '0.5rem 0' }}>Mechanical Era</h3>
        <p style={{ fontSize: '1.1rem', color: '#aaa', maxWidth: '300px', textAlign: 'right' }}>
          Hover to inspect the chassis. Click to analyze the structural integrity.
        </p>
      </div>

      {/* Page 3: Pokeball */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10vw' }}>
        <h2 style={{ fontSize: '4rem', color: '#fff', textTransform: 'uppercase', margin: 0 }}>Exhibit 02</h2>
        <h3 style={{ fontSize: '2rem', color: '#ff3b30', margin: '0.5rem 0' }}>Raw Energy</h3>
        <p style={{ fontSize: '1.1rem', color: '#aaa', maxWidth: '300px' }}>
          The pulse intensifies as you draw near. Click the sphere to trigger a localized energy discharge.
        </p>
      </div>

      {/* Page 4: Wyvern */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', paddingRight: '10vw' }}>
        <h2 style={{ fontSize: '4rem', color: '#fff', textTransform: 'uppercase', margin: 0 }}>Exhibit 03</h2>
        <h3 style={{ fontSize: '2rem', color: '#a855f7', margin: '0.5rem 0' }}>Mythos Engine</h3>
        <p style={{ fontSize: '1.1rem', color: '#aaa', maxWidth: '300px', textAlign: 'right' }}>
          Biological data reconstruction. The entity will awaken and track your presence.
        </p>
      </div>

      {/* Page 5: Skull */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ fontSize: '5rem', color: '#fff', textTransform: 'uppercase', margin: 0 }}>Final Artifact</h2>
        <h3 style={{ fontSize: '2rem', color: '#bbbbbb', margin: '1rem 0 2rem 0' }}>End of Simulation</h3>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            padding: '1rem 3rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            cursor: 'pointer',
            borderRadius: '50px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)'
            e.target.style.borderColor = 'white'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent'
            e.target.style.borderColor = 'rgba(255,255,255,0.3)'
          }}
        >
          Return to Entrance
        </button>
      </div>

    </Scroll>
  )
}
