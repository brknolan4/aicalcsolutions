import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { apiModels } from '../../data/pricingModels'

const providerOptions = ['All', ...Array.from(new Set(apiModels.map((m) => m.provider)))]

export default function CompareModelSelector({ compareIds, onToggle, max = 5 }) {
  const [query, setQuery] = useState('')
  const [provider, setProvider] = useState('All')

  const selectedModels = useMemo(
    () => compareIds.map((id) => apiModels.find((m) => m.id === id)).filter(Boolean),
    [compareIds],
  )

  const availableModels = useMemo(() => {
    const q = query.trim().toLowerCase()
    return apiModels.filter((m) => {
      const providerMatch = provider === 'All' || m.provider === provider
      const queryMatch = !q || `${m.provider} ${m.name} ${m.specialties.join(' ')}`.toLowerCase().includes(q)
      return providerMatch && queryMatch
    })
  }, [provider, query])

  return (
    <section className="compare-selector glass-panel">
      <div className="compare-selector-head">
        <div>
          <p className="content-eyebrow">Model selector</p>
          <h4>Choose up to {max} models to compare</h4>
        </div>
        <div className="compare-selected-count">{compareIds.length} / {max} selected</div>
      </div>

      <div className="compare-selected-row">
        {selectedModels.map((model) => (
          <button key={model.id} className="selected-model-chip" onClick={() => onToggle(model.id)}>
            <span className="selected-model-text">
              <strong>{model.name}</strong>
              <small>{model.provider}</small>
            </span>
            <X size={14} />
          </button>
        ))}
      </div>

      <div className="compare-search-row">
        <label className="compare-search-box">
          <Search size={15} />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search models, providers, specialties..." />
        </label>
        <select className="compare-provider-filter" value={provider} onChange={(e) => setProvider(e.target.value)}>
          {providerOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>

      <div className="compare-available-grid">
        {availableModels.map((model) => {
          const selected = compareIds.includes(model.id)
          const disabled = !selected && compareIds.length >= max
          return (
            <button
              key={model.id}
              className={`compare-model-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => onToggle(model.id)}
              disabled={disabled}
            >
              <div className="compare-model-card-top">
                <strong>{model.name}</strong>
                <span className={`compare-model-state ${selected ? 'selected' : ''}`}>{selected ? 'Selected' : 'Add'}</span>
              </div>
              <p>{model.provider}</p>
              <div className="compare-model-meta">
                <span>In ${model.inputPrice}/1M</span>
                <span>Out ${model.outputPrice}/1M</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
