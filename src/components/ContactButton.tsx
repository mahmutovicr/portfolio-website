interface Props {
  onOpenContact: () => void
}

export function ContactButton({ onOpenContact }: Props) {
  return (
    <section id="contact-section">
      <div className="sep" />
      <button className="contact-btn" onClick={onOpenContact}>
        <span className="btn-txt">Contact</span>
      </button>
    </section>
  )
}