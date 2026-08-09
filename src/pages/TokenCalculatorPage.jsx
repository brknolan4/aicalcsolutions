import AdSlot from '../components/AdSlot'
import Seo from '../components/Seo'
import ExamplesPanel from '../components/calculator/ExamplesPanel'
import FocusedControlBar from '../components/calculator/FocusedControlBar'
import ProfileExamplesStrip from '../components/calculator/ProfileExamplesStrip'
import ResultHighlightRow from '../components/calculator/ResultHighlightRow'
import TokenSimulatorPanel from '../components/calculator/TokenSimulatorPanel'
import useCalculatorState from '../hooks/useCalculatorState'
import { absoluteUrl, faqSchema, webAppSchema } from '../lib/seo'
import { fmtUsd } from '../lib/calculatorUtils'

export default function TokenCalculatorPage({ title, description }) {
  const calculator = useCalculatorState({ activeTab: 'summary' })
  const { derived } = calculator

  const highlights = [
    { label: 'Selected model', value: derived.model.name, note: `${derived.model.provider} · input ${fmtUsd(derived.model.inputPrice)} /1M` },
    { label: 'Estimated monthly cost', value: fmtUsd(derived.totalApi), note: 'Based on the workload assumptions above' },
    { label: 'Annualized cost', value: fmtUsd(derived.annualApi), note: 'Helpful for budgeting and planning' },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      webAppSchema({
        name: title,
        url: absoluteUrl('/token-calculator'),
        description,
      }),
      faqSchema([
        {
          question: 'How do I estimate prompt cost?',
          answer: 'Paste a real prompt or context block, choose your model, and the calculator estimates token count and cost from the selected pricing.',
        },
        {
          question: 'Why are output tokens usually more expensive?',
          answer: 'Most frontier models price output tokens higher because generated responses are more computationally expensive than reading input.',
        },
      ]),
    ],
  }

  return (
    <div className="page-shell focused-tool-page token-page">
      <Seo
        title={`${title} | AI Calc Solutions`}
        description={description}
        canonical={absoluteUrl('/token-calculator')}
        schema={schema}
      />
      <section className="content-hero glass-panel compact-hero">
        <p className="content-eyebrow">Focused calculator</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <FocusedControlBar
        calculator={calculator}
        title="Token and prompt assumptions"
        subtitle="Start by choosing the workload preset that feels closest to your real behavior. Then adjust the token fields only if you need a more exact estimate."
      />

      <ProfileExamplesStrip calculator={calculator} />
      <ResultHighlightRow items={highlights} />

      <div className="focused-page-stack">
        <TokenSimulatorPanel
          calculator={calculator}
          title="Prompt and response cost estimator"
          intro="Paste a prompt, context block, or expected response to estimate tokens and approximate API cost for your selected model."
        />

        <ExamplesPanel
          calculator={calculator}
          adId="token-examples-inline"
          title="Example prompts by role"
          intro="Use these sample workflows to understand how token usage changes across coding, research, marketing, and analysis roles."
        />

        <section className="content-card glass-panel compact-info-card">
          <h2>How to use this page</h2>
          <ul className="content-list compact-list">
            <li>Paste your prompt to estimate input token cost</li>
            <li>Paste the expected AI response to estimate output token cost</li>
            <li>Adjust the top controls only if your real workload differs</li>
          </ul>
        </section>

        <AdSlot id="token-calculator-inline" />
      </div>
    </div>
  )
}
