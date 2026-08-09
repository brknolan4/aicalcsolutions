/**
 * Standard Normal Probability Density Function N'(x)
 */
function normPdf(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
}

/**
 * Standard Normal Cumulative Distribution Function N(x)
 * Polynomial approximation (Abramowitz & Stegun formula 26.2.17)
 */
function normCdf(x) {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = x < 0 ? -1 : 1
  const absX = Math.abs(x) / Math.sqrt(2.0)
  const t = 1.0 / (1.0 + p * absX)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX)

  return 0.5 * (1.0 + sign * y)
}

/**
 * Calculate Black-Scholes Option Greeks.
 *
 * @param {'CALL'|'PUT'} type Option type
 * @param {number} S Underlying stock price
 * @param {number} K Option strike price
 * @param {number} DTE Days to expiration
 * @param {number} iv Implied Volatility (decimal e.g. 0.25 for 25%)
 * @param {number} r Risk-free interest rate (default 0.045 = 4.5%)
 * @returns {{ delta: number, gamma: number, theta: number, vega: number, rho: number }}
 */
export function calculateGreeks(type, S, K, DTE, iv, r = 0.045) {
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
  const vega = (sPrice * Math.sqrt(T) * pdfD1) / 100.0 // Change per 1% change in IV

  let delta = 0
  let theta = 0
  let rho = 0

  if (type.toUpperCase() === 'CALL') {
    delta = cdfD1
    const thetaAnn = -(sPrice * pdfD1 * v) / (2 * Math.sqrt(T)) - r * strike * Math.exp(-r * T) * cdfD2
    theta = thetaAnn / 365.0 // Per calendar day decay
    rho = (strike * T * Math.exp(-r * T) * cdfD2) / 100.0
  } else {
    delta = cdfD1 - 1.0
    const thetaAnn = -(sPrice * pdfD1 * v) / (2 * Math.sqrt(T)) + r * strike * Math.exp(-r * T) * cdfNegD2
    theta = thetaAnn / 365.0 // Per calendar day decay
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
