import { useState } from 'react'
import { Spotlight } from './components/Spotlight'
import { About } from './components/About'
import { ProjectGrid } from './components/ProjectGrid'
import { ContactButton } from './components/ContactButton'
import { ContactModal } from './components/ContactModal'
import { LegalModal } from './components/LegalModal'
import { Footer } from './components/Footer'
import { termsOfUse, privacyPolicy } from './data/legalContent'

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)

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
        <ContactButton onOpenContact={() => setIsContactOpen(true)} />
      </main>
      <Footer
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <LegalModal doc={termsOfUse} isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <LegalModal doc={privacyPolicy} isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  )
}