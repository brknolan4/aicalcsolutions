import Seo from '../components/Seo'
import { absoluteUrl } from '../lib/seo'

export default function ContactPage() {
  return (
    <div className="page-shell narrow-page">
      <Seo
        title="Contact AI Calc Solutions"
        description="Get in touch about AI pricing corrections, calculator feedback, and partnership ideas."
        canonical={absoluteUrl('/contact')}
      />
      <section className="content-hero glass-panel">
        <p className="content-eyebrow">Contact</p>
        <h1>Contact AI Calc Solutions</h1>
        <p>Questions, corrections, partnership ideas, or pricing updates? Reach out directly.</p>
      </section>

      <section className="content-card glass-panel legal-copy">
        <p>
          Email: <a href="mailto:brknolan4@gmail.com">brknolan4@gmail.com</a>
        </p>
        <p>
          If you spot outdated pricing or want a new comparison page added, email the exact provider and plan so it
          can be reviewed quickly.
        </p>
      </section>
    </div>
  )
}
