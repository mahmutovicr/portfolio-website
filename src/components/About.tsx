import { useState } from 'react'

const AVAILABLE = true

export function About() {
  const [isLive, setIsLive] = useState(AVAILABLE)

  const handleToggle = () => {
    setIsLive(prev => !prev)
  }

  return (
    <section id="about">
      <div
        id="availability"
        className="is-live"
        onClick={handleToggle}
      >
        <span className={`avail-dot ${isLive ? 'green' : 'red'}`} />
        <span>{isLive ? 'Available for hire' : 'Not available'}</span>
      </div>
      <h1>Rahman Mahmutović</h1>
      <div className="role">Designer &amp; Developer</div>
      <p className="tagline">Building end-to-end web products</p>
      <div className="sep" />
    </section>
  )
}