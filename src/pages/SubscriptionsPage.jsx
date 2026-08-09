import AdSlot from '../components/AdSlot'
import Seo from '../components/Seo'
import FocusedControlBar from '../components/calculator/FocusedControlBar'
import ResultHighlightRow from '../components/calculator/ResultHighlightRow'
import SubscriptionsPanel from '../components/calculator/SubscriptionsPanel'
import SummaryPanel from '../components/calculator/SummaryPanel'
import useCalculatorState from '../hooks/useCalculatorState'
import { absoluteUrl, faqSchema, webAppSchema } from '../lib/seo'
import { fmtUsd } from '../lib/calculatorUtils'

export default function SubscriptionsPage({ title, description }) {
  const calculator = useCalculatorState({ activeTab: 'subs' })
  const { derived } = calculator

  const highlights = [
    { label: 'Current API spend', value: fmtUsd(derived.totalApi), note: 'Current monthly workload estimate' },
    { label: 'Cheapest winning subscription', value: derived.cheapestSub?.name || 'API is cheaper', note: derived.cheapestSub ? `${fmtUsd(derived.cheapestSub.price)}/mo` : 'At current usage, direct API wins' },
    { label: 'Annualized API spend', value: fmtUsd(derived.annualApi), note: 'Useful for break-even planning' },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      webAppSchema({
        name: title,
        url: absoluteUrl('/subscriptions'),
        description,
      }),
      faqSchema([
        {
          question: 'When is API billing cheaper than a subscription?',
          answer: 'API billing is usually cheaper when your actual monthly usage is low or highly variable.',
        },
        {
          question: 'What does confidence mean in the subscription results?',
          answer: 'Confidence indicates how explicit the provider is about its usage limits or credit equivalency. Exact plans publish clear numbers, while low-confidence plans rely on estimate ranges.',
        },
      ]),
    ],
  }

  return (
    <div className="page-shell focused-tool-page subscriptions-page">
      <Seo
        title={`${title} | AI Calc Solutions`}
        description={description}
        canonical={absoluteUrl('/subscriptions')}
        schema={schema}
      />
      <section className="content-hero glass-panel compact-hero">
        <p className="content-eyebrow">Subscription planning</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <FocusedControlBar
        calculator={calculator}
        title="Subscription planning inputs"
        subtitle="Use a compact control bar up top, then scan the break-even results below."
      />

      <ResultHighlightRow items={highlights} />

      <div className="focused-page-stack">
        <SummaryPanel calculator={calculator} showSimulator={false} adId="subscriptions-summary-inline" />
        <SubscriptionsPanel calculator={calculator} adId="subscriptions-page-inline" />

        <section className="content-card glass-panel compact-info-card">
          <h2>How to read the subscription results</h2>
          <ul className="content-list compact-list">
            <li>Exact confidence means the plan publishes clear credit equivalency</li>
            <li>High and low confidence plans use best-available estimates from provider limits</li>
            <li>Use your real workflow in the top controls before trusting the break-even recommendation</li>
          </ul>
        </section>

        <AdSlot id="subscriptions-secondary" />
      </div>
    </div>
  )
}
