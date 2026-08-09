import Seo from '../components/Seo'
import { absoluteUrl } from '../lib/seo'

export default function TermsPage() {
  return (
    <div className="page-shell legal-page">
      <Seo
        title="Terms of Service | AI Calc Solutions"
        description="Read the terms of service and pricing disclaimer for AI Calc Solutions."
        canonical={absoluteUrl('/terms')}
      />
      <section className="content-hero glass-panel">
        <p className="content-eyebrow">Legal</p>
        <h1>Terms of Service and Disclaimer</h1>
        <p>By using the AI Cost Calculator, you agree to these terms.</p>
      </section>

      <section className="content-card glass-panel legal-copy">
        <p>
          <strong>Estimates Only:</strong> The pricing, token counts, and cost estimates provided by this tool are
          approximations meant for planning purposes only. We use general heuristic formulas such as 4 characters
          per token, which may not exactly match the actual tokenization logic used by individual AI providers.
        </p>
        <p>
          <strong>No Affiliation:</strong> AI Calc Solutions is an independent tool and is not affiliated with,
          endorsed by, or sponsored by OpenAI, Anthropic, Google, Cursor, or any other entity mentioned.
        </p>
        <p>
          <strong>Limitation of Liability:</strong> We are not responsible for any actual billing discrepancies or
          unexpected API costs incurred by your usage of third-party AI services. Please verify all pricing directly
          with the providers before making financial decisions.
        </p>
      </section>
    </div>
  )
}
