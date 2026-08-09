import { NavLink } from 'react-router-dom'
import { Calculator, BookOpen, BarChart3, CreditCard, Home, FileSpreadsheet } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/options-extractor', label: 'Options Extractor', icon: FileSpreadsheet },
  { to: '/token-calculator', label: 'Token Calculator', icon: Calculator },
  { to: '/compare', label: 'Compare', icon: BarChart3 },
  { to: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/blog', label: 'Blog', icon: BookOpen },
]

export default function SiteHeader() {
  return (
    <header className="site-header-shell">
      <div className="site-header">
        <NavLink to="/" className="site-brand" end>
          <span className="site-brand-mark">AI</span>
          <span>
            <strong>AI Calc Solutions</strong>
            <small>AI pricing and token economics</small>
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
