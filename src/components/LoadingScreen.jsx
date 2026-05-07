import React, { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'

export default function LoadingScreen() {
  const { progress, active } = useProgress()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!active && progress === 100) {
      const timeout = setTimeout(() => setVisible(false), 800)
      return () => clearTimeout(timeout)
    }
  }, [active, progress])

  if (!visible) return null

  return (
    <div className={`loading-screen ${!active && progress === 100 ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <h1 className="loading-title">ORYZO</h1>
        <div className="loading-bar-container">
          <div 
            className="loading-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="loading-percentage">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  )
}
