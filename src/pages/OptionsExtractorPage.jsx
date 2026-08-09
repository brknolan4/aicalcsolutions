import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  Calendar,
  Check,
  Copy,
  Download,
  FileSpreadsheet,
  HelpCircle,
  Info,
  RefreshCw,
  Search,
  Sliders,
  TrendingUp,
} from 'lucide-react'
import AdSlot from '../components/AdSlot'
import Seo from '../components/Seo'
import { downloadOptionsCsv, generateOptionsCsv } from '../lib/optionsCsvExporter'
import { fetchOptionsData } from '../lib/optionsEngine'
import { absoluteUrl, faqSchema, webAppSchema } from '../lib/seo'

const POPULAR_TICKERS = ['AAPL', 'SPY', 'TSLA', 'NVDA', 'QQQ', 'MSFT', 'AMZN', 'AMD', 'META', 'GOOGL']

export default function OptionsExtractorPage() {
  const [symbol, setSymbol] = useState('AAPL')
  const [inputSymbol, setInputSymbol] = useState('AAPL')
  const [selectedDate, setSelectedDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [copied, setCopied] = useState(false)

  // Filters
  const [typeFilter, setTypeFilter] = useState('ALL') // ALL, CALLS, PUTS
  const [moneynessFilter, setMoneynessFilter] = useState('ALL') // ALL, ITM, OTM, NEAR
  const [strikeSearch, setStrikeSearch] = useState('')
  const [viewTab, setViewTab] = useState('COMBINED') // COMBINED, CALLS, PUTS

  const fetchOptions = async (targetSymbol, expDate = '') => {
    setLoading(true)
    setError(null)
    try {
      const json = await fetchOptionsData(targetSymbol, expDate)
      setData(json)
      if (json.selectedExpiration?.dateStr) {
        setSelectedDate(json.selectedExpiration.dateStr)
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
    fetchOptions(clean)
  }

  const handlePresetClick = (ticker) => {
    setInputSymbol(ticker)
    setSymbol(ticker)
    fetchOptions(ticker)
  }

  const handleDateChange = (e) => {
    const newDate = e.target.value
    setSelectedDate(newDate)
    fetchOptions(symbol, newDate)
  }

  // Filter logic for contracts table & CSV
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
      // Moneyness filter
      if (moneynessFilter === 'ITM' && !c.inTheMoney) return false
      if (moneynessFilter === 'OTM' && c.inTheMoney) return false
      if (moneynessFilter === 'NEAR') {
        const pctDiff = Math.abs(c.strike - price) / price
        if (pctDiff > 0.08) return false
      }

      // Strike / Contract Search filter
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
  }, [data, typeFilter, moneynessFilter, strikeSearch, viewTab])

  const handleDownloadCsv = (exportType = 'ALL') => {
    if (!data) return
    let exportList = filteredContracts
    if (exportType === 'CALLS') exportList = data.calls || []
    if (exportType === 'PUTS') exportList = data.puts || []
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
          answer: 'Enter a ticker symbol like AAPL or SPY, select an expiration date, and click Download CSV. Open Microsoft Excel or Google Sheets to inspect Calls, Puts, Volume, Open Interest, Delta, Gamma, Theta, Vega, and Rho.',
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
          <FileSpreadsheet size={14} /> Free Options Tool · Excel & Google Sheets CSV Export with Greeks
        </span>
        <h1 className="hero-headline">
          Stock Options <em>Data Extractor</em> & CSV Downloader
        </h1>
        <p className="hero-sub">
          Extract complete options chains for any US stock symbol into clean, Excel-formatted CSV files. Analyze Calls, Puts, strike prices, volume, open interest, implied volatility, and Option Greeks (Delta, Gamma, Theta, Vega, Rho).
        </p>
      </section>

      {/* Symbol Search & Controls Bar */}
      <section className="options-control-section glass-panel">
        <form onSubmit={handleSymbolSubmit} className="options-search-form">
          <div className="search-input-group">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              value={inputSymbol}
              onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
              placeholder="Enter ticker (e.g. AAPL, SPY, TSLA, NVDA)"
              className="symbol-input"
              maxLength={10}
            />
            <button type="submit" className="cta-btn search-submit-btn" disabled={loading}>
              {loading ? <RefreshCw className="spin-icon" size={16} /> : 'Extract Options'}
            </button>
          </div>
        </form>

        {/* Popular Presets */}
        <div className="preset-row">
          <span className="preset-label">Popular Symbols:</span>
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

        {/* Expiration Date Selector & Data Refresh */}
        {data && data.expirationDates && data.expirationDates.length > 0 && (
          <div className="options-meta-toolbar">
            <div className="toolbar-group">
              <label htmlFor="expiration-select" className="toolbar-label">
                <Calendar size={15} /> Expiration Date:
              </label>
              <select
                id="expiration-select"
                value={selectedDate}
                onChange={handleDateChange}
                className="toolbar-select"
                disabled={loading}
              >
                {data.expirationDates.map((exp) => (
                  <option key={exp.dateStr} value={exp.dateStr}>
                    {exp.formatted} ({exp.dateStr})
                  </option>
                ))}
              </select>
            </div>

            <div className="toolbar-actions">
              <button
                onClick={() => fetchOptions(symbol, selectedDate)}
                className="secondary-btn icon-btn"
                title="Refresh options data"
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? 'spin-icon' : ''} /> Refresh
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Error state alert */}
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
          <p>Extracting live options chain data for <strong>{symbol}</strong>...</p>
        </div>
      )}

      {/* Main Options Data Content */}
      {data && (
        <>
          {/* Key Metrics Cards */}
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
              <span className="kpi-label">Expiration & DTE</span>
              <div className="kpi-value-row">
                <span className="kpi-main-val">{data.selectedExpiration?.formatted || data.selectedExpiration?.dateStr}</span>
              </div>
              <span className="kpi-sub badge-sub">
                {data.selectedExpiration?.dte} Days to Expiration
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
              <span className="kpi-sub">Estimated minimum loss strike</span>
            </div>
          </section>

          {/* Primary CSV Download Action Banner */}
          <section className="csv-download-banner glass-panel">
            <div className="csv-banner-content">
              <div className="csv-banner-text">
                <h2>Ready for Excel or Google Sheets</h2>
                <p>
                  Export {filteredContracts.length} option contracts with <strong>Full Greeks (Δ, Γ, Θ, ν, ρ)</strong> for <strong>{data.symbol}</strong> ({data.selectedExpiration?.dateStr}).
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
                  title="Copy CSV data to clipboard"
                >
                  {copied ? <Check size={16} className="green-icon" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </section>

          {/* Interactive Filter & View Bar */}
          <section className="table-controls-section glass-panel">
            <div className="filter-toolbar">
              <div className="filter-group">
                <span className="filter-label"><Sliders size={14} /> Type:</span>
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
                    Calls ({data.calls?.length || 0})
                  </button>
                  <button
                    onClick={() => { setTypeFilter('PUTS'); setViewTab('PUTS'); }}
                    className={`pill-btn ${typeFilter === 'PUTS' ? 'active' : ''}`}
                  >
                    Puts ({data.puts?.length || 0})
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <span className="filter-label">Moneyness:</span>
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
                <input
                  type="text"
                  placeholder="Filter strike or symbol..."
                  value={strikeSearch}
                  onChange={(e) => setStrikeSearch(e.target.value)}
                  className="strike-search-input"
                />
              </div>
            </div>
          </section>

          {/* Options Data Table */}
          <section className="options-table-section glass-panel">
            <div className="table-responsive-container">
              <table className="options-data-table">
                <thead>
                  <tr>
                    <th>Contract Symbol</th>
                    <th>Type</th>
                    <th>Strike</th>
                    <th>Last Price</th>
                    <th>Bid</th>
                    <th>Ask</th>
                    <th>Change</th>
                    <th>Volume</th>
                    <th>Open Int</th>
                    <th>IV</th>
                    <th>Delta (Δ)</th>
                    <th>Gamma (Γ)</th>
                    <th>Theta (Θ)</th>
                    <th>Vega (ν)</th>
                    <th>ITM</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan={15} className="empty-table-cell">
                        No option contracts match the selected filters. Try adjusting your filters above.
                      </td>
                    </tr>
                  ) : (
                    filteredContracts.map((c) => {
                      const isCall = c.optionType === 'CALL'
                      return (
                        <tr
                          key={c.contractSymbol || `${c.optionType}-${c.strike}`}
                          className={c.inTheMoney ? 'itm-row' : ''}
                        >
                          <td className="contract-code-cell">{c.contractSymbol}</td>
                          <td>
                            <span className={`type-badge ${isCall ? 'call-badge' : 'put-badge'}`}>
                              {c.optionType}
                            </span>
                          </td>
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

      <AdSlot id="options-inline-mid" />

      {/* Educational & How-To Section */}
      <section className="options-guide-section glass-panel">
        <div className="guide-header">
          <HelpCircle size={20} className="guide-icon" />
          <h2>How to Import Options CSV Data into Excel & Google Sheets</h2>
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
