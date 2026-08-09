import { Activity, BarChart2, Coffee, Code2, PenTool, RotateCcw, Search, Zap } from 'lucide-react'
import { apiModels, usageProfiles } from '../../data/pricingModels'
import { fmt, fmtUsd } from '../../lib/calculatorUtils'
import FieldTip from './FieldTip'

const profileButtons = [
  { id: 'vibe', label: 'Vibe Coder', icon: Coffee },
  { id: 'heavy', label: 'Heavy Coder', icon: Code2 },
  { id: 'researcher', label: 'Researcher', icon: Search },
  { id: 'marketer', label: 'Marketer', icon: PenTool },
  { id: 'analyst', label: 'Analyst', icon: BarChart2 },
  { id: 'superheavy', label: 'Power User', icon: Zap },
]

export default function FocusedControlBar({ calculator, title = 'Workload settings', subtitle = 'Adjust the assumptions that drive the results below.' }) {
  const { state, actions, derived } = calculator
  const { profile, selectedModel, sessions, inputTokens, outputTokens } = state
  const { monthlyIn, monthlyOut, totalApi, model, tokenRatio, costIn, costOut } = derived

  return (
    <section className="focused-controls glass-panel">
      <div className="focused-controls-head">
        <div>
          <p className="content-eyebrow">Quick controls</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button className="reset-btn compact-reset" onClick={actions.resetToProfileDefaults}>
          <RotateCcw size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Reset
        </button>
      </div>

      <div className="focused-profile-block">
        <div className="focused-profile-label">
          <FieldTip label="Workload preset" tooltip="Choose the preset that most closely matches how you use AI. Each preset changes sessions, input tokens, and output tokens to a realistic starting point." inline />
        </div>
        <div className="focused-profile-row">
          {profileButtons.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`compact-profile-pill ${profile === id ? 'active' : ''}`} onClick={() => actions.setProfile(id)}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
        <div className="profile-summary-card">
          <div>
            <span className="profile-summary-label">Selected preset</span>
            <strong>{usageProfiles[profile]?.name}</strong>
            <p>{usageProfiles[profile]?.description}</p>
          </div>
          <div className="profile-summary-metrics">
            <span>{usageProfiles[profile]?.sessionsPerMonth} sessions/mo</span>
            <span>{usageProfiles[profile]?.inputTokensPerSession} in/session</span>
            <span>{usageProfiles[profile]?.outputTokensPerSession} out/session</span>
          </div>
        </div>
      </div>

      <div className="focused-controls-grid">
        <label className="compact-field">
          <FieldTip label="Model" tooltip="The primary model used for pricing calculations. Input tokens are what you send; output tokens are what the model returns." inline />
          <select value={selectedModel} onChange={(e) => actions.setSelectedModel(e.target.value)}>
            {apiModels.map((m) => (
              <option key={m.id} value={m.id}>{m.provider}: {m.name}</option>
            ))}
          </select>
        </label>
        <label className="compact-field">
          <FieldTip label="Sessions / month" tooltip="How many separate chats, prompts, coding tasks, or agent runs you expect in a typical month." inline />
          <input type="number" value={sessions} onChange={(e) => actions.setSessions(Number(e.target.value))} min="0" />
        </label>
        <label className="compact-field">
          <FieldTip label="Input / session" tooltip="Approximate tokens you send per interaction: prompt text, pasted code, instructions, or context window content." inline />
          <input type="number" value={inputTokens} onChange={(e) => actions.setInputTokens(Number(e.target.value))} min="0" step="100" />
        </label>
        <label className="compact-field">
          <FieldTip label="Output / session" tooltip="Approximate tokens the model sends back: generated code, explanations, summaries, or analysis." inline />
          <input type="number" value={outputTokens} onChange={(e) => actions.setOutputTokens(Number(e.target.value))} min="0" step="100" />
        </label>
      </div>

      <div className="focused-snapshot-row">
        <div className="snapshot-chip primary-chip"><strong>{model.name}</strong><span>Selected model</span></div>
        <div className="snapshot-chip success-chip"><strong>{fmtUsd(totalApi)}</strong><span>Estimated monthly API cost</span></div>
        <div className="snapshot-chip accent-chip"><strong>{tokenRatio}×</strong><span>Output to input ratio</span></div>
      </div>

      <details className="focused-advanced">
        <summary><Activity size={14} /> Advanced usage details</summary>
        <div className="focused-advanced-grid">
          <div className="advanced-stat"><span>Total input / mo</span><strong>{fmt(monthlyIn)} tokens</strong></div>
          <div className="advanced-stat"><span>Total output / mo</span><strong>{fmt(monthlyOut)} tokens</strong></div>
          <div className="advanced-stat"><span>Input cost</span><strong>{fmtUsd(costIn)}</strong></div>
          <div className="advanced-stat"><span>Output cost</span><strong>{fmtUsd(costOut)}</strong></div>
          <div className="advanced-note">
            <strong>{usageProfiles[profile]?.name}</strong>
            <p>{usageProfiles[profile]?.description}</p>
          </div>
        </div>
      </details>
    </section>
  )
}
