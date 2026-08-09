import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  FileSpreadsheet,
  HelpCircle,
  Info,
  Maximize2,
  RefreshCw,
  RotateCcw,
  Search,
  Sliders,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AdSlot from '../components/AdSlot'
import Seo from '../components/Seo'
import { downloadOptionsCsv, generateOptionsCsv } from '../lib/optionsCsvExporter'
import { fetchOptionsData } from '../lib/optionsEngine'
import { absoluteUrl, faqSchema, webAppSchema } from '../lib/seo'

const POPULAR_TICKERS = ['AAPL', 'SPY', 'TSLA', 'NVDA', 'QQQ', 'MSFT', 'AMZN', 'AMD', 'META', 'GOOGL']

// Column width defaults for resizable grid
const DEFAULT_COL_WIDTHS = {
  contractSymbol: 185,
  optionType: 80,
  expiration: 105,
  strike: 95,
  lastPrice: 85,
  bid: 80,
  ask: 80,
  change: 85,
  volume: 90,
  openInterest: 95,
  iv: 85,
  delta: 85,
  gamma: 85,
  theta: 85,
  vega: 85,
  itm: 70,
}

// Tooltip helper component
function VariableTooltip({ text }) {
  const [visible, setVisible] = useState(false)
  return (
    <span
      className="variable-tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible(!visible)}
      role="button"
      tabIndex={0}
      aria-label="Field explanation"
    >
      <HelpCircle size={14} className="question-help-icon" />
      {visible && <span className="tooltip-bubble">{text}</span>}
    </span>
  )
}

// Detailed header definitions for glossary
const HEADER_GLOSSARY = [
  {
    key: 'contractSymbol',
    label: 'Contract Symbol',
    short: 'OCC Ticker',
    description: 'The standardized OCC (Options Clearing Corporation) identifier for the contract (e.g. AAPL260821C00190000).',
  },
  {
    key: 'optionType',
    label: 'Option Type',
    short: 'CALL / PUT',
    description: 'CALL gives you the right to BUY 100 shares at the strike. PUT gives you the right to SELL 100 shares at the strike.',
  },
  {
    key: 'strike',
    label: 'Strike Price',
    short: 'Execution Price',
    description: 'The predetermined price at which the underlying stock can be bought (Call) or sold (Put) upon exercise.',
  },
  {
    key: 'lastPrice',
    label: 'Last Price',
    short: 'Premium',
    description: 'The most recent price per share paid for the contract. Multiply by 100 to get total contract price.',
  },
  {
    key: 'bidAsk',
    label: 'Bid / Ask',
    short: 'Market Spread',
    description: 'Bid is the highest price buyers offer; Ask is the lowest price sellers accept. Narrow spreads mean higher liquidity.',
  },
  {
    key: 'change',
    label: 'Change ($ / %)',
    short: 'Daily Price Shift',
    description: 'Dollar and percentage change in option contract price compared to the previous trading session close.',
  },
  {
    key: 'volume',
    label: 'Volume',
    short: 'Daily Contracts Traded',
    description: 'Total number of option contracts bought and sold during the current trading session.',
  },
  {
    key: 'openInterest',
    label: 'Open Interest (OI)',
    short: 'Active Contracts',
    description: 'Total number of active outstanding contracts that have been opened but not yet settled or closed.',
  },
  {
    key: 'iv',
    label: 'Implied Volatility (IV)',
    short: 'Expected Volatility %',
    description: 'The annualized market expectation of stock price volatility. Higher IV means higher option premiums.',
  },
  {
    key: 'delta',
    label: 'Delta (Δ)',
    short: 'Price Sensitivity',
    description: 'Expected change in option price per $1 move in the stock ($0 to 1.0 for Calls, -1.0 to 0 for Puts). Also estimates probability of expiring ITM.',
  },
  {
    key: 'gamma',
    label: 'Gamma (Γ)',
    short: 'Delta Acceleration',
    description: 'Rate of change in Delta per $1 move in stock price. Measures how fast Delta changes as stock moves.',
  },
  {
    key: 'theta',
    label: 'Theta (Θ)',
    short: 'Daily Time Decay',
    description: 'Dollar amount the option premium loses each calendar day due to time decay (always negative for long options).',
  },
  {
    key: 'vega',
    label: 'Vega (ν)',
    short: 'Volatility Sensitivity',
    description: 'Expected change in option premium per 1% change in Implied Volatility.',
  },
  {
    key: 'rho',
    label: 'Rho (ρ)',
    short: 'Interest Rate Impact',
    description: 'Expected change in option price per 1% change in risk-free interest rates.',
  },
  {
    key: 'itm',
    label: 'ITM / OTM',
    short: 'Moneyness Status',
    description: 'In-The-Money (ITM) has intrinsic value (e.g. Call strike < Stock price). Out-of-The-Money (OTM) has time value only.',
  },
]

export default function OptionsExtractorPage() {
  const [symbol, setSymbol] = useState('AAPL')
  const [inputSymbol, setInputSymbol] = useState('AAPL')

  // Date selection state
  const [dateMode, setDateMode] = useState('SINGLE') // SINGLE or RANGE
  const [selectedDate, setSelectedDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showGlossary, setShowGlossary] = useState(true)

  // Resizable columns state
  const [colWidths, setColWidths] = useState(DEFAULT_COL_WIDTHS)
  const [isExpandedBox, setIsExpandedBox] = useState(false)

  // Filters
  const [typeFilter, setTypeFilter] = useState('ALL') // ALL, CALLS, PUTS
  const [moneynessFilter, setMoneynessFilter] = useState('ALL') // ALL, ITM, OTM, NEAR
  const [strikeSearch, setStrikeSearch] = useState('')
  const [viewTab, setViewTab] = useState('COMBINED')

  const handleMouseDownResizer = (e, colKey) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = colWidths[colKey] || 90

    const onMouseMove = (moveEvent) => {
      const diff = moveEvent.clientX - startX
      const newWidth = Math.max(50, startWidth + diff)
      setColWidths((prev) => ({ ...prev, [colKey]: newWidth }))
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const resetColumnWidths = () => {
    setColWidths(DEFAULT_COL_WIDTHS)
  }

  const fetchOptions = async (targetSymbol, expDate = '') => {
    setLoading(true)
    setError(null)
    try {
      const json = await fetchOptionsData(targetSymbol, expDate)
      setData(json)

      if (json.selectedExpiration?.dateStr && !selectedDate) {
        setSelectedDate(json.selectedExpiration.dateStr)
        setStartDate(json.selectedExpiration.dateStr)
      }
      if (json.expirationDates && json.expirationDates.length > 0) {
        const lastIndex = Math.min(3, json.expirationDates.length - 1)
        if (!endDate) {
          setEndDate(json.expirationDates[lastIndex].dateStr)
        }
      }
    } catch (err) {
      console.error('Error fetching options:', err)
      setError(err.message || 'Unable to connect to options data service.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOptions('AAPL')
  }, [])

  const handleSymbolSubmit = (e) => {
    e.preventDefault()
    const clean = inputSymbol.trim().toUpperCase()
    if (!clean) return
    setSymbol(clean)
    fetchOptions(clean, dateMode === 'SINGLE' ? selectedDate : startDate)
  }

  const handlePresetClick = (ticker) => {
    setInputSymbol(ticker)
    setSymbol(ticker)
    fetchOptions(ticker, dateMode === 'SINGLE' ? selectedDate : startDate)
  }

  const handleSingleDateChange = (e) => {
    const newDate = e.target.value
    setSelectedDate(newDate)
    fetchOptions(symbol, newDate)
  }

  // Filter logic for contracts table & CSV export
  const filteredContracts = useMemo(() => {
    if (!data) return []
    const price = data.underlyingPrice || 0
    let pool = []

    if (typeFilter === 'CALLS' || viewTab === 'CALLS') {
      pool = data.calls || []
    } else if (typeFilter === 'PUTS' || viewTab === 'PUTS') {
      pool = data.puts || []
    } else {
      pool = [...(data.calls || []), ...(data.puts || [])]
    }

    return pool.filter((c) => {
      // Date Range Filter
      if (dateMode === 'RANGE' && (startDate || endDate)) {
        const contractDate = c.expiration
        if (startDate && contractDate < startDate) return false
        if (endDate && contractDate > endDate) return false
      }

      // Moneyness Filter
      if (moneynessFilter === 'ITM' && !c.inTheMoney) return false
      if (moneynessFilter === 'OTM' && c.inTheMoney) return false
      if (moneynessFilter === 'NEAR') {
        const pctDiff = Math.abs(c.strike - price) / price
        if (pctDiff > 0.08) return false
      }

      // Strike / Contract Symbol Search
      if (strikeSearch.trim()) {
        const q = strikeSearch.trim().toLowerCase()
        const strikeStr = String(c.strike)
        const contractStr = (c.contractSymbol || '').toLowerCase()
        if (!strikeStr.includes(q) && !contractStr.includes(q)) {
          return false
        }
      }

      return true
    }).sort((a, b) => a.strike - b.strike || a.optionType.localeCompare(b.optionType))
  }, [data, typeFilter, moneynessFilter, strikeSearch, viewTab, dateMode, startDate, endDate])

  const handleDownloadCsv = (exportType = 'ALL') => {
    if (!data) return
    let exportList = filteredContracts
    if (exportType === 'CALLS') exportList = filteredContracts.filter(c => c.optionType === 'CALL')
    if (exportType === 'PUTS') exportList = filteredContracts.filter(c => c.optionType === 'PUT')
    downloadOptionsCsv(data, exportList, exportType)
  }

  const handleCopyCsv = () => {
    if (!data) return
    const csvString = generateOptionsCsv(data, filteredContracts, typeFilter)
    navigator.clipboard.writeText(csvString).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const seoSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      webAppSchema({
        name: 'Options Data Extractor & CSV Downloader',
        url: absoluteUrl('/options-extractor'),
        description: 'Extract stock options chain data and Option Greeks for any symbol into CSV for Microsoft Excel and Google Sheets.',
      }),
      faqSchema([
        {
          question: 'How do I download stock options data and Greeks into Excel?',
          answer: 'Enter a ticker symbol like AAPL or SPY, select an expiration date or date range using the calendar control, and click Download CSV.',
        },
        {
          question: 'Are Option Greeks included in the CSV extraction?',
          answer: 'Yes, full Option Greeks (Delta, Gamma, Theta, Vega, Rho) are automatically calculated and included in every CSV download.',
        },
      ]),
    ],
  }

  return (
    <div className="app-wrapper options-page-container">
      <Seo
        title="Stock Options Data Extractor: Download CSV with Greeks for Excel & Google Sheets"
        description="Free stock options data extractor. Download Calls, Puts, strike prices, volume, open interest, IV, Delta, Gamma, Theta, Vega, and Rho into CSV for Excel & Google Sheets."
        canonical={absoluteUrl('/options-extractor')}
        schema={seoSchema}
      />

      {/* Hero Header */}
      <section className="landing-hero options-hero">
        <span className="hero-eyebrow">
          <FileSpreadsheet size={14} /> Free Options Data Extractor · Resizable Columns &amp; CSV Export
        </span>
        <h1 className="hero-headline">
          Stock Options <em>Data Extractor</em> & CSV Downloader
        </h1>
        <p className="hero-sub">
          Extract complete options chains for any US stock symbol into clean CSV files formatted for Microsoft Excel & Google Sheets. Features resizable data grid, calendar date range pickers, and full Option Greeks ($\Delta$, $\Gamma$, $\Theta$, $\nu$, $\rho$).
        </p>
      </section>

      {/* Input Variable Control Panel */}
      <section className="options-control-section glass-panel">
        <div className="section-step-header">
          <span className="step-number">1</span>
          <h2>Set Input Variables &amp; Parameters</h2>
          <Link to="/field-guide" className="field-guide-link">
            <BookOpen size={14} /> View Field Dictionary
          </Link>
        </div>

        {/* Input Variable: Ticker Symbol */}
        <form onSubmit={handleSymbolSubmit} className="options-search-form">
          <div className="variable-field-row">
            <div className="variable-label-group">
              <label htmlFor="ticker-input">Stock Symbol / Ticker:</label>
              <VariableTooltip text="Enter any US equity or ETF ticker symbol (e.g. AAPL for Apple Inc., SPY for S&P 500 ETF, TSLA for Tesla Inc.)." />
            </div>
            <div className="search-input-group">
              <Search className="search-icon" size={18} />
              <input
                id="ticker-input"
                type="text"
                value={inputSymbol}
                onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
                placeholder="Enter ticker (e.g. AAPL, SPY, TSLA, NVDA)"
                className="symbol-input"
                maxLength={10}
              />
              <button type="submit" className="cta-btn search-submit-btn" disabled={loading}>
                {loading ? <RefreshCw className="spin-icon" size={16} /> : 'Extract Data'}
              </button>
            </div>
          </div>
        </form>

        {/* Popular Presets */}
        <div className="preset-row">
          <span className="preset-label">Quick Symbol Presets:</span>
          <div className="preset-badges">
            {POPULAR_TICKERS.map((t) => (
              <button
                key={t}
                onClick={() => handlePresetClick(t)}
                className={`preset-btn ${symbol === t ? 'active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection Box */}
        <div className="date-selection-box">
          <div className="date-mode-toggle">
            <div className="variable-label-group">
              <span className="control-label"><Calendar size={15} /> Expiration Selection Mode:</span>
              <VariableTooltip text="Select a single Friday expiration date OR use the calendar pickers to extract an entire date range of options." />
            </div>
            <div className="pill-toggle">
              <button
                onClick={() => setDateMode('SINGLE')}
                className={`pill-btn ${dateMode === 'SINGLE' ? 'active' : ''}`}
              >
                Specific Expiration Date
              </button>
              <button
                onClick={() => setDateMode('RANGE')}
                className={`pill-btn ${dateMode === 'RANGE' ? 'active' : ''}`}
              >
                Date Range (Calendar)
              </button>
            </div>
          </div>

          {dateMode === 'SINGLE' ? (
            <div className="date-picker-row">
              <div className="picker-item">
                <div className="variable-label-group">
                  <label htmlFor="single-date-select">Select Available Friday Expiration:</label>
                  <VariableTooltip text="Options contracts typically expire on Friday afternoons. Select any upcoming expiration date." />
                </div>
                {data && data.expirationDates && data.expirationDates.length > 0 ? (
                  <select
                    id="single-date-select"
                    value={selectedDate}
                    onChange={handleSingleDateChange}
                    className="styled-date-input"
                    disabled={loading}
                  >
                    {data.expirationDates.map((exp) => (
                      <option key={exp.dateStr} value={exp.dateStr}>
                        {exp.formatted} ({exp.dateStr})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleSingleDateChange}
                    className="styled-date-input"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="date-picker-row date-range-inputs">
              <div className="picker-item">
                <div className="variable-label-group">
                  <label htmlFor="start-date-input">From Date (Calendar):</label>
                  <VariableTooltip text="Start date for filtering expiration dates in the calendar control." />
                </div>
                <input
                  id="start-date-input"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="styled-date-input"
                />
              </div>

              <div className="picker-item">
                <div className="variable-label-group">
                  <label htmlFor="end-date-input">To Date (Calendar):</label>
                  <VariableTooltip text="End date for filtering expiration dates in the calendar control." />
                </div>
                <input
                  id="end-date-input"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="styled-date-input"
                />
              </div>

              <div className="range-apply-box">
                <button
                  onClick={() => fetchOptions(symbol, startDate)}
                  className="secondary-btn apply-range-btn"
                  disabled={loading}
                >
                  <RefreshCw size={14} className={loading ? 'spin-icon' : ''} /> Filter Range
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <Info size={18} />
          <span>{error}</span>
          <button onClick={() => fetchOptions(symbol)} className="error-retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton State */}
      {loading && !data && (
        <div className="loading-container glass-panel">
          <RefreshCw className="spin-icon large-spinner" size={36} />
          <p>Extracting options chain data &amp; computing Greeks for <strong>{symbol}</strong>...</p>
        </div>
      )}

      {/* Main Options Data View */}
      {data && (
        <>
          {/* Key Metrics Summary Cards */}
          <section className="options-kpi-grid">
            <div className="kpi-card glass-panel">
              <span className="kpi-label">Stock Price ({data.symbol})</span>
              <div className="kpi-value-row">
                <span className="kpi-main-val">${data.underlyingPrice.toFixed(2)}</span>
                <span className={`kpi-change ${data.change >= 0 ? 'pos' : 'neg'}`}>
                  {data.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%)
                </span>
              </div>
              <span className="kpi-sub">{data.name}</span>
            </div>

            <div className="kpi-card glass-panel">
              <span className="kpi-label">Active Date &amp; DTE</span>
              <div className="kpi-value-row">
                <span className="kpi-main-val">
                  {dateMode === 'RANGE' ? `${startDate || 'Start'} to ${endDate || 'End'}` : (data.selectedExpiration?.formatted || data.selectedExpiration?.dateStr)}
                </span>
              </div>
              <span className="kpi-sub badge-sub">
                {filteredContracts.length} Option Contracts Found
              </span>
            </div>

            <div className="kpi-card glass-panel">
              <span className="kpi-label">Put / Call Volume Ratio</span>
              <div className="kpi-value-row">
                <span className="kpi-main-val">{data.summary?.pcVolumeRatio ?? '—'}</span>
                <span className="kpi-icon-badge"><BarChart2 size={16} /></span>
              </div>
              <span className="kpi-sub">
                Calls: {(data.summary?.totalCallVolume || 0).toLocaleString()} | Puts: {(data.summary?.totalPutVolume || 0).toLocaleString()}
              </span>
            </div>

            <div className="kpi-card glass-panel">
              <span className="kpi-label">Max Pain Estimate</span>
              <div className="kpi-value-row">
                <span className="kpi-main-val">${typeof data.summary?.maxPain === 'number' ? data.summary.maxPain.toFixed(2) : '—'}</span>
                <span className="kpi-icon-badge"><TrendingUp size={16} /></span>
              </div>
              <span className="kpi-sub">Min loss strike price</span>
            </div>
          </section>

          {/* Primary CSV Download Banner */}
          <section className="csv-download-banner glass-panel">
            <div className="csv-banner-content">
              <div className="csv-banner-text">
                <h2>Download Formatted CSV File</h2>
                <p>
                  Export <strong>{filteredContracts.length} option contracts</strong> with full Greeks ($\Delta$, $\Gamma$, $\Theta$, $\nu$, $\rho$) into Microsoft Excel or Google Sheets.
                </p>
              </div>

              <div className="csv-btn-group">
                <button
                  onClick={() => handleDownloadCsv('ALL')}
                  className="cta-btn download-primary-btn"
                >
                  <Download size={18} /> Download Full CSV
                </button>

                <button
                  onClick={() => handleDownloadCsv('CALLS')}
                  className="secondary-btn download-sec-btn"
                >
                  <FileSpreadsheet size={16} /> Calls Only
                </button>

                <button
                  onClick={() => handleDownloadCsv('PUTS')}
                  className="secondary-btn download-sec-btn"
                >
                  <FileSpreadsheet size={16} /> Puts Only
                </button>

                <button
                  onClick={handleCopyCsv}
                  className="secondary-btn copy-btn"
                  title="Copy CSV to clipboard"
                >
                  {copied ? <Check size={16} className="green-icon" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </section>

          {/* Table Filters Toolbar */}
          <section className="table-controls-section glass-panel">
            <div className="filter-toolbar">
              <div className="filter-group">
                <div className="variable-label-group">
                  <span className="filter-label"><Sliders size={14} /> Option Type:</span>
                  <VariableTooltip text="Filter contracts by CALL (right to buy) or PUT (right to sell)." />
                </div>
                <div className="pill-toggle">
                  <button
                    onClick={() => { setTypeFilter('ALL'); setViewTab('COMBINED'); }}
                    className={`pill-btn ${typeFilter === 'ALL' ? 'active' : ''}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => { setTypeFilter('CALLS'); setViewTab('CALLS'); }}
                    className={`pill-btn ${typeFilter === 'CALLS' ? 'active' : ''}`}
                  >
                    Calls
                  </button>
                  <button
                    onClick={() => { setTypeFilter('PUTS'); setViewTab('PUTS'); }}
                    className={`pill-btn ${typeFilter === 'PUTS' ? 'active' : ''}`}
                  >
                    Puts
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <div className="variable-label-group">
                  <span className="filter-label">Moneyness:</span>
                  <VariableTooltip text="Filter In-The-Money (ITM) options with intrinsic value vs Out-of-The-Money (OTM) options." />
                </div>
                <div className="pill-toggle">
                  <button
                    onClick={() => setMoneynessFilter('ALL')}
                    className={`pill-btn ${moneynessFilter === 'ALL' ? 'active' : ''}`}
                  >
                    All Strikes
                  </button>
                  <button
                    onClick={() => setMoneynessFilter('ITM')}
                    className={`pill-btn ${moneynessFilter === 'ITM' ? 'active' : ''}`}
                  >
                    In Money (ITM)
                  </button>
                  <button
                    onClick={() => setMoneynessFilter('OTM')}
                    className={`pill-btn ${moneynessFilter === 'OTM' ? 'active' : ''}`}
                  >
                    Out Money (OTM)
                  </button>
                  <button
                    onClick={() => setMoneynessFilter('NEAR')}
                    className={`pill-btn ${moneynessFilter === 'NEAR' ? 'active' : ''}`}
                  >
                    Near Money (±8%)
                  </button>
                </div>
              </div>

              <div className="filter-group search-strike-group">
                <div className="variable-label-group">
                  <VariableTooltip text="Type a strike price or OCC contract symbol to filter table rows instantly." />
                  <input
                    type="text"
                    placeholder="Search strike or symbol..."
                    value={strikeSearch}
                    onChange={(e) => setStrikeSearch(e.target.value)}
                    className="strike-search-input"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Options Chain Output Grid Box with Resizable Columns & Container Scroll */}
          <section className={`options-table-section glass-panel ${isExpandedBox ? 'expanded-box' : ''}`}>
            <div className="grid-box-header">
              <div className="grid-box-title">
                <FileSpreadsheet size={16} />
                <h3>Scrollable Options Data Grid ({filteredContracts.length} contracts)</h3>
                <span className="resize-hint-badge">Drag column headers to resize</span>
              </div>
              <div className="grid-box-actions">
                <button
                  onClick={resetColumnWidths}
                  className="grid-tool-btn"
                  title="Reset column widths to default"
                >
                  <RotateCcw size={13} /> Reset Columns
                </button>
                <button
                  onClick={() => setIsExpandedBox(!isExpandedBox)}
                  className="grid-tool-btn"
                  title="Toggle container height"
                >
                  <Maximize2 size={13} /> {isExpandedBox ? 'Compact View' : 'Expanded View'}
                </button>
              </div>
            </div>

            <div className="table-responsive-container grid-scroll-box">
              <table className="options-data-table resizable-table">
                <thead>
                  <tr>
                    <th style={{ width: colWidths.contractSymbol }} className="resizable-th">
                      <span>Contract Symbol</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'contractSymbol')} />
                    </th>
                    <th style={{ width: colWidths.optionType }} className="resizable-th">
                      <span>Type</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'optionType')} />
                    </th>
                    <th style={{ width: colWidths.expiration }} className="resizable-th">
                      <span>Exp Date</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'expiration')} />
                    </th>
                    <th style={{ width: colWidths.strike }} className="resizable-th">
                      <span>Strike</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'strike')} />
                    </th>
                    <th style={{ width: colWidths.lastPrice }} className="resizable-th">
                      <span>Last</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'lastPrice')} />
                    </th>
                    <th style={{ width: colWidths.bid }} className="resizable-th">
                      <span>Bid</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'bid')} />
                    </th>
                    <th style={{ width: colWidths.ask }} className="resizable-th">
                      <span>Ask</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'ask')} />
                    </th>
                    <th style={{ width: colWidths.change }} className="resizable-th">
                      <span>Change</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'change')} />
                    </th>
                    <th style={{ width: colWidths.volume }} className="resizable-th">
                      <span>Volume</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'volume')} />
                    </th>
                    <th style={{ width: colWidths.openInterest }} className="resizable-th">
                      <span>Open Int</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'openInterest')} />
                    </th>
                    <th style={{ width: colWidths.iv }} className="resizable-th">
                      <span>IV</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'iv')} />
                    </th>
                    <th style={{ width: colWidths.delta }} className="resizable-th">
                      <span>Delta (Δ)</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'delta')} />
                    </th>
                    <th style={{ width: colWidths.gamma }} className="resizable-th">
                      <span>Gamma (Γ)</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'gamma')} />
                    </th>
                    <th style={{ width: colWidths.theta }} className="resizable-th">
                      <span>Theta (Θ)</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'theta')} />
                    </th>
                    <th style={{ width: colWidths.vega }} className="resizable-th">
                      <span>Vega (ν)</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'vega')} />
                    </th>
                    <th style={{ width: colWidths.itm }} className="resizable-th">
                      <span>ITM</span>
                      <div className="col-resizer" onMouseDown={(e) => handleMouseDownResizer(e, 'itm')} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan={16} className="empty-table-cell">
                        No option contracts match the selected date or strike filters. Try expanding your date range above.
                      </td>
                    </tr>
                  ) : (
                    filteredContracts.map((c) => {
                      const isCall = c.optionType === 'CALL'
                      return (
                        <tr
                          key={c.contractSymbol || `${c.optionType}-${c.strike}-${c.expiration}`}
                          className={c.inTheMoney ? 'itm-row' : ''}
                        >
                          <td className="contract-code-cell">{c.contractSymbol}</td>
                          <td>
                            <span className={`type-badge ${isCall ? 'call-badge' : 'put-badge'}`}>
                              {c.optionType}
                            </span>
                          </td>
                          <td className="exp-date-cell">{c.expiration}</td>
                          <td className="strike-cell">
                            <strong>${c.strike.toFixed(2)}</strong>
                          </td>
                          <td className="price-cell">${c.lastPrice.toFixed(2)}</td>
                          <td>${c.bid.toFixed(2)}</td>
                          <td>${c.ask.toFixed(2)}</td>
                          <td className={c.change >= 0 ? 'pos-num' : 'neg-num'}>
                            {c.change >= 0 ? '+' : ''}{c.change.toFixed(2)}
                          </td>
                          <td className="num-cell">{(c.volume || 0).toLocaleString()}</td>
                          <td className="num-cell">{(c.openInterest || 0).toLocaleString()}</td>
                          <td className="iv-cell">{(c.impliedVolatility * 100).toFixed(1)}%</td>
                          <td className="greek-cell">{typeof c.delta === 'number' ? c.delta.toFixed(4) : '—'}</td>
                          <td className="greek-cell">{typeof c.gamma === 'number' ? c.gamma.toFixed(4) : '—'}</td>
                          <td className="greek-cell">{typeof c.theta === 'number' ? c.theta.toFixed(4) : '—'}</td>
                          <td className="greek-cell">{typeof c.vega === 'number' ? c.vega.toFixed(4) : '—'}</td>
                          <td>
                            <span className={`itm-status-badge ${c.inTheMoney ? 'is-itm' : 'is-otm'}`}>
                              {c.inTheMoney ? 'ITM' : 'OTM'}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Field Glossary & Header Definitions Reference Section */}
      <section className="glossary-section glass-panel">
        <div
          className="glossary-toggle-header"
          onClick={() => setShowGlossary(!showGlossary)}
        >
          <div className="glossary-title">
            <BookOpen size={20} className="glossary-icon" />
            <h2>Field Definitions &amp; Options Glossary Reference</h2>
          </div>
          <button className="glossary-collapse-btn">
            {showGlossary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {showGlossary && (
          <div className="glossary-content">
            <div className="glossary-top-bar">
              <p className="glossary-intro">
                Understand all data metrics and Option Greeks ($\Delta$, $\Gamma$, $\Theta$, $\nu$, $\rho$) exported in your CSV files:
              </p>
              <Link to="/field-guide" className="full-dictionary-link">
                <BookOpen size={14} /> Open Full Field Dictionary &amp; Examples Page &rarr;
              </Link>
            </div>

            <div className="glossary-grid">
              {HEADER_GLOSSARY.map((item) => (
                <div key={item.key} className="glossary-card">
                  <div className="glossary-card-header">
                    <strong>{item.label}</strong>
                    <span className="glossary-tag">{item.short}</span>
                  </div>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <AdSlot id="options-inline-mid" />

      {/* Educational & How-To Section */}
      <section className="options-guide-section glass-panel">
        <div className="guide-header">
          <HelpCircle size={20} className="guide-icon" />
          <h2>How to Import Options CSV Data into Excel &amp; Google Sheets</h2>
        </div>

        <div className="guide-grid">
          <div className="guide-card">
            <h3><FileSpreadsheet size={16} /> Importing into Microsoft Excel</h3>
            <ol className="guide-steps">
              <li>Click <strong>Download Full CSV</strong> above to save the <code>.csv</code> file.</li>
              <li>Open <strong>Microsoft Excel</strong> and click <strong>File &gt; Open</strong> to select the downloaded file.</li>
              <li>Alternatively, go to the <strong>Data</strong> tab, select <strong>From Text/CSV</strong>, choose your file, and click <strong>Load</strong>.</li>
              <li>Excel automatically formats columns for Strike, Bid, Ask, Volume, Open Interest, IV, Delta, Gamma, Theta, Vega, and Rho.</li>
            </ol>
          </div>

          <div className="guide-card">
            <h3><FileSpreadsheet size={16} /> Importing into Google Sheets</h3>
            <ol className="guide-steps">
              <li>Open a blank spreadsheet on <strong>Google Sheets</strong> (sheets.new).</li>
              <li>Click <strong>File &gt; Import</strong>, then navigate to the <strong>Upload</strong> tab.</li>
              <li>Drag and drop the downloaded options CSV file.</li>
              <li>Select <strong>Import location: Insert new sheet(s)</strong> and keep <strong>Separator type: Detect automatically</strong>, then click <strong>Import data</strong>.</li>
            </ol>
          </div>
        </div>
      </section>

      <AdSlot id="options-inline-bottom" />
    </div>
  )
}
