import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { INDICES_DATA, getPcRatioMetrics } from '../lib/pcRatioEngine'
import PcRatioChart from '../components/PcRatioChart'
import {
  TrendingUp,
  BarChart2,
  PieChart,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Info,
  Layers,
  HelpCircle
} from 'lucide-react'

export default function PcRatioPage() {
  const [selectedIndex, setSelectedIndex] = useState('SPY')
  const [indexMetrics, setIndexMetrics] = useState(null)
  const [holdingsData, setHoldingsData] = useState([])
  const [loading, setLoading] = useState(true)

  const currentIndex = INDICES_DATA[selectedIndex]

  useEffect(() => {
    let isMounted = true
    async function loadIndexData() {
      setLoading(true)
      // 1. Fetch index level metrics
      const metrics = await getPcRatioMetrics(selectedIndex)
      if (!isMounted) return
      setIndexMetrics(metrics)

      // 2. Fetch top 10 holdings metrics
      const holdingsPromises = currentIndex.topHoldings.map(async (h) => {
        const m = await getPcRatioMetrics(h.symbol)
        return {
          ...h,
          price: m.price,
          changePercent: m.changePercent,
          pcVolumeRatio: m.pcVolumeRatio,
          pcOiRatio: m.pcOiRatio,
          sentiment: m.sentiment,
        }
      })

      const resolvedHoldings = await Promise.all(holdingsPromises)
      if (isMounted) {
        setHoldingsData(resolvedHoldings)
        setLoading(false)
      }
    }

    loadIndexData()
    return () => { isMounted = false }
  }, [selectedIndex])

  return (
    <div className="op-container pc-page-shell" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section className="op-hero-section">
        <div className="op-eyebrow">
          <TrendingUp size={14} /> Index &amp; Stock Sentiment Engine
        </div>
        <h1 className="op-hero-title">
          Put-to-Call Ratio <em>Market Tracker</em>
        </h1>
        <p className="op-hero-subtitle">
          Monitor institutional hedging, sentiment shifts, and option market positioning for benchmark indices and their top 10 underlying stocks over a 10-year timeline.
        </p>
      </section>

      {/* Index Selector Tabs */}
      <div className="pc-index-tabs-wrapper">
        <div className="pc-index-tabs">
          {Object.keys(INDICES_DATA).map((idxKey) => (
            <button
              key={idxKey}
              className={`pc-index-tab ${selectedIndex === idxKey ? 'active' : ''}`}
              onClick={() => setSelectedIndex(idxKey)}
            >
              <Layers size={16} />
              <span>{INDICES_DATA[idxKey].symbol}</span>
              <small>{idxKey === 'SPY' ? 'S&P 500' : 'Nasdaq 100'}</small>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="op-kpi-strip" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
        <div className="op-kpi-card">
          <div className="op-kpi-label">Underlying Price</div>
          <div className="op-kpi-val">
            ${indexMetrics ? indexMetrics.price.toFixed(2) : '---'}
            {indexMetrics && (
              <span className={`op-kpi-badge ${indexMetrics.changePercent >= 0 ? 'pos' : 'neg'}`}>
                {indexMetrics.changePercent >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(indexMetrics.changePercent).toFixed(2)}%
              </span>
            )}
          </div>
          <div className="op-kpi-sub">{currentIndex.name}</div>
        </div>

        <div className="op-kpi-card">
          <div className="op-kpi-label">P/C Volume Ratio</div>
          <div className="op-kpi-val text-teal">
            {indexMetrics ? indexMetrics.pcVolumeRatio.toFixed(2) : '---'}
          </div>
          <div className="op-kpi-sub">
            {indexMetrics
              ? `${indexMetrics.putVol.toLocaleString()} Puts / ${indexMetrics.callVol.toLocaleString()} Calls`
              : 'Calculating volume...'}
          </div>
        </div>

        <div className="op-kpi-card">
          <div className="op-kpi-label">P/C Open Interest</div>
          <div className="op-kpi-val text-purple">
            {indexMetrics ? indexMetrics.pcOiRatio.toFixed(2) : '---'}
          </div>
          <div className="op-kpi-sub">
            {indexMetrics
              ? `${indexMetrics.putOi.toLocaleString()} Put OI / ${indexMetrics.callOi.toLocaleString()} Call OI`
              : 'Calculating open interest...'}
          </div>
        </div>

        <div className="op-kpi-card">
          <div className="op-kpi-label">Market Sentiment Signal</div>
          <div className="op-kpi-val" style={{ color: indexMetrics?.sentiment?.color || 'var(--teal)' }}>
            {indexMetrics ? indexMetrics.sentiment.label : 'Analyzing...'}
          </div>
          <div className="op-kpi-sub">
            {indexMetrics ? indexMetrics.sentiment.desc.split('.')[0] : 'Institutional positioning'}
          </div>
        </div>
      </div>

      {/* 10-Year Historical Comparison Chart */}
      <section className="op-panel-box" style={{ marginBottom: '2.5rem' }}>
        <PcRatioChart />
      </section>

      {/* Top 10 Underlying Holdings Table */}
      <section className="op-panel-box" style={{ marginBottom: '2.5rem' }}>
        <div className="op-grid-header">
          <div className="op-grid-title">
            <BarChart2 size={18} className="text-teal" />
            Top 10 Components of {currentIndex.symbol} — Option Market Positioning
          </div>
          <div className="op-grid-sub">
            Weighted influence breakdown &amp; real-time Put-to-Call sentiment by stock.
          </div>
        </div>

        <div className="op-table-wrapper" style={{ overflowX: 'auto' }}>
          <table className="op-table">
            <thead>
              <tr>
                <th style={{ width: '12%' }}>Symbol</th>
                <th style={{ width: '22%' }}>Company Name</th>
                <th style={{ width: '12%' }}>Index Weight</th>
                <th style={{ width: '14%' }}>Last Price</th>
                <th style={{ width: '15%' }}>P/C Vol Ratio</th>
                <th style={{ width: '15%' }}>Sentiment</th>
                <th style={{ width: '10%' }}>Extract</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="op-loading-spinner" />
                    <span style={{ marginLeft: '0.75rem', color: 'var(--op-muted)' }}>
                      Fetching option chains for {currentIndex.symbol} top 10 constituents...
                    </span>
                  </td>
                </tr>
              ) : (
                holdingsData.map((item) => (
                  <tr key={item.symbol}>
                    <td>
                      <strong className="text-teal" style={{ fontSize: '0.95rem' }}>
                        {item.symbol}
                      </strong>
                    </td>
                    <td>
                      <div style={{ color: 'var(--op-text)', fontWeight: 500 }}>{item.name}</div>
                      <small style={{ color: 'var(--op-muted)', fontSize: '0.75rem' }}>{item.sector}</small>
                    </td>
                    <td>
                      <span className="op-badge-blue">{item.weight}%</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>${item.price.toFixed(2)}</div>
                      <small className={item.changePercent >= 0 ? 'text-green' : 'text-red'}>
                        {item.changePercent >= 0 ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </small>
                    </td>
                    <td>
                      <span
                        className="op-mono-tag"
                        style={{
                          fontWeight: 700,
                          color: item.pcVolumeRatio > 1.0 ? 'var(--red)' : item.pcVolumeRatio < 0.7 ? 'var(--green)' : 'var(--teal)',
                        }}
                      >
                        {item.pcVolumeRatio.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span
                        className="op-pill-badge"
                        style={{
                          background: `${item.sentiment.color}18`,
                          color: item.sentiment.color,
                          borderColor: `${item.sentiment.color}40`,
                        }}
                      >
                        {item.sentiment.label}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/options-extractor?ticker=${item.symbol}`}
                        className="op-icon-link-btn"
                        title={`Extract full option chain for ${item.symbol}`}
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sentiment & Educational Guide */}
      <section className="op-panel-box op-guide-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <HelpCircle size={22} className="text-teal" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--op-text)', margin: 0 }}>
            How Institutional Investors Read Index Put-to-Call Ratios
          </h2>
        </div>

        <div className="pc-guide-grid">
          <div className="pc-guide-card">
            <h3>
              <ShieldAlert size={16} className="text-teal" /> What is the Put-to-Call Ratio?
            </h3>
            <p>
              The Put-to-Call (P/C) Ratio measures total Put volume divided by total Call volume. A ratio of <strong>1.00</strong> means equal trading in puts and calls. Ratios below <strong>0.70</strong> reflect bullish call dominance, while ratios above <strong>1.00</strong> signal defensive put buying.
            </p>
          </div>

          <div className="pc-guide-card">
            <h3>
              <TrendingUp size={16} className="text-purple" /> Contrarian Indicator Dynamic
            </h3>
            <p>
              Index P/C ratios (like SPY and QQQ) are often used as <strong>contrarian sentiment indicators</strong>. When index P/C ratios spike to extreme levels (&gt; 1.40) during market sell-offs, it usually indicates panic hedging—frequently marking market bottoms.
            </p>
          </div>

          <div className="pc-guide-card">
            <h3>
              <PieChart size={16} className="text-blue" /> Single Stock vs. Index Ratios
            </h3>
            <p>
              Individual growth stocks like NVDA or AAPL often maintain lower natural P/C ratios (&lt; 0.65) due to retail speculative call buying, whereas broader market ETFs (SPY, QQQ) naturally carry higher P/C ratios due to portfolio protection demand by fund managers.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
