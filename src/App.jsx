import React from 'react'
import Experience from './components/Experience'
import LoadingScreen from './components/LoadingScreen'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <LoadingScreen />
      <Experience />
    </div>
  )
}

export default App
