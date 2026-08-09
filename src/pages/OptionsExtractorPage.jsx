import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle, ArrowDownRight, ArrowUpRight, BarChart2, BookOpen,
  Calendar, Check, ChevronDown, ChevronUp, Copy, Download,
  FileSpreadsheet, HelpCircle, Info, Maximize2, RefreshCw,
  RotateCcw, Search, Sliders, TrendingUp, Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AdSlot from '../components/AdSlot'
import Seo from '../components/Seo'
import { downloadOptionsCsv, generateOptionsCsv } from '../lib/optionsCsvExporter'
import { fetchOptionsData } from '../lib/optionsEngine'
import { absoluteUrl, faqSchema, webAppSchema } from '../lib/seo'
import '../options.css'

const POPULAR_TICKERS = ['AAPL', 'SPY', 'TSLA', 'NVDA', 'QQQ', 'MSFT', 'AMZN', 'AMD', 'META', 'GOOGL']

const DEFAULT_COL_WIDTHS = {
  contractSymbol: 185, optionType: 76, expiration: 100,
  strike: 90, lastPrice: 82, bid: 78, ask: 78, change: 82,
  volume: 88, openInterest: 92, iv: 80, delta: 84,
  gamma: 84, theta: 84, vega: 82, itm: 66,
}

const GLOSSARY_ITEMS = [
  { key: 'strike', title: 'Strike Price', tag: 'Contract Basics', desc: 'The agreed price at which you can buy (Call) or sell (Put) 100 shares. Profit depends on the stock moving past this price before expiration.' },
  { key: 'lastPrice', title: 'Last Price (Premium)', tag: 'Pricing', desc: 'Most recent price per share paid. Multiply by 100 to get total contract cost — e.g. $4.50 last price = $450 per contract.' },
  { key: 'bidAsk', title: 'Bid / Ask Spread', tag: 'Liquidity', desc: 'Bid = what buyers offer; Ask = what sellers want. A tight spread (e.g. $0.02) means high liquidity. A wide spread means it is harder to exit the position quickly.' },
  { key: 'volume', title: 'Volume', tag: 'Activity', desc: 'Number of contracts traded today. High volume signals strong interest and makes it easier to enter or exit a position without moving the price.' },
  { key: 'openInterest', title: 'Open Interest (OI)', tag: 'Activity', desc: 'Total number of open contracts not yet closed or exercised. Rising OI alongside rising volume indicates new money flowing in.' },
  { key: 'iv', title: 'Implied Volatility (IV)', tag: 'Volatility', desc: "Market's expectation of how much the stock will move in the future (annualized %). Higher IV = more expensive option premiums." },
  { key: 'delta', title: 'Delta (Δ)', tag: 'Greeks', desc: 'How much the option price moves per $1 move in the stock. Calls range 0 to 1; Puts range -1 to 0. Also roughly equals the probability of expiring In-The-Money.' },
  { key: 'gamma', title: 'Gamma (Γ)', tag: 'Greeks', desc: 'The rate at which Delta changes for every $1 move in the stock. High Gamma means your Delta (price sensitivity) changes rapidly as the stock moves.' },
  { key: 'theta', title: 'Theta (Θ)', tag: 'Greeks', desc: 'Daily time decay — the dollar amount the option loses each calendar day, all else equal. Always negative for option buyers.' },
  { key: 'vega', title: 'Vega (ν)', tag: 'Greeks', desc: 'Change in option price for every 1% change in Implied Volatility. Long options gain value when volatility rises.' },
  { key: 'itm', title: 'ITM / OTM Status', tag: 'Moneyness', desc: 'In-The-Money (ITM) = the option has intrinsic value (Call: stock above strike; Put: stock below strike). Out-of-The-Money (OTM) = time value only.' },
  { key: 'maxPain', title: 'Max Pain', tag: 'Analysis', desc: 'The strike price where the most option contracts expire worthless, causing maximum loss for option buyers. Acts as a price magnet near expiration.' },
]

const COLS = [
  { key: 'contractSymbol', label: 'Contract Symbol' },
  { key: 'optionType',     label: 'Type' },
  { key: 'expiration',     label: 'Exp Date' },
  { key: 'strike',         label: 'Strike' },
  { key: 'lastPrice',      label: 'Last' },
  { key: 'bid',            label: 'Bid' },
  { key: 'ask',            label: 'Ask' },
  { key: 'change',         label: 'Change' },
  { key: 'volume',         label: 'Volume' },
  { key: 'openInterest',   label: 'Open Int' },
  { key: 'iv',             label: 'IV %' },
  { key: 'delta',          label: 'Delta Δ' },
  { key: 'gamma',          label: 'Gamma Γ' },
  { key: 'theta',          label: 'Theta Θ' },
  { key: 'vega',           label: 'Vega ν' },
  { key: 'itm',            label: 'ITM' },
]

function HelpTooltip({ text }) {
  const [show, setShow] = useState(false)
  return (
    <span
      className="op-help-wrap"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(v => !v)}
      role="button"
      tabIndex={0}
      aria-label="More info"
    >
      <HelpCircle size={13} className="op-help-icon" />
      {show && <span className="op-tooltip">{text}</span>}
    </span>
  )
}

export default function OptionsExtractorPage() {
  const [symbol, setSymbol] = useState('AAPL')
  const [inputSymbol, setInputSymbol] = useState('AAPL')
  const [dateMode, setDateMode] = useState('SINGLE')
  const [selectedDate, setSelectedDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showGlossary, setShowGlossary] = useState(true)
  const [colWidths, setColWidths] = useState(DEFAULT_COL_WIDTHS)
  const [isExpanded, setIsExpanded] = useState(false)
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [moneynessFilter, setMoneynessFilter] = useState('ALL')
  const [strikeSearch, setStrikeSearch] = useState('')

  const handleColResize = (e, colKey) => {
    e.preventDefault()
    const startX = e.clientX
    const startW = colWidths[colKey] || 90
    const move = ev => setColWidths(prev => ({ ...prev, [colKey]: Math.max(50, startW + (ev.clientX - startX)) }))
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  const fetchOptions = async (sym, expDate = '') => {
    setLoading(true); setError(null)
    try {
      const json = await fetchOptionsData(sym, expDate)
      setData(json)
      if (json.selectedExpiration?.dateStr && !selectedDate) {
        setSelectedDate(json.selectedExpiration.dateStr)
        setStartDate(json.selectedExpiration.dateStr)
      }
      if (json.expirationDates?.length > 0 && !endDate) {
        setEndDate(json.expirationDates[Math.min(3, json.expirationDates.length - 1)].dateStr)
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to options data service.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOptions('AAPL') }, [])

  const handleSubmit = e => {
    e.preventDefault()
    const clean = inputSymbol.trim().toUpperCase()
    if (!clean) return
    setSymbol(clean)
    fetchOptions(clean, dateMode === 'SINGLE' ? selectedDate : startDate)
  }

  const handlePreset = ticker => {
    setInputSymbol(ticker); setSymbol(ticker)
    fetchOptions(ticker, dateMode === 'SINGLE' ? selectedDate : startDate)
  }

  const handleSingleDate = e => { setSelectedDate(e.target.value); fetchOptions(symbol, e.target.value) }

  const filteredContracts = useMemo(() => {
    if (!data) return []
    const price = data.underlyingPrice || 0
    let pool = typeFilter === 'CALLS' ? (data.calls || [])
             : typeFilter === 'PUTS'  ? (data.puts || [])
             : [...(data.calls || []), ...(data.puts || [])]

    return pool.filter(c => {
      if (dateMode === 'RANGE' && (startDate || endDate)) {
        if (startDate && c.expiration < startDate) return false
        if (endDate && c.expiration > endDate) return false
      }
      if (moneynessFilter === 'ITM' && !c.inTheMoney) return false
      if (moneynessFilter === 'OTM' && c.inTheMoney) return false
      if (moneynessFilter === 'NEAR' && Math.abs(c.strike - price) / price > 0.08) return false
      if (strikeSearch.trim()) {
        const q = strikeSearch.trim().toLowerCase()
        if (!String(c.strike).includes(q) && !(c.contractSymbol || '').toLowerCase().includes(q)) return false
      }
      return true
    }).sort((a, b) => a.strike - b.strike || a.optionType.localeCompare(b.optionType))
  }, [data, typeFilter, moneynessFilter, strikeSearch, dateMode, startDate, endDate])

  const handleDownload = (type = 'ALL') => {
    if (!data) return
    let list = type === 'CALLS' ? filteredContracts.filter(c => c.optionType === 'CALL')
             : type === 'PUTS'  ? filteredContracts.filter(c => c.optionType === 'PUT')
             : filteredContracts
    downloadOptionsCsv(data, list, type)
  }

  const handleCopy = () => {
    if (!data) return
    navigator.clipboard.writeText(generateOptionsCsv(data, filteredContracts, typeFilter)).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2500)
    })
  }

  const seoSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      webAppSchema({ name: 'Options Data Extractor & CSV Downloader', url: absoluteUrl('/options-extractor'), description: 'Extract stock options chain data and Option Greeks into CSV for Excel and Google Sheets.' }),
      faqSchema([
        { question: 'How do I download stock options data into Excel?', answer: 'Enter a ticker symbol, choose an expiration date, then click Download CSV.' },
        { question: 'Are Greeks included in the CSV?', answer: 'Yes — Delta, Gamma, Theta, Vega, and Rho are automatically calculated and included.' },
      ]),
    ],
  }

  return (
    <div>
      <Seo
        title="Stock Options Data Extractor: Download CSV with Greeks for Excel & Google Sheets"
        description="Free stock options data extractor. Download Calls, Puts, strike prices, volume, OI, IV, Delta, Gamma, Theta, Vega, Rho into CSV for Excel & Google Sheets."
        canonical={absoluteUrl('/options-extractor')}
        schema={seoSchema}
      />

      {/* HERO */}
      <section className="op-hero">
        <div className="op-eyebrow"><Zap size={12} /> Free Options Chain Extractor · Full Greeks · CSV Export</div>
        <h1 className="op-hero-title">Stock Options <em>Data Extractor</em></h1>
        <p className="op-hero-sub">
          Pull complete options chains for any US stock or ETF into a clean CSV file ready for Excel or Google Sheets —
          including Delta, Gamma, Theta, Vega &amp; Rho.
        </p>
      </section>

      {/* INPUT PANEL */}
      <section className="op-input-panel op-panel">
        <div className="op-section-label">
          <span className="op-section-badge">1</span>
          Enter Stock Symbol
        </div>
        <form onSubmit={handleSubmit}>
          <div className="op-ticker-row">
            <div className="op-ticker-input-wrap">
              <Search size={18} />
              <input
                id="ticker-input"
                type="text"
                className="op-ticker-input"
                value={inputSymbol}
                onChange={e => setInputSymbol(e.target.value.toUpperCase())}
                placeholder="e.g. AAPL, SPY, TSLA, NVDA"
                maxLength={10}
                aria-label="Stock ticker symbol"
              />
            </div>
            <button type="submit" className="op-extract-btn" disabled={loading}>
              {loading
                ? <><RefreshCw size={16} className="spin" /> Extracting&hellip;</>
                : <><Download size={16} /> Extract Options</>}
            </button>
          </div>
        </form>

        <div className="op-presets-row">
          <span className="op-presets-label">Quick picks:</span>
          {POPULAR_TICKERS.map(t => (
            <button key={t} className={`op-preset-chip${symbol === t ? ' active' : ''}`}
              onClick={() => handlePreset(t)}>{t}</button>
          ))}
        </div>

        <div className="op-divider" />

        <div className="op-section-label">
          <span className="op-section-badge">2</span>
          <Calendar size={13} />
          Select Expiration Date
          <HelpTooltip text="Options expire on Fridays. Choose one specific date or a date range to see multiple expirations at once." />
        </div>

        <div className="op-date-box">
          <div className="op-date-mode-tabs">
            <button className={`op-date-tab${dateMode === 'SINGLE' ? ' active' : ''}`}
              onClick={() => setDateMode('SINGLE')}>One Date</button>
            <button className={`op-date-tab${dateMode === 'RANGE' ? ' active' : ''}`}
              onClick={() => setDateMode('RANGE')}>Date Range</button>
          </div>

          <div className="op-date-fields">
            {dateMode === 'SINGLE' ? (
              <div className="op-date-field">
                <label className="op-field-label" htmlFor="single-date">
                  Expiration Date
                  <HelpTooltip text="Select any available Friday expiration date from the dropdown." />
                </label>
                {data?.expirationDates?.length > 0 ? (
                  <select id="single-date" className="op-date-select" value={selectedDate}
                    onChange={handleSingleDate} disabled={loading}>
                    {data.expirationDates.map(exp => (
                      <option key={exp.dateStr} value={exp.dateStr}>
                        {exp.formatted} ({exp.dateStr})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input type="date" id="single-date" className="op-date-input"
                    value={selectedDate} onChange={handleSingleDate} />
                )}
              </div>
            ) : (
              <>
                <div className="op-date-field">
                  <label className="op-field-label" htmlFor="start-date">
                    From Date
                    <HelpTooltip text="Start of your expiration date range. Contracts expiring from this date forward will be included." />
                  </label>
                  <input type="date" id="start-date" className="op-date-input"
                    value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="op-date-field">
                  <label className="op-field-label" htmlFor="end-date">
                    To Date
                    <HelpTooltip text="End of your expiration date range." />
                  </label>
                  <input type="date" id="end-date" className="op-date-input"
                    value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <button className="op-apply-btn" onClick={() => fetchOptions(symbol, startDate)} disabled={loading}>
                  <RefreshCw size={14} className={loading ? 'spin' : ''} /> Apply Range
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ERRORS */}
      {error && (
        <div className="op-error-box">
          <AlertCircle size={16} color="#ef4444" />
          <span className="op-error-text">{error}</span>
          <button className="op-error-retry" onClick={() => fetchOptions(symbol)}>Retry</button>
        </div>
      )}

      {/* LOADING */}
      {loading && !data && (
        <div className="op-loading-box op-panel">
          <div className="op-spinner" />
          <p className="op-loading-text">Extracting options chain for <strong>{symbol}</strong>&hellip;</p>
        </div>
      )}

      {/* MOCK DATA BANNER */}
      {data?.isMock && (
        <div className="op-mock-banner">
          <Info size={15} />
          Showing sample data &mdash; live Yahoo Finance data loads in production (aicalcsolutions.com).
        </div>
      )}

      {/* DATA SECTION */}
      {data && (
        <>
          {/* KPI Cards */}
          <div className="op-kpi-strip">
            <div className="op-kpi-card op-panel">
              <div className="op-kpi-label">Stock Price &mdash; {data.symbol}</div>
              <div className="op-kpi-value">
                ${data.underlyingPrice?.toFixed(2)}
                <span className={`op-kpi-change ${data.change >= 0 ? 'pos' : 'neg'}`}>
                  {data.change >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {data.change >= 0 ? '+' : ''}{data.change?.toFixed(2)}
                </span>
              </div>
              <div className="op-kpi-meta">{data.name}</div>
            </div>

            <div className="op-kpi-card op-panel">
              <div className="op-kpi-label">Contracts Found</div>
              <div className="op-kpi-value">{filteredContracts.length.toLocaleString()}</div>
              <div className="op-kpi-meta">
                {dateMode === 'RANGE'
                  ? `${startDate || '—'} to ${endDate || '—'}`
                  : data.selectedExpiration?.formatted || data.selectedExpiration?.dateStr || '—'}
              </div>
            </div>

            <div className="op-kpi-card op-panel">
              <div className="op-kpi-label">Put / Call Volume Ratio</div>
              <div className="op-kpi-value">
                {data.summary?.pcVolumeRatio ?? '—'}
                <BarChart2 size={16} style={{ color: 'var(--op-muted)', marginLeft: 4 }} />
              </div>
              <div className="op-kpi-meta">
                Calls: {(data.summary?.totalCallVolume || 0).toLocaleString()} &nbsp;&middot;&nbsp; Puts: {(data.summary?.totalPutVolume || 0).toLocaleString()}
              </div>
            </div>

            <div className="op-kpi-card op-panel">
              <div className="op-kpi-label">Max Pain Estimate</div>
              <div className="op-kpi-value">
                {typeof data.summary?.maxPain === 'number' ? `$${data.summary.maxPain.toFixed(2)}` : '—'}
                <TrendingUp size={16} style={{ color: 'var(--op-muted)', marginLeft: 4 }} />
              </div>
              <div className="op-kpi-meta">Min-loss strike for option sellers</div>
            </div>
          </div>

          {/* CSV Download Banner */}
          <div className="op-csv-banner">
            <div className="op-csv-banner-left">
              <h3>Download Options Data as CSV</h3>
              <p>{filteredContracts.length} contracts &middot; Full Greeks (&Delta;, &Gamma;, &Theta;, &nu;, &rho;) &middot; Excel &amp; Google Sheets ready</p>
            </div>
            <div className="op-csv-btns">
              <button className="op-btn-primary" onClick={() => handleDownload('ALL')}>
                <Download size={15} /> Download All
              </button>
              <button className="op-btn-secondary" onClick={() => handleDownload('CALLS')}>
                <FileSpreadsheet size={14} /> Calls Only
              </button>
              <button className="op-btn-secondary" onClick={() => handleDownload('PUTS')}>
                <FileSpreadsheet size={14} /> Puts Only
              </button>
              <button className="op-btn-secondary" onClick={handleCopy} title="Copy CSV to clipboard">
                {copied
                  ? <Check size={14} style={{ color: 'var(--green)' }} />
                  : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="op-filter-bar op-panel">
            <div className="op-filter-group">
              <div className="op-filter-group-label">
                <Sliders size={12} /> Option Type
                <HelpTooltip text="CALL = right to BUY shares. PUT = right to SELL shares." />
              </div>
              <div className="op-filter-pills">
                {[['ALL','All Types'],['CALLS','Calls Only'],['PUTS','Puts Only']].map(([v,l]) => (
                  <button key={v}
                    className={`op-filter-pill${typeFilter === v ? ' active' : ''}`}
                    onClick={() => setTypeFilter(v)}>{l}</button>
                ))}
              </div>
            </div>

            <div className="op-filter-group">
              <div className="op-filter-group-label">
                Moneyness
                <HelpTooltip text="ITM = option has intrinsic value. OTM = time value only. Near = within 8% of current stock price." />
              </div>
              <div className="op-filter-pills">
                {[['ALL','All Strikes'],['ITM','In Money'],['OTM','Out of Money'],['NEAR','Near Money']].map(([v,l]) => (
                  <button key={v}
                    className={`op-filter-pill${moneynessFilter === v ? ' active' : ''}`}
                    onClick={() => setMoneynessFilter(v)}>{l}</button>
                ))}
              </div>
            </div>

            <div className="op-filter-group">
              <div className="op-filter-group-label">Search Strike / Symbol</div>
              <input
                type="text"
                className="op-strike-search"
                placeholder="e.g. 190 or AAPL260…"
                value={strikeSearch}
                onChange={e => setStrikeSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Options Data Grid */}
          <div className={`op-grid-wrap op-panel${isExpanded ? ' op-grid-expanded' : ''}`}>
            <div className="op-grid-header">
              <div className="op-grid-title">
                <FileSpreadsheet size={15} />
                Options Chain
                <span className="op-grid-count">{filteredContracts.length} rows</span>
                <span className="op-grid-hint">Drag column edges to resize</span>
              </div>
              <div className="op-grid-actions">
                <button className="op-grid-btn" onClick={() => setColWidths(DEFAULT_COL_WIDTHS)}>
                  <RotateCcw size={12} /> Reset Cols
                </button>
                <button className="op-grid-btn" onClick={() => setIsExpanded(v => !v)}>
                  <Maximize2 size={12} /> {isExpanded ? 'Compact' : 'Expand'}
                </button>
              </div>
            </div>

            <div className="op-grid-scroll">
              <table className="op-table">
                <thead>
                  <tr>
                    {COLS.map(col => (
                      <th key={col.key} style={{ width: colWidths[col.key] }}>
                        <div className="op-th-inner">{col.label}</div>
                        <div className="op-col-resize" onMouseDown={e => handleColResize(e, col.key)} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan={COLS.length}>
                        <div className="op-empty-state">
                          <Search size={28} strokeWidth={1.5} />
                          <p>No contracts match current filters. Try widening your date range or changing the moneyness filter.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredContracts.map(c => {
                      const isCall = c.optionType === 'CALL'
                      return (
                        <tr
                          key={c.contractSymbol || `${c.optionType}-${c.strike}-${c.expiration}`}
                          className={c.inTheMoney ? 'row-itm' : ''}
                        >
                          <td className="cell-contract">{c.contractSymbol}</td>
                          <td>
                            <span className={isCall ? 'cell-call-badge' : 'cell-put-badge'}>
                              {c.optionType}
                            </span>
                          </td>
                          <td>{c.expiration}</td>
                          <td className="cell-strike">${c.strike?.toFixed(2)}</td>
                          <td className="cell-price">${c.lastPrice?.toFixed(2)}</td>
                          <td>${c.bid?.toFixed(2)}</td>
                          <td>${c.ask?.toFixed(2)}</td>
                          <td className={c.change >= 0 ? 'cell-pos' : 'cell-neg'}>
                            {c.change >= 0 ? '+' : ''}{c.change?.toFixed(2)}
                          </td>
                          <td className="cell-vol">{(c.volume || 0).toLocaleString()}</td>
                          <td className="cell-vol">{(c.openInterest || 0).toLocaleString()}</td>
                          <td className="cell-iv">{((c.impliedVolatility || 0) * 100).toFixed(1)}%</td>
                          <td className="cell-greek">{typeof c.delta === 'number' ? c.delta.toFixed(4) : '—'}</td>
                          <td className="cell-greek">{typeof c.gamma === 'number' ? c.gamma.toFixed(4) : '—'}</td>
                          <td className="cell-greek">{typeof c.theta === 'number' ? c.theta.toFixed(4) : '—'}</td>
                          <td className="cell-greek">{typeof c.vega === 'number' ? c.vega.toFixed(4) : '—'}</td>
                          <td>
                            {c.inTheMoney
                              ? <span className="cell-itm-badge">ITM</span>
                              : <span className="cell-otm-badge">OTM</span>}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* GLOSSARY */}
      <div className="op-glossary-panel op-panel">
        <div className="op-glossary-header" onClick={() => setShowGlossary(v => !v)}>
          <div className="op-glossary-header-left">
            <div className="op-glossary-icon-wrap"><BookOpen size={16} /></div>
            <div className="op-glossary-header-text">
              <h2>Field Definitions &amp; Quick Glossary</h2>
              <p>Plain-English explanations of every data column &mdash; perfect for beginners</p>
            </div>
          </div>
          <button className="op-glossary-toggle">
            {showGlossary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {showGlossary && (
          <>
            <div className="op-glossary-divider" />
            <div className="op-glossary-top">
              <p className="op-glossary-intro">
                Understand all columns in the grid and CSV export &mdash; including all five Option Greeks.
              </p>
              <Link to="/field-guide" className="op-glossary-full-link">
                <BookOpen size={13} /> Full Field Guide with Examples &rarr;
              </Link>
            </div>
            <div className="op-glossary-grid">
              {GLOSSARY_ITEMS.map(item => (
                <div key={item.key} className="op-glossary-item">
                  <div className="op-glossary-item-top">
                    <span className="op-glossary-item-title">{item.title}</span>
                    <span className="op-glossary-item-tag">{item.tag}</span>
                  </div>
                  <p className="op-glossary-item-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="op-ad-slot"><AdSlot id="options-inline-mid" /></div>

      {/* HOW TO IMPORT */}
      <div className="op-howto-panel op-panel">
        <div className="op-howto-panel-header">
          <FileSpreadsheet size={18} />
          <h2>How to Import Options CSV into Excel &amp; Google Sheets</h2>
        </div>
        <div className="op-howto-grid">
          <div className="op-howto-card">
            <div className="op-howto-card-title">
              <FileSpreadsheet size={16} style={{ color: 'var(--teal)' }} /> Microsoft Excel
            </div>
            <div className="op-howto-steps">
              <div className="op-howto-step">
                <span className="op-step-num">1</span>
                <span className="op-step-text">Click <strong>Download All</strong> above to save the <code>.csv</code> file.</span>
              </div>
              <div className="op-howto-step">
                <span className="op-step-num">2</span>
                <span className="op-step-text">Open <strong>Microsoft Excel</strong> &rarr; <strong>File &rsaquo; Open</strong> &rarr; select the downloaded file.</span>
              </div>
              <div className="op-howto-step">
                <span className="op-step-num">3</span>
                <span className="op-step-text">Or use the <strong>Data</strong> tab &rarr; <strong>From Text/CSV</strong> &rarr; choose file &rarr; <strong>Load</strong>.</span>
              </div>
              <div className="op-howto-step">
                <span className="op-step-num">4</span>
                <span className="op-step-text">All columns (Strike, Greeks, IV, Volume, OI) are auto-formatted and ready for analysis.</span>
              </div>
            </div>
          </div>

          <div className="op-howto-card">
            <div className="op-howto-card-title">
              <FileSpreadsheet size={16} style={{ color: 'var(--blue)' }} /> Google Sheets
            </div>
            <div className="op-howto-steps">
              <div className="op-howto-step">
                <span className="op-step-num">1</span>
                <span className="op-step-text">Go to <strong>sheets.new</strong> to open a blank Google Sheet.</span>
              </div>
              <div className="op-howto-step">
                <span className="op-step-num">2</span>
                <span className="op-step-text">Click <strong>File &rsaquo; Import</strong> then the <strong>Upload</strong> tab.</span>
              </div>
              <div className="op-howto-step">
                <span className="op-step-num">3</span>
                <span className="op-step-text">Drag and drop the downloaded options <code>.csv</code> file into the dialog.</span>
              </div>
              <div className="op-howto-step">
                <span className="op-step-num">4</span>
                <span className="op-step-text">Choose <strong>Insert new sheet</strong>, keep <strong>Detect automatically</strong>, click <strong>Import data</strong>.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="op-ad-slot"><AdSlot id="options-inline-bottom" /></div>
    </div>
  )
}
