import { examplePrompts } from '../../data/pricingModels'
import { fmtUsd } from '../../lib/calculatorUtils'

const profileExampleMap = {
  vibe: ['quick-function', 'react-component'],
  heavy: ['full-page', 'debug-session'],
  researcher: ['financial-analysis', 'market-research'],
  marketer: ['market-research', 'react-component'],
  analyst: ['financial-analysis', 'debug-session'],
  superheavy: ['full-page', 'market-research'],
}

export default function ProfileExamplesStrip({ calculator }) {
  const { state, derived } = calculator
  const ids = profileExampleMap[state.profile] || []
  const examples = ids.map((id) => examplePrompts.find((item) => item.id === id)).filter(Boolean)

  if (!examples.length) return null

  return (
    <section className="profile-example-strip glass-panel">
      <div className="profile-example-head">
        <p className="content-eyebrow">Preset examples</p>
        <h3>What this profile usually looks like</h3>
      </div>
      <div className="profile-example-grid">
        {examples.map((example) => {
          const cost = derived.exCost(example.inputTokens, example.outputTokens)
          return (
            <div key={example.id} className="profile-example-card">
              <div className="profile-example-top">
                <strong>{example.title}</strong>
                <span className="role-badge">{example.category}</span>
              </div>
              <p>{example.description}</p>
              <div className="profile-example-metrics">
                <span>In {example.inputTokens}</span>
                <span>Out {example.outputTokens}</span>
                <span>{fmtUsd(cost)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
