import { Activity, BarChart2, Calculator, Coffee, Info, PenTool, RotateCcw, Search, Settings, User, Zap, Code2 } from 'lucide-react'
import { apiModels, usageProfiles } from '../../data/pricingModels'
import { fmt, fmtUsd } from '../../lib/calculatorUtils'

const Tip = ({ icon: Icon, label, tooltip }) => (
  <label>
    {Icon && <Icon size={14} />}
    {label}
    <span className="info-icon">
      <Info size={13} />
      <span className="tooltip-container">{tooltip}</span>
    </span>
  </label>
)

export default function CalculatorSidebar({ calculator }) {
  const { state, actions, derived } = calculator
  const { profile, selectedModel, sessions, inputTokens, outputTokens } = state
  const { monthlyIn, monthlyOut, tokenRatio, costIn, costOut } = derived

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <Calculator size={20} color="#3b82f6" /> Settings
      </div>

      <div className="input-group">
        <Tip icon={User} label="User Profile" tooltip="Presets that auto-fill usage numbers based on your typical workflow. Pick the closest match to your role." />
        <div className="toggle-group profile-grid">
          <button className={`toggle-btn ${profile === 'vibe' ? 'active' : ''}`} onClick={() => actions.setProfile('vibe')}><Coffee size={14} /> Vibe Coder</button>
          <button className={`toggle-btn ${profile === 'heavy' ? 'active' : ''}`} onClick={() => actions.setProfile('heavy')}><Code2 size={14} /> Heavy Coder</button>
          <button className={`toggle-btn ${profile === 'researcher' ? 'active' : ''}`} onClick={() => actions.setProfile('researcher')}><Search size={14} /> Researcher</button>
          <button className={`toggle-btn ${profile === 'marketer' ? 'active' : ''}`} onClick={() => actions.setProfile('marketer')}><PenTool size={14} /> Marketer</button>
          <button className={`toggle-btn ${profile === 'analyst' ? 'active' : ''}`} onClick={() => actions.setProfile('analyst')}><BarChart2 size={14} /> Analyst</button>
          <button className={`toggle-btn ${profile === 'superheavy' ? 'active' : ''}`} onClick={() => actions.setProfile('superheavy')}><Zap size={14} /> Super Heavy</button>
        </div>
        {usageProfiles[profile] && <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.4 }}>{usageProfiles[profile].description}</p>}
      </div>

      <div className="input-group">
        <Tip icon={Zap} label="Base Model" tooltip="Select the AI model you use most. The two numbers shown are the API prices per 1 million tokens — Input price / Output price." />
        <select value={selectedModel} onChange={(e) => actions.setSelectedModel(e.target.value)}>
          {apiModels.map((m) => (
            <option key={m.id} value={m.id}>{m.provider}: {m.name} (In ${m.inputPrice} / Out ${m.outputPrice} per 1M)</option>
          ))}
        </select>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Prices per 1 million tokens · In = prompt · Out = response</p>
      </div>

      <div className="input-group">
        <Tip icon={Activity} label="Monthly Sessions" tooltip="Number of individual chat threads, coding tasks, or agent runs you do each month." />
        <input type="number" value={sessions} onChange={(e) => actions.setSessions(Number(e.target.value))} min="0" />
      </div>

      <div className="input-group">
        <Tip icon={Settings} label="Avg Input Tokens / Session" tooltip="Size of each prompt. A short question ≈ 50 tokens. A code file ≈ 3,000–10,000 tokens." />
        <input type="number" value={inputTokens} onChange={(e) => actions.setInputTokens(Number(e.target.value))} step="500" min="0" />
      </div>

      <div className="input-group">
        <Tip icon={Settings} label="Avg Output Tokens / Session" tooltip="Size of AI's response. A function ≈ 200 tokens. Full file rewrite ≈ 2,000–5,000 tokens." />
        <input type="number" value={outputTokens} onChange={(e) => actions.setOutputTokens(Number(e.target.value))} step="100" min="0" />
      </div>

      <div className="monthly-summary">
        <div className="monthly-summary-row"><span>Total Input / mo</span><span>{fmt(monthlyIn)} tokens</span></div>
        <div className="monthly-summary-row"><span>Total Output / mo</span><span>{fmt(monthlyOut)} tokens</span></div>
        <div className="monthly-summary-row"><span>Output:Input ratio</span><span>{tokenRatio}×</span></div>
        <div className="monthly-summary-row"><span>Input cost</span><span>{fmtUsd(costIn)}</span></div>
        <div className="monthly-summary-row"><span>Output cost</span><span>{fmtUsd(costOut)}</span></div>
      </div>

      <button className="reset-btn" onClick={actions.resetToProfileDefaults}>
        <RotateCcw size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Reset to Defaults
      </button>
    </aside>
  )
}
