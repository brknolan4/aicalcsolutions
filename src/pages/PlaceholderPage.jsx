import { Link } from 'react-router-dom'
import AdSlot from '../components/AdSlot'

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="page-shell narrow-page">
      <section className="content-hero glass-panel">
        <p className="content-eyebrow">Coming in Phase 2</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="content-actions">
          <Link to="/" className="content-link primary-link">Return to full calculator</Link>
          <Link to="/blog" className="content-link">Browse blog ideas</Link>
        </div>
      </section>
      <AdSlot id={`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-placeholder`} />
    </div>
  )
}
