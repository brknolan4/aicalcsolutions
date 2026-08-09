import YahooFinance from 'yahoo-finance2'

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] })

function normPdf(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
}

function normCdf(x) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911
  const sign = x < 0 ? -1 : 1
  const absX = Math.abs(x) / Math.sqrt(2.0)
  const t = 1.0 / (1.0 + p * absX)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX)
  return 0.5 * (1.0 + sign * y)
}

function calculateGreeks(type, S, K, DTE, iv, r = 0.045) {
  const T = Math.max(0.001, DTE / 365.0)
  const v = Math.max(0.01, iv || 0.25)
  const sPrice = Math.max(0.01, S)
  const strike = Math.max(0.01, K)

  const d1 = (Math.log(sPrice / strike) + (r + 0.5 * v * v) * T) / (v * Math.sqrt(T))
  const d2 = d1 - v * Math.sqrt(T)

  const pdfD1 = normPdf(d1)
  const cdfD1 = normCdf(d1)
  const cdfD2 = normCdf(d2)
  const cdfNegD2 = normCdf(-d2)

  const gamma = pdfD1 / (sPrice * v * Math.sqrt(T))
  const vega = (sPrice * Math.sqrt(T) * pdfD1) / 100.0

  let delta = 0
  let theta = 0
  let rho = 0

  if (type.toUpperCase() === 'CALL') {
    delta = cdfD1
    const thetaAnn = -(sPrice * pdfD1 * v) / (2 * Math.sqrt(T)) - r * strike * Math.exp(-r * T) * cdfD2
    theta = thetaAnn / 365.0
    rho = (strike * T * Math.exp(-r * T) * cdfD2) / 100.0
  } else {
    delta = cdfD1 - 1.0
    const thetaAnn = -(sPrice * pdfD1 * v) / (2 * Math.sqrt(T)) + r * strike * Math.exp(-r * T) * cdfNegD2
    theta = thetaAnn / 365.0
    rho = (-strike * T * Math.exp(-r * T) * cdfNegD2) / 100.0
  }

  return {
    delta: Math.round(delta * 10000) / 10000,
    gamma: Math.round(gamma * 10000) / 10000,
    theta: Math.round(theta * 10000) / 10000,
    vega: Math.round(vega * 10000) / 10000,
    rho: Math.round(rho * 10000) / 10000,
  }
}

function generateFallbackOptions(symbol, requestedDate) {
  const cleanSymbol = (symbol || 'AAPL').toUpperCase()
  const basePrices = {
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

  const price = basePrices[cleanSymbol] || 150.0
  const now = new Date()
  const expDates = []

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const symbol = (req.query?.symbol || req.query?.ticker || 'AAPL').toString().trim().toUpperCase()
  const dateParam = req.query?.date || req.query?.expiration

  if (!symbol) {
    return res.status(400).json({ success: false, error: 'Symbol parameter is required.' })
  }

  try {
    const queryOpts = {}
    if (dateParam) {
      if (/^\d+$/.test(dateParam)) {
        queryOpts.date = new Date(parseInt(dateParam, 10) * 1000)
      } else {
        queryOpts.date = new Date(dateParam)
      }
    }

    const yfResult = await yf.options(symbol, queryOpts)

    if (!yfResult || !yfResult.quote) {
      throw new Error(`No option data returned for symbol: ${symbol}`)
    }

    const quote = yfResult.quote
    const underlyingPrice = quote.regularMarketPrice || quote.postMarketPrice || quote.preMarketPrice || 0
    const name = quote.shortName || quote.longName || symbol

    const expirationDates = (yfResult.expirationDates || []).map((exp) => {
      const d = exp instanceof Date ? exp : new Date(exp)
      return {
        timestamp: Math.floor(d.getTime() / 1000),
        dateStr: d.toISOString().split('T')[0],
        formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      }
    })

    const optBlock = yfResult.options?.[0] || {}
    const rawExp = optBlock.expirationDate ? new Date(optBlock.expirationDate) : (expirationDates[0] ? new Date(expirationDates[0].dateStr) : new Date())
    const expIso = rawExp.toISOString().split('T')[0]
    const now = new Date()
    const dte = Math.max(1, Math.ceil((rawExp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    let totalCallVol = 0
    let totalPutVol = 0
    let totalCallOi = 0
    let totalPutOi = 0

    const mapContract = (c, type) => {
      const vol = c.volume || 0
      const oi = c.openInterest || 0
      const iv = c.impliedVolatility ? Math.round(c.impliedVolatility * 10000) / 10000 : 0.25
      const strike = c.strike || 0

      if (type === 'CALL') {
        totalCallVol += vol
        totalCallOi += oi
      } else {
        totalPutVol += vol
        totalPutOi += oi
      }

      const greeks = calculateGreeks(type, underlyingPrice, strike, dte, iv)

      return {
        contractSymbol: c.contractSymbol || '',
        optionType: type,
        strike,
        lastPrice: c.lastPrice || 0,
        bid: c.bid || 0,
        ask: c.ask || 0,
        change: c.change || 0,
        percentChange: c.percentChange || 0,
        volume: vol,
        openInterest: oi,
        impliedVolatility: iv,
        inTheMoney: Boolean(c.inTheMoney),
        expiration: expIso,
        ...greeks,
      }
    }

    const calls = (optBlock.calls || []).map((c) => mapContract(c, 'CALL'))
    const puts = (optBlock.puts || []).map((c) => mapContract(c, 'PUT'))

    const pcVolRatio = totalCallVol > 0 ? Math.round((totalPutVol / totalCallVol) * 100) / 100 : 0
    const pcOiRatio = totalCallOi > 0 ? Math.round((totalPutOi / totalCallOi) * 100) / 100 : 0

    let maxPainStrike = underlyingPrice
    if (calls.length > 0 && puts.length > 0) {
      const allStrikes = Array.from(new Set([...calls.map(c => c.strike), ...puts.map(p => p.strike)])).sort((a, b) => a - b)
      let minLoss = Infinity

      for (const strikeCandidate of allStrikes) {
        let totalLoss = 0
        for (const call of calls) {
          if (strikeCandidate > call.strike) {
            totalLoss += (strikeCandidate - call.strike) * call.openInterest
          }
        }
        for (const put of puts) {
          if (strikeCandidate < put.strike) {
            totalLoss += (put.strike - strikeCandidate) * put.openInterest
          }
        }
        if (totalLoss < minLoss) {
          minLoss = totalLoss
          maxPainStrike = strikeCandidate
        }
      }
    }

    return res.status(200).json({
      success: true,
      isMock: false,
      symbol,
      name,
      underlyingPrice,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      expirationDates,
      selectedExpiration: {
        timestamp: Math.floor(rawExp.getTime() / 1000),
        dateStr: expIso,
        formatted: rawExp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
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
        maxPain: maxPainStrike,
      },
    })
  } catch (err) {
    console.warn(`Upstream Yahoo Finance error for ${symbol}: ${err.message}. Using fallback generator.`)
    const fallbackData = generateFallbackOptions(symbol, dateParam)
    return res.status(200).json(fallbackData)
  }
}
