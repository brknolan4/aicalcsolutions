import { fmt, fmtUsd } from '../../lib/calculatorUtils'

export default function TokenSimulatorPanel({ calculator, title = '🧪 Token Simulator', intro, adId }) {
  const { state, actions, derived } = calculator
  const { simInput, simOutput } = state
  const { model, simInTokens, simInChars, simInWords, simInCost, simOutTokens, simOutChars, simOutWords, simOutCost } = derived

  return (
    <div className="simulator-section">
      <h3>{title}</h3>
      <p>{intro || `Paste a real prompt or expected response to estimate tokens and cost with ${model.name}.`}</p>
      <div className="sim-grid">
        <div className="sim-card glass-panel input-side">
          <div className="sim-card-title">Your Prompt (Input)</div>
          <textarea className="token-textarea" placeholder="Paste your prompt, code, or context here…" value={simInput} onChange={(e) => actions.setSimInput(e.target.value)} />
          <div className="sim-stats">
            <div className="sim-meta">
              <strong>{fmt(simInTokens)}</strong> tokens<br />
              <span className="sim-cost">{fmt(simInChars)} chars · {fmt(simInWords)} words · ≈ {fmtUsd(simInCost)} per call</span>
            </div>
            <button className="btn-sync blue" onClick={() => actions.setInputTokens(simInTokens)}>Sync to Input</button>
          </div>
        </div>
        <div className="sim-card glass-panel output-side">
          <div className="sim-card-title">AI Response (Output)</div>
          <textarea className="token-textarea" placeholder="Paste an expected AI response here…" value={simOutput} onChange={(e) => actions.setSimOutput(e.target.value)} />
          <div className="sim-stats">
            <div className="sim-meta">
              <strong>{fmt(simOutTokens)}</strong> tokens<br />
              <span className="sim-cost">{fmt(simOutChars)} chars · {fmt(simOutWords)} words · ≈ {fmtUsd(simOutCost)} per call</span>
            </div>
            <button className="btn-sync green" onClick={() => actions.setOutputTokens(simOutTokens)}>Sync to Output</button>
          </div>
        </div>
      </div>
    </div>
  )
}
