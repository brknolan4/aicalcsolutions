import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { absoluteUrl } from '../lib/seo'

export default function AboutPage() {
  return (
    <div className="page-shell narrow-page">
      <Seo
        title="About AI Calc Solutions"
        description="Learn what AI Calc Solutions is building and why the site focuses on AI pricing, token math, and subscription planning."
        canonical={absoluteUrl('/about')}
      />
      <section className="content-hero glass-panel">
        <p className="content-eyebrow">About</p>
        <h1>About AI Calc Solutions</h1>
        <p>
          AI Calc Solutions exists to make AI pricing easier to understand across API billing, consumer plans, and
          developer tools.
        </p>
      </section>

      <section className="content-card glass-panel legal-copy">
        <p>
          The current site compares model pricing, subscription estimates, and token math for real workflows like
          coding, research, and content creation.
        </p>
        <p>
          This rebuild is turning the original one-page calculator into a multipage site that can support dedicated
          landing pages, comparison pages, and a real content library.
        </p>
        <div className="content-actions">
          <Link to="/" className="content-link primary-link">Use the calculator</Link>
          <Link to="/blog" className="content-link">Open the blog hub</Link>
        </div>
      </section>
    </div>
  )
}
