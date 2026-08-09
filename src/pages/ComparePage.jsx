import AdSlot from '../components/AdSlot'
import Seo from '../components/Seo'
import ComparePanel from '../components/calculator/ComparePanel'
import FocusedControlBar from '../components/calculator/FocusedControlBar'
import ResultHighlightRow from '../components/calculator/ResultHighlightRow'
import useCalculatorState from '../hooks/useCalculatorState'
import { absoluteUrl, faqSchema, webAppSchema } from '../lib/seo'
import { fmtUsd } from '../lib/calculatorUtils'

export default function ComparePage({ title, description }) {
  const calculator = useCalculatorState({ activeTab: 'compare' })
  const { derived } = calculator
  const cheapestModel = [...derived.compareModels].sort((a, b) => (a.inputPrice + a.outputPrice) - (b.inputPrice + b.outputPrice))[0]

  const highlights = [
    { label: 'Monthly API estimate', value: fmtUsd(derived.totalApi), note: 'Current workload assumptions' },
    { label: 'Cheapest selected model', value: cheapestModel ? cheapestModel.name : '—', note: 'Based on published token pricing' },
    { label: 'Best value subscription', value: derived.bestValue?.name || '—', note: derived.bestValue ? `${fmtUsd(derived.bestValue.price)}/mo` : 'No subscription selected' },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      webAppSchema({
        name: title,
        url: absoluteUrl('/compare'),
        description,
      }),
      faqSchema([
        {
          question: 'How many models can I compare at once?',
          answer: 'You can compare up to 5 models at the same time using the selector on the compare page.',
        },
        {
          question: 'What do the monthly API cost numbers mean?',
          answer: 'They estimate your monthly cost from the sessions, input tokens, output tokens, and selected models shown in the controls above.',
        },
      ]),
    ],
  }

  return (
    <div className="page-shell focused-tool-page compare-page">
      <Seo
        title={`${title} | AI Calc Solutions`}
        description={description}
        canonical={absoluteUrl('/compare')}
        schema={schema}
      />
      <section className="content-hero glass-panel compact-hero">
        <p className="content-eyebrow">Comparison hub</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <FocusedControlBar
        calculator={calculator}
        title="Comparison assumptions"
        subtitle="Set your workload once, then scan the cards and comparison table below."
      />

      <ResultHighlightRow items={highlights} />

      <div className="focused-page-stack">
        <ComparePanel calculator={calculator} adId="compare-page-inline" />

        <section className="content-card glass-panel compact-info-card">
          <h2>What to compare first</h2>
          <ul className="content-list compact-list">
            <li>Monthly API cost for your real workflow</li>
            <li>Output-token pricing differences between premium models</li>
            <li>Whether a subscription plan saves money relative to direct API usage</li>
          </ul>
        </section>

        <AdSlot id="compare-secondary" />
      </div>
    </div>
  )
}
