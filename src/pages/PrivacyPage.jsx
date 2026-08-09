import Seo from '../components/Seo'
import { absoluteUrl } from '../lib/seo'

export default function PrivacyPage() {
  return (
    <div className="page-shell legal-page">
      <Seo
        title="Privacy Policy | AI Calc Solutions"
        description="Read the privacy policy for AI Calc Solutions, including cookie, advertising, and data handling notes."
        canonical={absoluteUrl('/privacy')}
      />
      <section className="content-hero glass-panel">
        <p className="content-eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p>Welcome to AI Calc Solutions. We value your privacy and are committed to protecting your personal data.</p>
      </section>

      <section className="content-card glass-panel legal-copy">
        <p>
          This policy explains how we collect and use data when you visit our website.
        </p>
        <p>
          <strong>Third-Party Advertising:</strong> Third party vendors, including Google, use cookies to serve ads
          based on your prior visits to this website or other websites. Google&apos;s use of advertising cookies enables
          it and its partners to serve ads to you based on your visit to this site and/or other sites on the
          Internet.
        </p>
        <p>
          <strong>Opting Out:</strong> You may opt out of personalized advertising by visiting{' '}
          <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">Google Ads Settings</a>.
          We do not store any sensitive personal data or your actual AI prompts entered into the token simulator.
        </p>
        <p>For any questions regarding this policy, please contact us.</p>
      </section>
    </div>
  )
}
