import { fetchOptionsData } from './optionsEngine.js'

export const INDICES_DATA = {
  SPY: {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    description: 'Tracks the benchmark S&P 500 Index representing the 500 largest US publicly traded companies.',
    topHoldings: [
      { symbol: 'NVDA', name: 'NVIDIA Corp', weight: 7.2, sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corp', weight: 6.8, sector: 'Technology' },
      { symbol: 'AAPL', name: 'Apple Inc', weight: 6.3, sector: 'Technology' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', weight: 3.8, sector: 'Consumer Cyclical' },
      { symbol: 'META', name: 'Meta Platforms Inc', weight: 2.6, sector: 'Technology' },
      { symbol: 'GOOGL', name: 'Alphabet Inc Cl A', weight: 2.1, sector: 'Communication' },
      { symbol: 'BRK.B', name: 'Berkshire Hathaway B', weight: 1.7, sector: 'Financials' },
      { symbol: 'AVGO', name: 'Broadcom Inc', weight: 1.6, sector: 'Technology' },
      { symbol: 'TSLA', name: 'Tesla Inc', weight: 1.5, sector: 'Consumer Cyclical' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co', weight: 1.3, sector: 'Financials' },
    ]
  },
  QQQ: {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust (Nasdaq 100)',
    description: 'Tracks the tech-heavy Nasdaq-100 Index featuring non-financial market leaders.',
    topHoldings: [
      { symbol: 'NVDA', name: 'NVIDIA Corp', weight: 8.9, sector: 'Technology' },
      { symbol: 'AAPL', name: 'Apple Inc', weight: 8.2, sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corp', weight: 7.9, sector: 'Technology' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', weight: 5.1, sector: 'Consumer Cyclical' },
      { symbol: 'META', name: 'Meta Platforms Inc', weight: 4.5, sector: 'Technology' },
      { symbol: 'AVGO', name: 'Broadcom Inc', weight: 3.2, sector: 'Technology' },
      { symbol: 'TSLA', name: 'Tesla Inc', weight: 2.9, sector: 'Consumer Cyclical' },
      { symbol: 'GOOGL', name: 'Alphabet Inc Cl A', weight: 2.6, sector: 'Communication' },
      { symbol: 'COST', name: 'Costco Wholesale Corp', weight: 2.3, sector: 'Consumer Defensive' },
      { symbol: 'NFLX', name: 'Netflix Inc', weight: 2.1, sector: 'Communication' },
    ]
  }
}

/**
 * Determine sentiment classification based on P/C Ratio value
 */
export function getSentimentStatus(pcRatio) {
  if (pcRatio < 0.60) {
    return { label: 'Extreme Greed', code: 'EXTREME_GREED', color: '#10b981', desc: 'Heavy Call buying. Very bullish institutional positioning, watch for overbought conditions.' }
  } else if (pcRatio < 0.85) {
    return { label: 'Bullish', code: 'BULLISH', color: '#00d4aa', desc: 'Call volume outpaces Puts. Healthy bullish sentiment.' }
  } else if (pcRatio <= 1.15) {
    return { label: 'Neutral', code: 'NEUTRAL', color: '#60a5fa', desc: 'Balanced Put/Call volume. Market in consolidation phase.' }
  } else if (pcRatio <= 1.45) {
    return { label: 'Bearish', code: 'BEARISH', color: '#f59e0b', desc: 'Elevated Put buying. Increased downside hedging.' }
  } else {
    return { label: 'Extreme Fear', code: 'EXTREME_FEAR', color: '#ef4444', desc: 'Heavy Put hedging. Extreme fear, often acts as a contrarian buy signal.' }
  }
}

/**
 * Generate realistic 10-year historical Put/Call Ratio time series
 * alongside underlying SPY and QQQ ETF prices.
 */
export function generateHistoricalPcData(timeframe = '10Y') {
  const years = timeframe === '1Y' ? 1 : timeframe === '3Y' ? 3 : timeframe === '5Y' ? 5 : 10
  const totalMonths = years * 12
  const points = []
  
  const now = new Date()
  const baseYear = now.getFullYear() - years
  const baseMonth = now.getMonth()

  for (let i = 0; i <= totalMonths; i++) {
    const d = new Date(baseYear, baseMonth + i, 1)
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const yearNum = d.getFullYear()
    const monthNum = d.getMonth()

    // P/C Ratios Regimes (2016-2026)
    let spyBase = 0.88
    let qqqBase = 0.82
    let nvdaBase = 0.75
    let aaplBase = 0.80

    // Price trajectory simulation
    // SPY: 2016 (~$210) -> 2019 (~$290) -> 2020 COVID ($230 -> $370) -> 2021 ($470) -> 2022 ($360) -> 2024 ($570) -> 2026 ($550)
    // QQQ: 2016 (~$110) -> 2019 (~$190) -> 2020 COVID ($175 -> $310) -> 2021 ($390) -> 2022 ($260) -> 2024 ($500) -> 2026 ($510)
    let spyPriceBase = 210
    let qqqPriceBase = 110

    if (yearNum === 2016) { spyPriceBase = 205 + monthNum * 1.5; qqqPriceBase = 105 + monthNum * 1.2 }
    else if (yearNum === 2017) { spyPriceBase = 225 + monthNum * 3.5; qqqPriceBase = 120 + monthNum * 3.0 }
    else if (yearNum === 2018) { spyPriceBase = 270 + Math.sin(monthNum * 0.5) * 15; qqqPriceBase = 160 + Math.sin(monthNum * 0.5) * 12 }
    else if (yearNum === 2019) { spyPriceBase = 250 + monthNum * 5.0; qqqPriceBase = 155 + monthNum * 4.5 }
    else if (yearNum === 2020) {
      if (monthNum <= 2) { spyPriceBase = 320 - monthNum * 40; qqqPriceBase = 220 - monthNum * 25 } // COVID crash
      else { spyPriceBase = 240 + (monthNum - 2) * 14; qqqPriceBase = 175 + (monthNum - 2) * 15 } // Recovery
      spyBase = monthNum <= 2 ? 1.48 : 0.85
      qqqBase = monthNum <= 2 ? 1.42 : 0.78
    }
    else if (yearNum === 2021) { spyPriceBase = 370 + monthNum * 8.0; qqqPriceBase = 310 + monthNum * 6.5 }
    else if (yearNum === 2022) {
      spyPriceBase = 460 - monthNum * 8.5; qqqPriceBase = 390 - monthNum * 10.0 // Bear market
      spyBase = 1.18 + Math.sin(i * 0.5) * 0.15
      qqqBase = 1.22 + Math.sin(i * 0.5) * 0.18
    }
    else if (yearNum === 2023) { spyPriceBase = 380 + monthNum * 7.5; qqqPriceBase = 270 + monthNum * 11.0 }
    else if (yearNum === 2024) { spyPriceBase = 470 + monthNum * 8.0; qqqPriceBase = 400 + monthNum * 8.5 }
    else if (yearNum >= 2025) { spyPriceBase = 560 + Math.sin(i * 0.3) * 15; qqqPriceBase = 500 + Math.sin(i * 0.3) * 18 }

    const spyNoise = (Math.sin(i * 1.7) * 0.04) + (Math.cos(i * 3.1) * 0.03)
    const qqqNoise = (Math.cos(i * 1.5) * 0.05) + (Math.sin(i * 2.8) * 0.03)
    const nvdaNoise = (Math.sin(i * 2.2) * 0.06)
    const aaplNoise = (Math.cos(i * 1.9) * 0.04)

    const spyRatio = Math.round(Math.max(0.4, spyBase + spyNoise) * 100) / 100
    const qqqRatio = Math.round(Math.max(0.35, qqqBase + qqqNoise) * 100) / 100
    const nvdaRatio = Math.round(Math.max(0.30, nvdaBase + nvdaNoise) * 100) / 100
    const aaplRatio = Math.round(Math.max(0.35, aaplBase + aaplNoise) * 100) / 100

    const spyPrice = Math.round((spyPriceBase + Math.sin(i * 2.1) * 6) * 100) / 100
    const qqqPrice = Math.round((qqqPriceBase + Math.cos(i * 2.3) * 7) * 100) / 100

    points.push({
      date: dateStr,
      isoDate: d.toISOString().split('T')[0],
      SPY: spyRatio,
      QQQ: qqqRatio,
      NVDA: nvdaRatio,
      AAPL: aaplRatio,
      SPY_PRICE: spyPrice,
      QQQ_PRICE: qqqPrice,
    })
  }

  return points
}

/**
 * Fetch snapshot metrics for index or constituent stock
 */
export async function getPcRatioMetrics(symbol) {
  try {
    const data = await fetchOptionsData(symbol, '')
    const calls = data.calls || []
    const puts = data.puts || []

    const callVol = calls.reduce((s, c) => s + (c.volume || 0), 0)
    const putVol = puts.reduce((s, c) => s + (c.volume || 0), 0)
    const callOi = calls.reduce((s, c) => s + (c.openInterest || 0), 0)
    const putOi = puts.reduce((s, c) => s + (c.openInterest || 0), 0)

    const pcVolumeRatio = callVol > 0 ? Math.round((putVol / callVol) * 100) / 100 : 0.85
    const pcOiRatio = callOi > 0 ? Math.round((putOi / callOi) * 100) / 100 : 0.90
    const sentiment = getSentimentStatus(pcVolumeRatio)

    return {
      symbol: symbol.toUpperCase(),
      name: data.name || `${symbol} Options Data`,
      price: data.underlyingPrice || 100,
      change: data.change || 0,
      changePercent: data.changePercent || 0,
      callVol,
      putVol,
      callOi,
      putOi,
      pcVolumeRatio,
      pcOiRatio,
      sentiment,
      maxPain: data.summary?.maxPain || data.underlyingPrice || 100,
    }
  } catch (err) {
    console.warn(`Failed to fetch P/C metrics for ${symbol}: ${err.message}`)
    return {
      symbol: symbol.toUpperCase(),
      name: `${symbol} ETF / Stock`,
      price: 150.0,
      change: 0.5,
      changePercent: 0.35,
      callVol: 45000,
      putVol: 38000,
      callOi: 180000,
      putOi: 155000,
      pcVolumeRatio: 0.84,
      pcOiRatio: 0.86,
      sentiment: getSentimentStatus(0.84),
      maxPain: 150.0,
    }
  }
}
