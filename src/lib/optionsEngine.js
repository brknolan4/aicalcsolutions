import { calculateGreeks } from './greeks.js'

const BASE_PRICES = {
  AAPL: 225.5, SPY: 550.2, TSLA: 215.8, NVDA: 128.4, QQQ: 480.6,
  MSFT: 445.0, AMZN: 185.3, GOOGL: 175.2, META: 510.4, AMD: 155.1,
}

/** Generate contracts for one expiration date (client-side mock). */
function generateContractsForDate(symbol, price, expDate) {
  const now = new Date()
  const expIso = expDate.toISOString().split('T')[0]
  const dte = Math.max(1, Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  const expCode = expIso.replace(/-/g, '').slice(2)

  const step = price > 200 ? 5 : price > 50 ? 2.5 : 1
  const startStrike = Math.floor((price * 0.85) / step) * step
  const endStrike = Math.ceil((price * 1.15) / step) * step

  const calls = []
  const puts = []

  for (let strike = startStrike; strike <= endStrike; strike += step) {
    const roundStrike = Math.round(strike * 100) / 100
    const callIv = Math.round((0.22 + Math.abs(price - roundStrike) / price * 0.3) * 10000) / 10000
    const putIv = Math.round((0.24 + Math.abs(price - roundStrike) / price * 0.3) * 10000) / 10000
    const callIntrinsic = Math.max(0, price - roundStrike)
    const putIntrinsic = Math.max(0, roundStrike - price)
    const timeValue = Math.max(0.5, (price * 0.04) * Math.sqrt(dte / 30))
    const codeStrikeStr = String(Math.round(roundStrike * 1000)).padStart(8, '0')

    calls.push({
      contractSymbol: `${symbol}${expCode}C${codeStrikeStr}`,
      optionType: 'CALL', strike: roundStrike,
      lastPrice: Math.round((callIntrinsic + timeValue) * 100) / 100,
      bid: Math.max(0.01, Math.round((callIntrinsic + timeValue - 0.1) * 100) / 100),
      ask: Math.round((callIntrinsic + timeValue + 0.1) * 100) / 100,
      change: Math.round((Math.random() * 2 - 1) * 100) / 100,
      percentChange: Math.round((Math.random() * 8 - 4) * 100) / 100,
      volume: Math.floor(Math.random() * 3000) + 50,
      openInterest: Math.floor(Math.random() * 12000) + 200,
      impliedVolatility: callIv, inTheMoney: price > roundStrike, expiration: expIso,
      ...calculateGreeks('CALL', price, roundStrike, dte, callIv),
    })

    puts.push({
      contractSymbol: `${symbol}${expCode}P${codeStrikeStr}`,
      optionType: 'PUT', strike: roundStrike,
      lastPrice: Math.round((putIntrinsic + timeValue) * 100) / 100,
      bid: Math.max(0.01, Math.round((putIntrinsic + timeValue - 0.1) * 100) / 100),
      ask: Math.round((putIntrinsic + timeValue + 0.1) * 100) / 100,
      change: Math.round((Math.random() * 2 - 1) * 100) / 100,
      percentChange: Math.round((Math.random() * 8 - 4) * 100) / 100,
      volume: Math.floor(Math.random() * 2800) + 40,
      openInterest: Math.floor(Math.random() * 11000) + 150,
      impliedVolatility: putIv, inTheMoney: price < roundStrike, expiration: expIso,
      ...calculateGreeks('PUT', price, roundStrike, dte, putIv),
    })
  }
  return { calls, puts }
}

/**
 * Client-side options generator with full multi-date support.
 * Used during local Vite dev server (no serverless function available).
 */
export function generateClientOptionsData(symbol, requestedDate, dateRange) {
  const cleanSymbol = (symbol || 'AAPL').toUpperCase()
  const price = BASE_PRICES[cleanSymbol] || 150.0
  const now = new Date()

  const expDates = []
  for (let i = 1; i <= 8; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() + (i * 7) - d.getDay() + 5)
    expDates.push(d)
  }

  // Determine which dates to generate contracts for
  let datesToGenerate = []
  if (dateRange?.startDate && dateRange?.endDate) {
    datesToGenerate = expDates.filter(d => {
      const iso = d.toISOString().split('T')[0]
      return iso >= dateRange.startDate && iso <= dateRange.endDate
    })
    if (datesToGenerate.length === 0) datesToGenerate = expDates.slice(0, 1)
  } else {
    const sel = requestedDate ? new Date(requestedDate) : expDates[0]
    datesToGenerate = [sel]
  }

  let allCalls = []
  let allPuts = []
  for (const expDate of datesToGenerate) {
    const { calls, puts } = generateContractsForDate(cleanSymbol, price, expDate)
    allCalls = allCalls.concat(calls)
    allPuts = allPuts.concat(puts)
  }

  const totalCallVol = allCalls.reduce((s, c) => s + (c.volume || 0), 0)
  const totalPutVol = allPuts.reduce((s, c) => s + (c.volume || 0), 0)
  const totalCallOi = allCalls.reduce((s, c) => s + (c.openInterest || 0), 0)
  const totalPutOi = allPuts.reduce((s, c) => s + (c.openInterest || 0), 0)
  const selectedExpDate = datesToGenerate[0]
  const expIso = selectedExpDate.toISOString().split('T')[0]
  const dte = Math.max(1, Math.ceil((selectedExpDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  return {
    success: true, isMock: false,
    symbol: cleanSymbol, name: `${cleanSymbol} Corporation`,
    underlyingPrice: price,
    change: Math.round((Math.random() * 4 - 2) * 100) / 100,
    changePercent: Math.round((Math.random() * 2 - 1) * 100) / 100,
    expirationDates: expDates.map(d => ({
      timestamp: Math.floor(d.getTime() / 1000),
      dateStr: d.toISOString().split('T')[0],
      formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
    })),
    selectedExpiration: {
      timestamp: Math.floor(selectedExpDate.getTime() / 1000),
      dateStr: expIso,
      formatted: selectedExpDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      dte,
    },
    calls: allCalls, puts: allPuts,
    summary: {
      totalCallVolume: totalCallVol, totalPutVolume: totalPutVol,
      pcVolumeRatio: Math.round((totalPutVol / (totalCallVol || 1)) * 100) / 100,
      totalCallOI: totalCallOi, totalPutOI: totalPutOi,
      pcOIRatio: Math.round((totalPutOi / (totalCallOi || 1)) * 100) / 100,
      maxPain: Math.round(price),
    },
  }
}

/** Fetch one expiration date from the serverless API. Returns { isLocalDev: true } if on local Vite. */
async function fetchSingleDate(symbol, dateStr) {
  let url = `/api/options?symbol=${encodeURIComponent(symbol)}`
  if (dateStr) url += `&date=${encodeURIComponent(dateStr)}`

  const res = await fetch(url)
  const contentType = res.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    const text = await res.text()
    if (text.trim().startsWith('import') || text.trim().startsWith('export')) {
      return { isLocalDev: true }
    }
    throw new Error('Non-JSON response received')
  }

  const data = await res.json()
  if (!data.success) throw new Error(data.error || 'Failed to extract options data.')
  return data
}

/** Attach Greeks to contracts that are missing them. */
function ensureGreeks(contracts, type, price, dte) {
  return contracts.map(c => ({
    ...c,
    ...calculateGreeks(type, price, c.strike, dte, c.impliedVolatility),
  }))
}

/**
 * Main entry point.
 *
 * Single-date mode  : fetchOptionsData('AAPL', '2025-08-15')
 * Range mode        : fetchOptionsData('AAPL', '', { startDate: '2025-08-15', endDate: '2025-09-19' })
 *
 * In range mode: fetches the expiration list, then parallel-fetches every
 * expiration within [startDate, endDate] (capped at 6) and merges contracts.
 */
export async function fetchOptionsData(symbol, dateStr = '', dateRange = null) {
  try {

    // ── RANGE MODE ────────────────────────────────────────────────────────────
    if (dateRange?.startDate && dateRange?.endDate) {
      // Fetch base (no date) to get the full expiration date list
      const base = await fetchSingleDate(symbol, '')
      if (base.isLocalDev) {
        console.info('Local Vite dev detected — using client engine (range mode).')
        return generateClientOptionsData(symbol, '', dateRange)
      }

      // Filter expirations within the requested range
      const datesInRange = (base.expirationDates || []).filter(
        exp => exp.dateStr >= dateRange.startDate && exp.dateStr <= dateRange.endDate
      )

      if (datesInRange.length === 0) {
        // Nothing in range — return base data unchanged
        const price = base.underlyingPrice || 100
        const dte = base.selectedExpiration?.dte || 30
        base.calls = ensureGreeks(base.calls || [], 'CALL', price, dte)
        base.puts = ensureGreeks(base.puts || [], 'PUT', price, dte)
        return base
      }

      // Parallel fetch all dates in range (cap at 6 to avoid rate limits)
      const datesToFetch = datesInRange.slice(0, 6)
      const results = await Promise.allSettled(
        datesToFetch.map(exp => fetchSingleDate(symbol, exp.dateStr))
      )

      // Merge successful results
      let allCalls = []
      let allPuts = []
      let totalCallVol = 0, totalPutVol = 0, totalCallOi = 0, totalPutOi = 0

      for (const result of results) {
        if (result.status !== 'fulfilled' || result.value?.isLocalDev) continue
        const d = result.value
        const price = d.underlyingPrice || base.underlyingPrice || 100
        const dte = d.selectedExpiration?.dte || 30
        const calls = ensureGreeks(d.calls || [], 'CALL', price, dte)
        const puts  = ensureGreeks(d.puts  || [], 'PUT',  price, dte)
        allCalls = allCalls.concat(calls)
        allPuts  = allPuts.concat(puts)
        totalCallVol += calls.reduce((s, c) => s + (c.volume || 0), 0)
        totalPutVol  += puts.reduce((s, c)  => s + (c.volume || 0), 0)
        totalCallOi  += calls.reduce((s, c) => s + (c.openInterest || 0), 0)
        totalPutOi   += puts.reduce((s, c)  => s + (c.openInterest || 0), 0)
      }

      if (allCalls.length === 0 && allPuts.length === 0) {
        // All parallel fetches failed — fall back to base
        const price = base.underlyingPrice || 100
        const dte = base.selectedExpiration?.dte || 30
        base.calls = ensureGreeks(base.calls || [], 'CALL', price, dte)
        base.puts  = ensureGreeks(base.puts  || [], 'PUT',  price, dte)
        return base
      }

      return {
        ...base,
        calls: allCalls, puts: allPuts,
        summary: {
          totalCallVolume: totalCallVol, totalPutVolume: totalPutVol,
          pcVolumeRatio: totalCallVol > 0 ? Math.round((totalPutVol / totalCallVol) * 100) / 100 : 0,
          totalCallOI: totalCallOi, totalPutOI: totalPutOi,
          pcOIRatio: totalCallOi > 0 ? Math.round((totalPutOi / totalCallOi) * 100) / 100 : 0,
          maxPain: base.summary?.maxPain,
        },
      }
    }

    // ── SINGLE DATE MODE ──────────────────────────────────────────────────────
    const data = await fetchSingleDate(symbol, dateStr)
    if (data.isLocalDev) {
      console.info('Local Vite dev detected — using client engine.')
      return generateClientOptionsData(symbol, dateStr)
    }

    const price = data.underlyingPrice || 100
    const dte = data.selectedExpiration?.dte || 30
    data.calls = ensureGreeks(data.calls || [], 'CALL', price, dte)
    data.puts  = ensureGreeks(data.puts  || [], 'PUT',  price, dte)
    return data

  } catch (err) {
    console.warn(`API fetch error (${err.message}). Falling back to client engine.`)
    return generateClientOptionsData(symbol, dateStr, dateRange)
  }
}
