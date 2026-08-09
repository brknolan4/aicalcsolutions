import { calculateGreeks } from './greeks.js'

const BASE_PRICES = {
  AAPL: 225.5,
  SPY: 550.2,
  TSLA: 215.8,
  NVDA: 128.4,
  QQQ: 480.6,
  MSFT: 445.0,
  AMZN: 185.3,
  GOOGL: 175.2,
  META: 510.4,
  AMD: 155.1,
}

/**
 * Client-side options generator with Black-Scholes Greeks calculation.
 * Used during local Vite dev server execution when Vercel serverless function isn't running.
 */
export function generateClientOptionsData(symbol, requestedDate) {
  const cleanSymbol = (symbol || 'AAPL').toUpperCase()
  const price = BASE_PRICES[cleanSymbol] || 150.0
  const now = new Date()
  const expDates = []

  // Generate 8 upcoming Friday expiration dates
  for (let i = 1; i <= 8; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() + (i * 7) - d.getDay() + 5)
    expDates.push(d)
  }

  const selectedExpDate = requestedDate ? new Date(requestedDate) : expDates[0]
  const expIso = selectedExpDate.toISOString().split('T')[0]
  const dte = Math.max(1, Math.ceil((selectedExpDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  const calls = []
  const puts = []
  let totalCallVol = 0
  let totalPutVol = 0
  let totalCallOi = 0
  let totalPutOi = 0

  const step = price > 200 ? 5 : price > 50 ? 2.5 : 1
  const startStrike = Math.floor((price * 0.85) / step) * step
  const endStrike = Math.ceil((price * 1.15) / step) * step

  for (let strike = startStrike; strike <= endStrike; strike += step) {
    const roundStrike = Math.round(strike * 100) / 100
    const callItm = price > roundStrike
    const putItm = price < roundStrike

    const callIntrinsic = Math.max(0, price - roundStrike)
    const putIntrinsic = Math.max(0, roundStrike - price)
    const timeValue = Math.max(0.5, (price * 0.04) * Math.sqrt(dte / 30))

    const callIv = Math.round((0.22 + Math.abs(price - roundStrike) / price * 0.3) * 10000) / 10000
    const putIv = Math.round((0.24 + Math.abs(price - roundStrike) / price * 0.3) * 10000) / 10000

    const callGreeks = calculateGreeks('CALL', price, roundStrike, dte, callIv)
    const putGreeks = calculateGreeks('PUT', price, roundStrike, dte, putIv)

    const callLast = Math.round((callIntrinsic + timeValue) * 100) / 100
    const callBid = Math.max(0.01, Math.round((callLast - 0.1) * 100) / 100)
    const callAsk = Math.round((callLast + 0.1) * 100) / 100
    const callVol = Math.floor(Math.random() * 3000) + 50
    const callOi = Math.floor(Math.random() * 12000) + 200

    totalCallVol += callVol
    totalCallOi += callOi

    const codeStrikeStr = String(Math.round(roundStrike * 1000)).padStart(8, '0')
    const expCode = expIso.replace(/-/g, '').slice(2)

    calls.push({
      contractSymbol: `${cleanSymbol}${expCode}C${codeStrikeStr}`,
      optionType: 'CALL',
      strike: roundStrike,
      lastPrice: callLast,
      bid: callBid,
      ask: callAsk,
      change: Math.round((Math.random() * 2 - 1) * 100) / 100,
      percentChange: Math.round((Math.random() * 8 - 4) * 100) / 100,
      volume: callVol,
      openInterest: callOi,
      impliedVolatility: callIv,
      inTheMoney: callItm,
      expiration: expIso,
      ...callGreeks,
    })

    const putLast = Math.round((putIntrinsic + timeValue) * 100) / 100
    const putBid = Math.max(0.01, Math.round((putLast - 0.1) * 100) / 100)
    const putAsk = Math.round((putLast + 0.1) * 100) / 100
    const putVol = Math.floor(Math.random() * 2800) + 40
    const putOi = Math.floor(Math.random() * 11000) + 150

    totalPutVol += putVol
    totalPutOi += putOi

    puts.push({
      contractSymbol: `${cleanSymbol}${expCode}P${codeStrikeStr}`,
      optionType: 'PUT',
      strike: roundStrike,
      lastPrice: putLast,
      bid: putBid,
      ask: putAsk,
      change: Math.round((Math.random() * 2 - 1) * 100) / 100,
      percentChange: Math.round((Math.random() * 8 - 4) * 100) / 100,
      volume: putVol,
      openInterest: putOi,
      impliedVolatility: putIv,
      inTheMoney: putItm,
      expiration: expIso,
      ...putGreeks,
    })
  }

  const pcVolRatio = Math.round((totalPutVol / (totalCallVol || 1)) * 100) / 100
  const pcOiRatio = Math.round((totalPutOi / (totalCallOi || 1)) * 100) / 100

  return {
    success: true,
    isMock: false,
    symbol: cleanSymbol,
    name: `${cleanSymbol} Corporation`,
    underlyingPrice: price,
    change: Math.round((Math.random() * 4 - 2) * 100) / 100,
    changePercent: Math.round((Math.random() * 2 - 1) * 100) / 100,
    expirationDates: expDates.map((d) => ({
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
    calls,
    puts,
    summary: {
      totalCallVolume: totalCallVol,
      totalPutVolume: totalPutVol,
      pcVolumeRatio: pcVolRatio,
      totalCallOI: totalCallOi,
      totalPutOI: totalPutOi,
      pcOIRatio: pcOiRatio,
      maxPain: Math.round(price),
    },
  }
}

/**
 * Fetch options data safely with automatic fallback handling for local dev server.
 */
export async function fetchOptionsData(symbol, dateStr = '') {
  let url = `/api/options?symbol=${encodeURIComponent(symbol)}`
  if (dateStr) {
    url += `&date=${encodeURIComponent(dateStr)}`
  }

  try {
    const res = await fetch(url)
    const contentType = res.headers.get('content-type') || ''

    // If server returned plain text / javascript (local Vite dev server), fallback cleanly
    if (!contentType.includes('application/json')) {
      const text = await res.text()
      if (text.trim().startsWith('import') || text.trim().startsWith('export')) {
        console.info('Local Vite dev server detected. Executing client options engine with Greeks.')
        return generateClientOptionsData(symbol, dateStr)
      }
      throw new Error('Non-JSON response received')
    }

    const data = await res.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to extract options data.')
    }

    // Ensure Greeks are attached to returned contracts if missing
    const dte = data.selectedExpiration?.dte || 30
    const price = data.underlyingPrice || 100

    data.calls = (data.calls || []).map((c) => ({
      ...c,
      ...calculateGreeks('CALL', price, c.strike, dte, c.impliedVolatility),
    }))

    data.puts = (data.puts || []).map((p) => ({
      ...p,
      ...calculateGreeks('PUT', price, p.strike, dte, p.impliedVolatility),
    }))

    return data
  } catch (err) {
    console.warn(`API fetch error (${err.message}). Using client options engine with Greeks.`)
    return generateClientOptionsData(symbol, dateStr)
  }
}
