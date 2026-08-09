export const fmt = (n) => n.toLocaleString()
export const fmtUsd = (n) => `$${Number(n || 0).toFixed(2)}`

export const modelCostForUsage = (model, sessions, inputTokens, outputTokens) => {
  if (!model) return 0
  return (sessions * inputTokens / 1e6) * model.inputPrice + (sessions * outputTokens / 1e6) * model.outputPrice
}

export const ratingStars = (rating) => (rating === 'Excellent' ? '⭐⭐⭐' : rating === 'Good' ? '⭐⭐' : '⭐')
export const speedColor = (speed) => (speed === 'Fast' ? '#22c55e' : speed === 'Medium' ? '#f59e0b' : '#ef4444')

export const tokenEstimateFromText = (text) => Math.ceil((text || '').length / 4)
