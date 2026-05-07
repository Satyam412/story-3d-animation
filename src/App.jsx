import React from 'react'
import Experience from './components/Experience'
import SkullTestExperience from './components/SkullTestExperience'

const isLab = typeof window !== 'undefined' && window.location.search.includes('lab')

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      {isLab ? <SkullTestExperience /> : <Experience />}
    </div>
  )
}

export default App
