import { useEffect } from 'react'
import type { LegalDocument } from '../types'

interface Props {
  doc: LegalDocument
  isOpen: boolean
  onClose: () => void
}

export function LegalModal({ doc, isOpen, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`}>
      <button className="modal-close" onClick={onClose}>&#215;</button>
      <div className="modal-inner">
        <div className="legal-title">{doc.title}</div>
        {doc.sections.map(section => (
          <div className="legal-section" key={section.heading}>
            <h3>{section.heading}</h3>
            <p>{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}