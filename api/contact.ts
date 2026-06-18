import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }),
  })
  const data = await res.json() as { success: boolean }
  return data.success === true
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, organization, services, message, turnstileToken } = req.body

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }
  if (!turnstileToken) {
    return res.status(400).json({ error: 'Missing security token.' })
  }

  const isHuman = await verifyTurnstile(turnstileToken)
  if (!isHuman) {
    return res.status(403).json({ error: 'Security check failed. Please try again.' })
  }

  const { error } = await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to: 'mahmutovicrahman5@gmail.com',
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nOrganization: ${organization || '—'}\nServices: ${services || '—'}\n\nMessage:\n${message}`,
  })

  if (error) return res.status(500).json({ error: 'Failed to send email. Please try again.' })

  return res.status(200).json({ ok: true })
}