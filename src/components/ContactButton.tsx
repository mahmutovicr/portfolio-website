interface Props {
  onOpen: () => void
}

export function ContactButton({ onOpen }: Props) {
  return (
    <section id="contact-section">
      <div className="sep" />
      <button className="contact-btn" onClick={onOpen}>
        <span className="btn-txt">Contact</span>
      </button>
    </section>
  )
}