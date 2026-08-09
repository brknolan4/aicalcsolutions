import { BarChart3, DollarSign, Trophy, TrendingDown } from 'lucide-react'
import AdSlot from '../AdSlot'
import TokenSimulatorPanel from './TokenSimulatorPanel'
import { fmtUsd } from '../../lib/calculatorUtils'

export default function SummaryPanel({ calculator, showSimulator = true, adId = 'summary-bottom' }) {
  const { derived } = calculator
  const { model, costIn, costOut, totalApi, annualApi, dailyApi, weeklyApi, cheapestSub, bestValue } = derived

  return (
    <div className="dash-tab-content">
      <div className="summary-grid">
        <div className="summary-card glass-panel primary">
          <span className="card-label"><DollarSign size={14} /> Direct API / Month</span>
          <div className="card-value">{fmtUsd(totalApi)}</div>
          <div className="card-sub">{model.name} · In {fmtUsd(costIn)} + Out {fmtUsd(costOut)}</div>
        </div>
        <div className="summary-card glass-panel amber">
          <span className="card-label"><BarChart3 size={14} /> Annualized API Cost</span>
          <div className="card-value">{fmtUsd(annualApi)}</div>
          <div className="card-sub">12 months at current usage</div>
        </div>
        <div className="summary-card glass-panel green">
          <span className="card-label"><TrendingDown size={14} /> Cheapest Sub Alternative</span>
          <div className="card-value">{cheapestSub ? cheapestSub.name : '—'}</div>
          <div className="card-sub">{cheapestSub ? `${fmtUsd(cheapestSub.price)}/mo · saves ${fmtUsd(totalApi - cheapestSub.price)}/mo` : 'API is cheaper than all subscriptions'}</div>
        </div>
        <div className="summary-card glass-panel purple">
          <span className="card-label"><Trophy size={14} /> Best Value Plan</span>
          <div className="card-value">{bestValue ? bestValue.name : '—'}</div>
          <div className="card-sub">{bestValue ? `${fmtUsd(bestValue.price)}/mo · ${bestValue.ratio.toFixed(1)}× value ratio` : 'N/A'}</div>
        </div>
      </div>

      <div className="cost-breakdown-row">
        <div className="breakdown-cell">
          <span className="breakdown-label">Cost Per Day</span>
          <span className="breakdown-value">{fmtUsd(dailyApi)}</span>
          <span className="breakdown-sub">÷ 30 days</span>
        </div>
        <div className="breakdown-cell">
          <span className="breakdown-label">Cost Per Week</span>
          <span className="breakdown-value">{fmtUsd(weeklyApi)}</span>
          <span className="breakdown-sub">÷ 4.33 weeks</span>
        </div>
        <div className="breakdown-cell">
          <span className="breakdown-label">Cost Per Year</span>
          <span className="breakdown-value">{fmtUsd(annualApi)}</span>
          <span className="breakdown-sub">× 12 months</span>
        </div>
      </div>

      {showSimulator && <TokenSimulatorPanel calculator={calculator} />}
      <AdSlot id={adId} />
    </div>
  )
}
