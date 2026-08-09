import React, { useState, useMemo } from 'react'
import { generateHistoricalPcData } from '../lib/pcRatioEngine'
import { Calendar, Info } from 'lucide-react'

const SERIES_CONFIG = {
  SPY: { label: 'SPY (S&P 500)', color: '#00d4aa', defaultActive: true },
  QQQ: { label: 'QQQ (Nasdaq 100)', color: '#3b82f6', defaultActive: true },
  NVDA: { label: 'NVDA (NVIDIA)', color: '#a78bfa', defaultActive: false },
  AAPL: { label: 'AAPL (Apple)', color: '#f59e0b', defaultActive: false },
}

export default function PcRatioChart() {
  const [timeframe, setTimeframe] = useState('10Y')
  const [activeSeries, setActiveSeries] = useState({
    SPY: true,
    QQQ: true,
    NVDA: false,
    AAPL: false,
  })
  const [hoverIndex, setHoverIndex] = useState(null)

  const data = useMemo(() => generateHistoricalPcData(timeframe), [timeframe])

  const toggleSeries = (key) => {
    setActiveSeries(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Chart dimensions & scaling
  const width = 850
  const height = 360
  const padding = { top: 30, right: 30, bottom: 40, left: 50 }

  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom

  const minY = 0.3
  const maxY = 1.6

  const getY = (val) => {
    const clamped = Math.max(minY, Math.min(maxY, val))
    return padding.top + innerHeight - ((clamped - minY) / (maxY - minY)) * innerHeight
  }

  const getX = (idx) => {
    if (data.length <= 1) return padding.left
    return padding.left + (idx / (data.length - 1)) * innerWidth
  }

  // Generate SVG path for a series key
  const getSeriesPath = (key) => {
    if (!data || data.length === 0) return ''
    return data.reduce((acc, point, idx) => {
      const x = getX(idx)
      const y = getY(point[key] || 0.85)
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`
    }, '')
  }

  // Hover point info
  const hoverPoint = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null

  return (
    <div className="pc-chart-container">
      <div className="pc-chart-header">
        <div className="pc-chart-title-group">
          <h3>
            <Calendar size={18} className="text-teal" />
            Historical Put-to-Call Ratio Comparison ({timeframe})
          </h3>
          <p className="pc-chart-sub">
            Track institutional sentiment &amp; hedging cycles back to {timeframe === '10Y' ? '10 Years' : timeframe}.
          </p>
        </div>

        <div className="pc-chart-controls">
          <div className="pc-timeframe-selector">
            {['1Y', '3Y', '5Y', '10Y'].map((tf) => (
              <button
                key={tf}
                className={`pc-tf-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Series Toggles Bar */}
      <div className="pc-series-toggles">
        <span className="pc-toggle-label">Compare Assets:</span>
        {Object.entries(SERIES_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            className={`pc-series-chip ${activeSeries[key] ? 'active' : ''}`}
            style={{
              '--series-color': cfg.color,
              borderColor: activeSeries[key] ? cfg.color : 'var(--op-border)',
            }}
            onClick={() => toggleSeries(key)}
          >
            <span
              className="pc-chip-dot"
              style={{ background: activeSeries[key] ? cfg.color : 'var(--op-muted)' }}
            />
            {cfg.label}
          </button>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="pc-svg-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="pc-svg"
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const ratioX = (mouseX - (padding.left / width) * rect.width) / ((innerWidth / width) * rect.width)
            const idx = Math.round(ratioX * (data.length - 1))
            if (idx >= 0 && idx < data.length) {
              setHoverIndex(idx)
            }
          }}
        >
          {/* Sentiment Zone Shadings */}
          {/* Extreme Greed Zone (< 0.60) */}
          <rect
            x={padding.left}
            y={getY(0.60)}
            width={innerWidth}
            height={getY(minY) - getY(0.60)}
            fill="rgba(16, 185, 129, 0.05)"
          />
          {/* Bullish Zone (0.60 - 0.85) */}
          <rect
            x={padding.left}
            y={getY(0.85)}
            width={innerWidth}
            height={getY(0.60) - getY(0.85)}
            fill="rgba(0, 212, 170, 0.04)"
          />
          {/* Neutral Zone (0.85 - 1.15) */}
          <rect
            x={padding.left}
            y={getY(1.15)}
            width={innerWidth}
            height={getY(0.85) - getY(1.15)}
            fill="rgba(59, 130, 246, 0.03)"
          />
          {/* Bearish / Extreme Fear Zone (> 1.15) */}
          <rect
            x={padding.left}
            y={getY(maxY)}
            width={innerWidth}
            height={getY(1.15) - getY(maxY)}
            fill="rgba(239, 68, 68, 0.05)"
          />

          {/* Grid lines */}
          {[0.4, 0.6, 0.85, 1.0, 1.15, 1.4].map((val) => {
            const y = getY(val)
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="rgba(255,255,255,0.07)"
                  strokeDasharray={val === 1.0 ? '4 4' : 'none'}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  fill="var(--op-muted)"
                  fontSize="10"
                  textAnchor="end"
                >
                  {val.toFixed(2)}
                </text>
              </g>
            )
          })}

          {/* X Axis Labels */}
          {data.map((point, idx) => {
            const step = Math.ceil(data.length / 8)
            if (idx % step !== 0 && idx !== data.length - 1) return null
            const x = getX(idx)
            return (
              <text
                key={idx}
                x={x}
                y={height - 12}
                fill="var(--op-muted)"
                fontSize="10"
                textAnchor="middle"
              >
                {point.date}
              </text>
            )
          })}

          {/* Lines for each active series */}
          {Object.entries(SERIES_CONFIG).map(([key, cfg]) => {
            if (!activeSeries[key]) return null
            const d = getSeriesPath(key)
            return (
              <path
                key={key}
                d={d}
                fill="none"
                stroke={cfg.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )
          })}

          {/* Hover Crosshair & Dots */}
          {hoverIndex !== null && hoverPoint && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + innerHeight}
                stroke="var(--teal)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {Object.entries(SERIES_CONFIG).map(([key, cfg]) => {
                if (!activeSeries[key]) return null
                const cx = getX(hoverIndex)
                const cy = getY(hoverPoint[key] || 0.85)
                return (
                  <circle
                    key={key}
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill={cfg.color}
                    stroke="#070b14"
                    strokeWidth="2"
                  />
                )
              })}
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoverPoint && (
          <div
            className="pc-chart-tooltip"
            style={{
              left: `${Math.min(72, Math.max(12, (getX(hoverIndex) / width) * 100))}%`,
            }}
          >
            <div className="pc-tooltip-date">{hoverPoint.date}</div>
            <div className="pc-tooltip-items">
              {Object.entries(SERIES_CONFIG).map(([key, cfg]) => {
                if (!activeSeries[key]) return null
                const val = hoverPoint[key]
                return (
                  <div key={key} className="pc-tooltip-row">
                    <span className="pc-tooltip-key" style={{ color: cfg.color }}>
                      ● {key}:
                    </span>
                    <span className="pc-tooltip-val">{val ? val.toFixed(2) : 'N/A'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Legend & Guide */}
      <div className="pc-chart-footer">
        <div className="pc-zone-indicator text-green">
          <span className="pc-zone-badge bg-green-dim">P/C &lt; 0.70</span>
          <span>Bullish / Heavy Call Demand</span>
        </div>
        <div className="pc-zone-indicator text-blue">
          <span className="pc-zone-badge bg-blue-dim">0.70 - 1.00</span>
          <span>Balanced / Neutral</span>
        </div>
        <div className="pc-zone-indicator text-red">
          <span className="pc-zone-badge bg-red-dim">P/C &gt; 1.00</span>
          <span>Bearish / High Hedging</span>
        </div>
      </div>
    </div>
  )
}
