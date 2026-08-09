import { useEffect, useMemo, useState } from 'react'
import { apiModels, subscriptions, usageProfiles } from '../data/pricingModels'
import { modelCostForUsage, tokenEstimateFromText } from '../lib/calculatorUtils'

export default function useCalculatorState(initial = {}) {
  const [profile, setProfile] = useState(initial.profile || 'vibe')
  const [selectedModel, setSelectedModel] = useState(initial.selectedModel || 'gpt-5-4')
  const [sessions, setSessions] = useState(usageProfiles[initial.profile || 'vibe'].sessionsPerMonth)
  const [inputTokens, setInputTokens] = useState(usageProfiles[initial.profile || 'vibe'].inputTokensPerSession)
  const [outputTokens, setOutputTokens] = useState(usageProfiles[initial.profile || 'vibe'].outputTokensPerSession)
  const [providerFilter, setProviderFilter] = useState(initial.providerFilter || 'All')
  const [simInput, setSimInput] = useState('')
  const [simOutput, setSimOutput] = useState('')
  const [expandedExample, setExpandedExample] = useState(null)
  const [compareIds, setCompareIds] = useState(initial.compareIds || ['gpt-5-4', 'claude-sonnet-4-6', 'gemini-3-1-pro', 'o3-mini', 'deepseek-r1'])
  const [activeTab, setActiveTab] = useState(initial.activeTab || 'summary')

  useEffect(() => {
    const p = usageProfiles[profile]
    if (!p) return
    setSessions(p.sessionsPerMonth)
    setInputTokens(p.inputTokensPerSession)
    setOutputTokens(p.outputTokensPerSession)
  }, [profile])

  const model = useMemo(() => apiModels.find((m) => m.id === selectedModel) || apiModels[0], [selectedModel])

  const monthlyIn = sessions * inputTokens
  const monthlyOut = sessions * outputTokens
  const costIn = (monthlyIn / 1e6) * model.inputPrice
  const costOut = (monthlyOut / 1e6) * model.outputPrice
  const totalApi = costIn + costOut
  const annualApi = totalApi * 12
  const dailyApi = totalApi / 30
  const weeklyApi = totalApi / 4.33
  const tokenRatio = inputTokens > 0 ? (outputTokens / inputTokens).toFixed(1) : '—'

  const cheapestSub = [...subscriptions]
    .filter((s) => totalApi >= s.price)
    .sort((a, b) => a.price - b.price)[0]

  const bestValue = [...subscriptions]
    .map((s) => ({ ...s, ratio: ((s.apiValueEstimate[0] + s.apiValueEstimate[1]) / 2) / s.price }))
    .sort((a, b) => b.ratio - a.ratio)[0]

  const filteredSubs = [...subscriptions]
    .filter((s) => providerFilter === 'All' || s.provider === providerFilter)
    .sort((a, b) => a.price - b.price)

  const compareModels = compareIds.map((id) => apiModels.find((m) => m.id === id)).filter(Boolean)

  const simInChars = simInput.length
  const simInWords = simInput.trim() ? simInput.trim().split(/\s+/).length : 0
  const simInTokens = tokenEstimateFromText(simInput)
  const simInCost = (simInTokens / 1e6) * model.inputPrice

  const simOutChars = simOutput.length
  const simOutWords = simOutput.trim() ? simOutput.trim().split(/\s+/).length : 0
  const simOutTokens = tokenEstimateFromText(simOutput)
  const simOutCost = (simOutTokens / 1e6) * model.outputPrice

  const exCost = (inTok, outTok) => (inTok / 1e6) * model.inputPrice + (outTok / 1e6) * model.outputPrice

  const resetToProfileDefaults = () => {
    const p = usageProfiles[profile]
    if (!p) return
    setSessions(p.sessionsPerMonth)
    setInputTokens(p.inputTokensPerSession)
    setOutputTokens(p.outputTokensPerSession)
  }

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((x) => x !== id)
          : prev
        : prev.length < 5
          ? [...prev, id]
          : prev,
    )
  }

  return {
    state: {
      profile,
      selectedModel,
      sessions,
      inputTokens,
      outputTokens,
      providerFilter,
      simInput,
      simOutput,
      expandedExample,
      compareIds,
      activeTab,
    },
    actions: {
      setProfile,
      setSelectedModel,
      setSessions,
      setInputTokens,
      setOutputTokens,
      setProviderFilter,
      setSimInput,
      setSimOutput,
      setExpandedExample,
      setActiveTab,
      toggleCompare,
      resetToProfileDefaults,
    },
    derived: {
      model,
      monthlyIn,
      monthlyOut,
      costIn,
      costOut,
      totalApi,
      annualApi,
      dailyApi,
      weeklyApi,
      tokenRatio,
      cheapestSub,
      bestValue,
      filteredSubs,
      compareModels,
      simInChars,
      simInWords,
      simInTokens,
      simInCost,
      simOutChars,
      simOutWords,
      simOutTokens,
      simOutCost,
      exCost,
      modelCostForUsage,
    },
  }
}
