/**
 * Helper to escape strings safely for RFC-4180 CSV compliance.
 */
function escapeCsvCell(cellValue) {
  if (cellValue === null || cellValue === undefined) {
    return '""'
  }
  const str = String(cellValue)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Format options contracts into a CSV string compatible with Excel and Google Sheets.
 * Includes Option Greeks (Delta, Gamma, Theta, Vega, Rho).
 *
 * @param {Object} data Options data payload from /api/options
 * @param {Array} contracts Array of Call or Put option contracts to include
 * @param {String} exportType 'ALL' | 'CALLS' | 'PUTS'
 */
export function generateOptionsCsv(data, contracts, exportType = 'ALL') {
  const symbol = data.symbol || 'SYMBOL'
  const price = data.underlyingPrice || 0
  const expDate = data.selectedExpiration?.dateStr || 'N/A'
  const dte = data.selectedExpiration?.dte ?? 'N/A'
  const extractedAt = new Date().toISOString().split('T')[0]

  const headers = [
    'Symbol',
    'Underlying Price',
    'Contract Symbol',
    'Option Type',
    'Expiration Date',
    'Days To Exp',
    'Strike Price',
    'Last Price',
    'Bid',
    'Ask',
    'Change ($)',
    'Change (%)',
    'Volume',
    'Open Interest',
    'Implied Volatility (%)',
    'Delta',
    'Gamma',
    'Theta',
    'Vega',
    'Rho',
    'ITM Status',
    'Extracted Date',
  ]

  const rows = [headers.map(escapeCsvCell).join(',')]

  for (const c of contracts) {
    const ivPct = typeof c.impliedVolatility === 'number' ? (c.impliedVolatility * 100).toFixed(2) : '0.00'
    const itmStatus = c.inTheMoney ? 'ITM' : 'OTM'

    const delta = typeof c.delta === 'number' ? c.delta.toFixed(4) : '0.0000'
    const gamma = typeof c.gamma === 'number' ? c.gamma.toFixed(4) : '0.0000'
    const theta = typeof c.theta === 'number' ? c.theta.toFixed(4) : '0.0000'
    const vega = typeof c.vega === 'number' ? c.vega.toFixed(4) : '0.0000'
    const rho = typeof c.rho === 'number' ? c.rho.toFixed(4) : '0.0000'

    const row = [
      symbol,
      price.toFixed(2),
      c.contractSymbol || '',
      c.optionType || '',
      c.expiration || expDate,
      dte,
      Number(c.strike).toFixed(2),
      Number(c.lastPrice).toFixed(2),
      Number(c.bid).toFixed(2),
      Number(c.ask).toFixed(2),
      Number(c.change).toFixed(2),
      Number(c.percentChange).toFixed(2),
      c.volume || 0,
      c.openInterest || 0,
      ivPct,
      delta,
      gamma,
      theta,
      vega,
      rho,
      itmStatus,
      extractedAt,
    ]

    rows.push(row.map(escapeCsvCell).join(','))
  }

  return rows.join('\r\n')
}

/**
 * Triggers native browser download of formatted CSV file.
 */
export function downloadOptionsCsv(data, contracts, exportType = 'ALL') {
  const csvContent = generateOptionsCsv(data, contracts, exportType)
  const symbol = (data.symbol || 'OPTIONS').toUpperCase()
  const dateStr = data.selectedExpiration?.dateStr || 'chain'
  const typeSuffix = exportType.toLowerCase()

  const filename = `${symbol}_options_${typeSuffix}_${dateStr}.csv`

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
