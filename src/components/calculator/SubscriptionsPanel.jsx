import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import AdSlot from '../AdSlot'
import { providers } from '../../data/pricingModels'
import { fmtUsd } from '../../lib/calculatorUtils'

export default function SubscriptionsPanel({ calculator, adId = 'subs-bottom' }) {
  const { state, actions, derived } = calculator
  const { providerFilter } = state
  const { filteredSubs, totalApi } = derived

  return (
    <div className="dash-tab-content">
      <div>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>Subscription Breakdown</h3>
        <div className="provider-filters">
          {providers.map((p) => <button key={p} className={`filter-pill ${providerFilter === p ? 'active' : ''}`} onClick={() => actions.setProviderFilter(p)}>{p}</button>)}
        </div>
      </div>
      <div className="sub-list">
        {filteredSubs.map((sub) => {
          const isWorthIt = totalApi > sub.price
          const badgeClass = sub.confidence === 'exact' ? 'badge-exact' : sub.confidence === 'high' ? 'badge-high' : 'badge-low'
          const SubIcon = sub.confidence === 'exact' ? CheckCircle2 : AlertTriangle
          return (
            <div key={sub.id} className="sub-item">
              <div className="sub-info">
                <h4>{sub.name}<span className={`badge ${badgeClass}`}><SubIcon size={10} /> {sub.confidence}</span></h4>
                <p>{sub.description}</p>
                <div className="equivalence">API-equivalent value: <strong style={{ color: '#fff' }}>{fmtUsd(sub.apiValueEstimate[0])} – {fmtUsd(sub.apiValueEstimate[1])}</strong> /mo</div>
                <div className={`break-even-text ${isWorthIt ? 'worth-it' : ''}`}>
                  {isWorthIt ? `✅ Your ${fmtUsd(totalApi)}/mo API usage exceeds this plan — subscription saves ${fmtUsd(totalApi - sub.price)}/mo.` : `⚠️ At ${fmtUsd(totalApi)}/mo, direct API is ${fmtUsd(sub.price - totalApi)}/mo cheaper.`}
                </div>
              </div>
              <div className="sub-price">
                <div className="sub-price-val">{fmtUsd(sub.price)}</div>
                <div className="sub-price-annual">{fmtUsd(sub.price * 12)}/yr</div>
              </div>
            </div>
          )
        })}
        {filteredSubs.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No subscriptions match this filter.</p>}
      </div>
      <AdSlot id={adId} />
    </div>
  )
}
