import { ChevronDown, ChevronUp, FileCode } from 'lucide-react'
import AdSlot from '../AdSlot'
import { examplePrompts } from '../../data/pricingModels'
import { fmt, fmtUsd } from '../../lib/calculatorUtils'

export default function ExamplesPanel({ calculator, adId = 'examples-bottom', title = 'Example workloads by role', intro }) {
  const { state, actions, derived } = calculator
  const { expandedExample } = state
  const { exCost, model } = derived

  return (
    <div className="dash-tab-content examples-surface">
      <div className="examples-section">
        <h3>{title}</h3>
        <p>{intro || `See what actual sessions look like — with token counts and estimated costs using ${model.name}.`}</p>
        <div className="example-list">
          {examplePrompts.map((ex) => {
            const isOpen = expandedExample === ex.id
            const cost = exCost(ex.inputTokens, ex.outputTokens)
            const ratio = (ex.outputTokens / ex.inputTokens).toFixed(1)
            const diffClass = ex.difficulty === 'Light' ? 'diff-light' : ex.difficulty === 'Medium' ? 'diff-medium' : 'diff-heavy'
            return (
              <div key={ex.id} className="example-card" onClick={() => actions.setExpandedExample(isOpen ? null : ex.id)}>
                <div className="example-header">
                  <h4>
                    <FileCode size={16} />{ex.title}
                    <span className={`diff-badge ${diffClass}`}>{ex.difficulty}</span>
                    <span className="diff-badge role-badge">{ex.category}</span>
                  </h4>
                  {isOpen ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
                </div>
                <p className="example-desc">{ex.description}</p>
                <div className="example-metrics">
                  <div className="example-metric"><span className="example-metric-label">Input</span><span className="example-metric-value blue">{fmt(ex.inputTokens)} tokens</span></div>
                  <div className="example-metric"><span className="example-metric-label">Output</span><span className="example-metric-value green">{fmt(ex.outputTokens)} tokens</span></div>
                  <div className="example-metric"><span className="example-metric-label">Ratio</span><span className="example-metric-value amber">{ratio}×</span></div>
                  <div className="example-metric"><span className="example-metric-label">API Cost</span><span className="example-metric-value purple">{fmtUsd(cost)}</span></div>
                </div>
                {isOpen && (
                  <div className="example-detail">
                    <div style={{ marginBottom: '0.75rem' }}><div className="example-code-label">Input Prompt</div><div className="example-code">{ex.input}</div></div>
                    <div><div className="example-code-label">AI Output</div><div className="example-code">{ex.output}</div></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <AdSlot id={adId} />
    </div>
  )
}
