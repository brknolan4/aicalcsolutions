import { NavLink } from 'react-router-dom'
import { BookOpen, FileSpreadsheet, TrendingUp } from 'lucide-react'
import '../options.css'

export default function SiteHeader() {
  return (
    <header className="op-header-shell">
      <div className="op-header">
        <NavLink to="/" className="op-logo" end>
          <span className="op-logo-mark">OP</span>
          <span className="op-logo-text">
            <strong>Stock Options Extractor</strong>
            <small>Options Data &amp; CSV Downloader</small>
          </span>
        </NavLink>

        <div className="op-header-spacer" />

        <nav className="op-nav" aria-label="Primary navigation">
          <NavLink to="/" end className={({ isActive }) => `op-nav-link${isActive ? ' active' : ''}`}>
            <FileSpreadsheet size={15} /> Options Extractor
          </NavLink>
          <NavLink to="/pc-ratio" className={({ isActive }) => `op-nav-link${isActive ? ' active' : ''}`}>
            <TrendingUp size={15} /> P/C Ratios
          </NavLink>
          <NavLink to="/field-guide" className={({ isActive }) => `op-nav-link${isActive ? ' active' : ''}`}>
            <BookOpen size={15} /> Field Guide
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
