interface Props {
  onOpenTerms: () => void
  onOpenPrivacy: () => void
}

export function Footer({ onOpenTerms, onOpenPrivacy }: Props) {
  return (
    <footer id="site-footer">
      <span className="footer-copy">© 2026 Rahman Mahmutović</span>
      <span className="footer-dot">·</span>
      <button className="footer-legal-link" onClick={onOpenTerms}>Terms of Use</button>
      <span className="footer-dot">·</span>
      <button className="footer-legal-link" onClick={onOpenPrivacy}>Privacy Policy</button>
    </footer>
  )
}