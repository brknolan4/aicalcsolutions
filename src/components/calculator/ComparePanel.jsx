import AdSlot from '../AdSlot'
import { subscriptions } from '../../data/pricingModels'
import { fmtUsd, modelCostForUsage, ratingStars, speedColor } from '../../lib/calculatorUtils'
import CompareModelSelector from './CompareModelSelector'
import ResultHighlightRow from './ResultHighlightRow'

export default function ComparePanel({ calculator, adId = 'compare-bottom' }) {
  const { state, actions, derived } = calculator
  const { sessions, inputTokens, outputTokens } = state
  const { compareIds, compareModels } = { compareIds: state.compareIds, compareModels: derived.compareModels }
  const cols = compareModels
  const colColors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444']

  const workloadCosts = cols.map((m) => ({ model: m, cost: modelCostForUsage(m, sessions, inputTokens, outputTokens) }))
  const cheapestByWorkload = [...workloadCosts].sort((a, b) => a.cost - b.cost)[0]
  const largestContext = [...cols].sort((a, b) => parseInt(String(b.contextWindow).replace(/[^0-9]/g, ''), 10) - parseInt(String(a.contextWindow).replace(/[^0-9]/g, ''), 10))[0]
  const bestOutput = [...cols].sort((a, b) => a.outputPrice - b.outputPrice)[0]

  const compareHighlights = [
    {
      label: 'Lowest monthly cost',
      value: cheapestByWorkload ? cheapestByWorkload.model.name : '—',
      note: cheapestByWorkload ? `${fmtUsd(cheapestByWorkload.cost)}/mo with your current workload` : 'No models selected',
    },
    {
      label: 'Largest context window',
      value: largestContext ? largestContext.contextWindow : '—',
      note: largestContext ? `${largestContext.name} from ${largestContext.provider}` : 'No models selected',
    },
    {
      label: 'Cheapest output pricing',
      value: bestOutput ? bestOutput.name : '—',
      note: bestOutput ? `${fmtUsd(bestOutput.outputPrice)} / 1M output tokens` : 'No models selected',
    },
  ]

  return (
    <div className="dash-tab-content compare-surface">
      <h3>⚡ Model Comparison</h3>
      <p className="compare-intro">Compare up to 5 models. Use the selector below to search, add, and remove models cleanly.</p>

      <CompareModelSelector compareIds={compareIds} onToggle={actions.toggleCompare} max={5} />
      <ResultHighlightRow items={compareHighlights} />

      <details className="compare-section-toggle" open>
        <summary>Core comparison table</summary>
        <div className="compare-table-wrap compare-wide-surface" style={{ width: 'fit-content', maxWidth: '100%', margin: '0.85rem 0 0' }}>
          <div className="compare-grid" style={{ gridTemplateColumns: `140px repeat(${cols.length}, minmax(160px, 240px))` }}>
            <div className="compare-cell header-label"></div>
            {cols.map((m, i) => (
              <div key={m.id} className="compare-cell compare-header" style={{ borderTop: `3px solid ${colColors[i]}` }}>
                <div className="cmp-name">{m.name}</div>
                <div className="cmp-provider">{m.provider}</div>
              </div>
            ))}
            <div className="compare-cell row-label">Overall Rating</div>
            {cols.map((m) => <div key={m.id} className="compare-cell">{ratingStars(m.rating)} <span className={`rating-badge rating-${m.rating?.toLowerCase()}`}>{m.rating}</span></div>)}
            <div className="compare-cell row-label">Response Speed</div>
            {cols.map((m) => <div key={m.id} className="compare-cell"><span style={{ color: speedColor(m.speed), fontWeight: 600 }}>● {m.speed}</span></div>)}
            <div className="compare-cell row-label">Context Window</div>
            {cols.map((m) => <div key={m.id} className="compare-cell cmp-context">{m.contextWindow}</div>)}
            <div className="compare-cell row-label">Specialties</div>
            {cols.map((m) => <div key={m.id} className="compare-cell"><div className="specialty-pills">{m.specialties?.map((s) => <span key={s} className="specialty-pill">{s}</span>)}</div></div>)}
            <div className="compare-cell row-label">Input Price /1M</div>
            {cols.map((m) => <div key={m.id} className="compare-cell price-cell in">${m.inputPrice.toFixed(2)}</div>)}
            <div className="compare-cell row-label">Output Price /1M</div>
            {cols.map((m) => <div key={m.id} className="compare-cell price-cell out">${m.outputPrice.toFixed(2)}</div>)}
            <div className="compare-cell row-label">Daily API Cost</div>
            {cols.map((m) => <div key={m.id} className="compare-cell price-cell">{fmtUsd(modelCostForUsage(m, sessions, inputTokens, outputTokens) / 30)}</div>)}
            <div className="compare-cell row-label">Monthly API Cost</div>
            {cols.map((m) => <div key={m.id} className="compare-cell price-cell primary">{fmtUsd(modelCostForUsage(m, sessions, inputTokens, outputTokens))}</div>)}
            <div className="compare-cell row-label">Annual API Cost</div>
            {cols.map((m) => <div key={m.id} className="compare-cell price-cell">{fmtUsd(modelCostForUsage(m, sessions, inputTokens, outputTokens) * 12)}</div>)}
            <div className="compare-cell row-label">Best For</div>
            {cols.map((m) => <div key={m.id} className="compare-cell cmp-bestfor">{m.bestFor}</div>)}
            <div className="compare-cell row-label">Pros ✓</div>
            {cols.map((m) => <div key={m.id} className="compare-cell"><ul className="pro-con-list">{m.pros?.map((p, i) => <li key={i} className="pro-item">{p}</li>)}</ul></div>)}
            <div className="compare-cell row-label">Cons ✗</div>
            {cols.map((m) => <div key={m.id} className="compare-cell"><ul className="pro-con-list">{m.cons?.map((c, i) => <li key={i} className="con-item">{c}</li>)}</ul></div>)}
          </div>
        </div>
      </details>

      <details className="compare-section-toggle" open>
        <summary>Subscription crossover analysis</summary>
        <div style={{ marginTop: '0.9rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Monthly subscription prices with approximate token capacity based on each selected model&apos;s pricing. Token estimates use the midpoint API-equivalent value ÷ model input price.
          </p>
          <div className="compare-table-wrap compare-wide-surface" style={{ width: 'fit-content', maxWidth: '100%', margin: '0' }}>
            <table className="sub-compare-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Cost</th>
                  {cols.map((m, i) => <th key={m.id} style={{ borderTop: `3px solid ${colColors[i]}` }}>{m.name} — Tokens &amp; Savings</th>)}
                </tr>
              </thead>
              <tbody>
                {[...subscriptions].sort((a, b) => a.price - b.price).map((sub, ri) => {
                  const midVal = (sub.apiValueEstimate[0] + sub.apiValueEstimate[1]) / 2
                  return (
                    <tr key={sub.id} style={{ background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                      <td><div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8rem' }}>{sub.name}</div><div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{sub.provider}</div></td>
                      <td style={{ whiteSpace: 'nowrap' }}><div style={{ fontWeight: 700, color: '#60a5fa' }}>{fmtUsd(sub.price)}/mo</div><div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.15rem' }}>{fmtUsd(sub.price * 12)}/yr</div></td>
                      {cols.map((m) => {
                        const tokEst = Math.round(midVal / m.inputPrice * 1e6)
                        const tokStr = tokEst >= 1e6 ? `~${(tokEst / 1e6).toFixed(1)}M` : `~${(tokEst / 1e3).toFixed(0)}K`
                        const apiCost = modelCostForUsage(m, sessions, inputTokens, outputTokens)
                        const saves = apiCost - sub.price
                        const better = saves > 0
                        return (
                          <td key={`${sub.id}-${m.id}`}>
                            <div style={{ fontWeight: 600, color: '#a78bfa', fontSize: '0.8rem' }}>{tokStr} tokens</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>≈ {fmtUsd(sub.apiValueEstimate[0])}–{fmtUsd(sub.apiValueEstimate[1])} value</div>
                            {better ? <span className="saving-pill">✓ saves {fmtUsd(saves)}/mo vs API</span> : <span className="warning-pill">✗ API {fmtUsd(-saves)}/mo cheaper</span>}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </details>

      <AdSlot id={adId} />
    </div>
  )
}
