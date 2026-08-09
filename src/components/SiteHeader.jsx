import { NavLink } from 'react-router-dom'
import { FileSpreadsheet, BookOpen, Download } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Options Extractor', icon: FileSpreadsheet, end: true },
  { to: '/field-guide', label: 'Field Guide & Examples', icon: BookOpen },
]

export default function SiteHeader() {
  return (
    <header className="site-header-shell">
      <div className="site-header">
        <NavLink to="/" className="site-brand" end>
          <span className="site-brand-mark options-mark">OP</span>
          <span>
            <strong>Stock Options Extractor</strong>
            <small>Options Data &amp; CSV Downloader</small>
          </span>
        </NavLink>

        <nav className="site-nav" aria-label="Primary">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
