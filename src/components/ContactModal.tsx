import { useState, useEffect, useCallback, useRef } from 'react'
import type { ChangeEvent } from 'react'
import type { ContactFormData } from '../types'
import { useHoverDevice } from '../hooks/useHoverDevice'
import { Turnstile } from '@marsidev/react-turnstile'

type Status = 'idle' | 'loading' | 'success'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FIELDS: Array<{
  label: string
  name: keyof ContactFormData
  type?: string
  placeholder: string
  multiline?: boolean
  fieldClass?: string
}> = [
  { label: "What's your name?",                     name: 'name',         type: 'text',  placeholder: 'John Doe *' },
  { label: "What's your email?",                    name: 'email',        type: 'email', placeholder: 'john@doe.com *' },
  { label: "What's the name of your organization?", name: 'organization', type: 'text',  placeholder: 'John & Doe ®' },
  { label: 'What services are you looking for?',    name: 'services',     type: 'text',  placeholder: 'Web Design, Web Development …' },
  { label: 'Your message',                          name: 'message',                     placeholder: 'Hello Rahman, can you help me with … *', multiline: true, fieldClass: 'field-msg' },
]

const EMPTY: ContactFormData = { name: '', email: '', organization: '', services: '', message: '' }

export function ContactModal({ isOpen, onClose }: Props) {
  const [form, setForm]            = useState<ContactFormData>(EMPTY)
  const [status, setStatus]        = useState<Status>('idle')
  const [errorMsg, setError]       = useState<string | null>(null)
  const [turnstileToken, setToken] = useState<string | null>(null)
  const spotlightRef               = useRef<HTMLDivElement>(null)
  const canHover                   = useHoverDevice()

  const handleClose = useCallback(() => {
    onClose()
    if (status === 'success') {
      setTimeout(() => { setForm(EMPTY); setStatus('idle'); setToken(null) }, 300)
    } else {
      setStatus('idle')
      setError(null)
    }
  }, [onClose, status])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !canHover) return
    const handler = (e: MouseEvent) => {
      if (!spotlightRef.current) return
      spotlightRef.current.style.left = e.clientX + 'px'
      spotlightRef.current.style.top  = e.clientY + 'px'
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [isOpen, canHover])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errorMsg) setError(null)
  }

  const handleSubmit = async () => {
    setError(null)
    if (!form.name.trim())                                   { setError('Please enter your name.'); return }
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email)) { setError('Please enter a valid email address.'); return }
    if (!form.message.trim())                                { setError('Please write a message.'); return }
    if (!turnstileToken)                                     { setError('Please complete the security check.'); return }
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string }
        setError(data.error ?? 'Something went wrong. Please try again.')
        setStatus('idle')
        return
      }
      setStatus('success')
    } catch {
      setError('Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <div id="modal" className={`modal-overlay${isOpen ? ' open' : ''}`}>
      <div id="modal-spotlight" ref={spotlightRef} style={{ display: isOpen && canHover ? 'block' : 'none' }} />
      <button className="modal-close" onClick={handleClose}>&#215;</button>
      <div className="modal-inner">
        {status === 'success' ? (
          <div className="success-box">
            <div style={{ fontSize: 'clamp(32px,5vw,52px)', color: 'var(--ac)', marginBottom: '1.5rem', lineHeight: 1 }}>&#10003;</div>
            <p style={{ fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 600, color: '#fff', letterSpacing: '-.02em', marginBottom: '.75rem', fontFamily: 'Inter,sans-serif' }}>
              Message sent.
            </p>
            <p style={{ fontSize: 'clamp(13px,1.5vw,16px)', color: 'var(--mu)', fontFamily: 'Inter,sans-serif', fontWeight: 300 }}>
              I'll get back to you as soon as possible.
            </p>
          </div>
        ) : (
          <>
            {FIELDS.map(field => (
              <div className={`field${field.fieldClass ? ` ${field.fieldClass}` : ''}`} key={field.name}>
                <label>{field.label}</label>
                {field.multiline ? (
                  <textarea
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    rows={2}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', maxWidth: '100%', overflow: 'hidden' }}>
              <Turnstile
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                onSuccess={setToken}
                onExpire={() => setToken(null)}
                options={{ theme: 'dark' }}
              />
            </div>
            {errorMsg && (
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: 'clamp(12px,1.3vw,14px)', color: 'rgba(239,68,68,.85)', fontFamily: 'Inter,sans-serif' }}>
                {errorMsg}
              </p>
            )}
            <div className="submit-wrap">
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={status === 'loading'}
                style={{ opacity: status === 'loading' ? 0.55 : 1, cursor: status === 'loading' ? 'wait' : 'pointer' }}
              >
                <span className="btn-txt">{status === 'loading' ? 'Sending…' : 'Send Message'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}