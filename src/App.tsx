import { useState } from 'react'
import { Spotlight } from './components/Spotlight'
import { About } from './components/About'
import { ProjectGrid } from './components/ProjectGrid'
import { ContactButton } from './components/ContactButton'
import { ContactModal } from './components/ContactModal'

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div id="port">
      <Spotlight />
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1280px',
          minHeight: '100dvh',
          padding: 'clamp(.7rem,1.8vh,1.6rem) clamp(0.6rem,3vw,3rem) clamp(.7rem,1.8vh,1.6rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'clamp(.6rem,1.2vh,1rem)',
        }}
      >
        <About />
        <ProjectGrid />
        <ContactButton onOpen={() => setIsModalOpen(true)} />
      </main>
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}