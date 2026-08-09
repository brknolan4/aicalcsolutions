import React, { useState, useMemo } from 'react'
import { generateHistoricalPcData } from '../lib/pcRatioEngine'
import { Calendar, TrendingUp } from 'lucide-react'

const SERIES_CONFIG = {
  SPY: { label: 'SPY P/C Ratio', color: '#00d4aa', type: 'ratio', defaultActive: true },
  QQQ: { label: 'QQQ P/C Ratio', color: '#3b82f6', type: 'ratio', defaultActive: true },
  NVDA: { label: 'NVDA P/C Ratio', color: '#a78bfa', type: 'ratio', defaultActive: false },
  AAPL: { label: 'AAPL P/C Ratio', color: '#f59e0b', type: 'ratio', defaultActive: false },
  SPY_PRICE: { label: 'SPY Price ($)', color: '#10b981', type: 'price', defaultActive: true, isDashed: true },
  QQQ_PRICE: { label: 'QQQ Price ($)', color: '#60a5fa', type: 'price', defaultActive: false, isDashed: true },
}

export default function PcRatioChart() {
  const [timeframe, setTimeframe] = useState('10Y')
  const [activeSeries, setActiveSeries] = useState({
    SPY: true,
    QQQ: true,
    NVDA: false,
    AAPL: false,
    SPY_PRICE: true,
    QQQ_PRICE: false,
  })
  const [hoverIndex, setHoverIndex] = useState(null)

  const data = useMemo(() => generateHistoricalPcData(timeframe), [timeframe])

  const toggleSeries = (key) => {
    setActiveSeries(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Chart dimensions & scaling
  const width = 880
  const height = 380
  const padding = { top: 30, right: 65, bottom: 45, left: 55 }

  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom

  // Y-Axis 1: P/C Ratio (0.3 to 1.6)
  const minYRatio = 0.3
  const maxYRatio = 1.6

  // Y-Axis 2: Index Price ($100 to $650)
  const minYPrice = 90
  const maxYPrice = 640

  const getRatioY = (val) => {
    const clamped = Math.max(minYRatio, Math.min(maxYRatio, val))
    return padding.top + innerHeight - ((clamped - minYRatio) / (maxYRatio - minYRatio)) * innerHeight
  }

  const getPriceY = (val) => {
    const clamped = Math.max(minYPrice, Math.min(maxYPrice, val))
    return padding.top + innerHeight - ((clamped - minYPrice) / (maxYPrice - minYPrice)) * innerHeight
  }

  const getX = (idx) => {
    if (data.length <= 1) return padding.left
    return padding.left + (idx / (data.length - 1)) * innerWidth
  }

  // Generate SVG path for a series key
  const getSeriesPath = (key, type) => {
    if (!data || data.length === 0) return ''
    return data.reduce((acc, point, idx) => {
      const x = getX(idx)
      const val = point[key] || (type === 'price' ? 200 : 0.85)
      const y = type === 'price' ? getPriceY(val) : getRatioY(val)
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`
    }, '')
  }

  const hoverPoint = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null

  return (
    <div className="pc-chart-container">
      <div className="pc-chart-header">
        <div className="pc-chart-title-group">
          <h3>
            <TrendingUp size={18} className="text-teal" />
            Historical Put/Call Ratio vs. SPY / QQQ Index Price Overlay ({timeframe})
          </h3>
          <p className="pc-chart-sub">
            Overlay benchmark ETF market prices (Right Axis) on Put-to-Call sentiment ratios (Left Axis) over a {timeframe === '10Y' ? '10-Year' : timeframe} timeline.
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
        <span className="pc-toggle-label">Series Overlay:</span>
        {Object.entries(SERIES_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            className={`pc-series-chip ${activeSeries[key] ? 'active' : ''}`}
            style={{
              borderColor: activeSeries[key] ? cfg.color : 'var(--op-border)',
            }}
            onClick={() => toggleSeries(key)}
          >
            <span
              className="pc-chip-dot"
              style={{
                background: activeSeries[key] ? cfg.color : 'var(--op-muted)',
                borderRadius: cfg.isDashed ? '2px' : '50%',
              }}
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
            y={getRatioY(0.60)}
            width={innerWidth}
            height={getRatioY(minYRatio) - getRatioY(0.60)}
            fill="rgba(16, 185, 129, 0.05)"
          />
          {/* Bullish Zone (0.60 - 0.85) */}
          <rect
            x={padding.left}
            y={getRatioY(0.85)}
            width={innerWidth}
            height={getRatioY(0.60) - getRatioY(0.85)}
            fill="rgba(0, 212, 170, 0.04)"
          />
          {/* Neutral Zone (0.85 - 1.15) */}
          <rect
            x={padding.left}
            y={getRatioY(1.15)}
            width={innerWidth}
            height={getRatioY(0.85) - getRatioY(1.15)}
            fill="rgba(59, 130, 246, 0.03)"
          />
          {/* Bearish / Extreme Fear Zone (> 1.15) */}
          <rect
            x={padding.left}
            y={getRatioY(maxYRatio)}
            width={innerWidth}
            height={getRatioY(1.15) - getRatioY(maxYRatio)}
            fill="rgba(239, 68, 68, 0.05)"
          />

          {/* Left Y Axis Grid Lines (P/C Ratios) */}
          {[0.4, 0.6, 0.85, 1.0, 1.15, 1.4].map((val) => {
            const y = getRatioY(val)
            return (
              <g key={`ratio-${val}`}>
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

          {/* Right Y Axis Grid Labels (Index Prices) */}
          {[100, 200, 300, 400, 500, 600].map((val) => {
            const y = getPriceY(val)
            return (
              <g key={`price-${val}`}>
                <text
                  x={padding.left + innerWidth + 8}
                  y={y + 4}
                  fill="#10b981"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="start"
                >
                  ${val}
                </text>
              </g>
            )
          })}

          {/* X Axis Date Labels */}
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

          {/* Render Lines for Active Series */}
          {Object.entries(SERIES_CONFIG).map(([key, cfg]) => {
            if (!activeSeries[key]) return null
            const d = getSeriesPath(key, cfg.type)
            return (
              <path
                key={key}
                d={d}
                fill="none"
                stroke={cfg.color}
                strokeWidth={cfg.type === 'price' ? '2.2' : '2.5'}
                strokeDasharray={cfg.isDashed ? '6 4' : 'none'}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={cfg.type === 'price' ? 0.9 : 1.0}
              />
            )
          })}

          {/* Hover Crosshair & Data Points */}
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
                const val = hoverPoint[key]
                if (val === undefined) return null
                const cy = cfg.type === 'price' ? getPriceY(val) : getRatioY(val)
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
              left: `${Math.min(70, Math.max(15, (getX(hoverIndex) / width) * 100))}%`,
            }}
          >
            <div className="pc-tooltip-date">{hoverPoint.date}</div>
            <div className="pc-tooltip-items">
              {Object.entries(SERIES_CONFIG).map(([key, cfg]) => {
                if (!activeSeries[key]) return null
                const val = hoverPoint[key]
                if (val === undefined) return null
                return (
                  <div key={key} className="pc-tooltip-row">
                    <span className="pc-tooltip-key" style={{ color: cfg.color }}>
                      ● {key.replace('_PRICE', '')}:
                    </span>
                    <span className="pc-tooltip-val">
                      {cfg.type === 'price' ? `$${val.toFixed(2)}` : val.toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Legend & Axis Guide */}
      <div className="pc-chart-footer">
        <div className="pc-zone-indicator text-teal">
          <span>Left Axis:</span>
          <span className="pc-zone-badge bg-blue-dim">P/C Sentiment Ratios</span>
        </div>
        <div className="pc-zone-indicator text-green">
          <span>Right Axis:</span>
          <span className="pc-zone-badge bg-green-dim">Index ETF Prices ($)</span>
        </div>
      </div>
    </div>
  )
}
