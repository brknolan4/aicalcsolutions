import { NavLink } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="op-footer-shell">
      <div className="op-footer">
        <span className="op-footer-brand">
          &copy; {new Date().getFullYear()} AICalcSolutions.com &mdash; Stock Options Data &amp; CSV Downloader
        </span>
        <div className="op-footer-links">
          <NavLink to="/" className="op-footer-link" end>Options Extractor</NavLink>
          <NavLink to="/field-guide" className="op-footer-link">Field Guide</NavLink>
        </div>
      </div>
    </footer>
  )
}
