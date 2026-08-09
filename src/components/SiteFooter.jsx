import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="site-footer-shell">
      <div className="site-footer">
        <div className="site-footer-top">
          <div>
            <h2>AI Calc Solutions</h2>
            <p>
              Practical AI pricing calculators, token estimators, and subscription comparisons for developers,
              researchers, and power users.
            </p>
          </div>

          <div className="site-footer-links">
            <div>
              <h3>Tools</h3>
              <Link to="/options-extractor">Options Data Extractor</Link>
              <Link to="/token-calculator">Token Calculator</Link>
              <Link to="/compare">Pricing Compare</Link>
              <Link to="/subscriptions">Subscriptions</Link>
            </div>
            <div>
              <h3>Company</h3>
              <Link to="/about">About</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div>
              <h3>Legal</h3>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>AI Cost Calculator · Pricing data sourced from official provider pages · Updated April 2026</p>
          <p>Token estimates use a ~4 characters/token heuristic. Actual tokenization varies by model.</p>
        </div>
      </div>
    </footer>
  )
}
