import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator, Zap, Coffee, Code2, User, TrendingDown,
  Settings, DollarSign, Activity, AlertTriangle, CheckCircle2,
  Info, RotateCcw, Trophy, BarChart3, Shield, ArrowDown,
  FileCode, ChevronDown, ChevronUp, X, Search, PenTool, BarChart2
} from 'lucide-react';
import { apiModels, subscriptions, usageProfiles, providers, examplePrompts } from './data/pricingModels';
import './App.css';

/* ── Tooltip helper ── */
const Tip = ({ icon: Icon, label, tooltip }) => (
  <label>
    {Icon && <Icon size={14} />}
    {label}
    <span className="info-icon">
      <Info size={13} />
      <span className="tooltip-container">{tooltip}</span>
    </span>
  </label>
);

/* ── Formatting helpers ── */
const fmt = n => n.toLocaleString();
const fmtUsd = n => `$${n.toFixed(2)}`;

/* ── Ad Slot component ── */
const AdSlot = ({ id }) => (
  <div className="ad-slot" id={`ad-slot-${id}`}>
    {/* Replace with: <ins class="adsbygoogle" data-ad-client="ca-pub-XXXXXXX" data-ad-slot="XXXXXXX" ... /> */}
    Ad Space
  </div>
);

function App() {
  const calcRef = useRef(null);

  /* ── State ── */
  const [profile, setProfile]           = useState('vibe');
  const [selectedModel, setSelectedModel] = useState('gpt-5-4');
  const [sessions, setSessions]         = useState(usageProfiles.vibe.sessionsPerMonth);
  const [inputTokens, setInputTokens]   = useState(usageProfiles.vibe.inputTokensPerSession);
  const [outputTokens, setOutputTokens] = useState(usageProfiles.vibe.outputTokensPerSession);
  const [providerFilter, setProviderFilter] = useState('All');

  /* Simulator */
  const [simInput, setSimInput]   = useState('');
  const [simOutput, setSimOutput] = useState('');

  /* Example prompts expand/collapse */
  const [expandedExample, setExpandedExample] = useState(null);

  /* Model Comparison */
  const [compareIds, setCompareIds] = useState(['gpt-5-4']);
  const toggleCompare = (id) => {
    setCompareIds(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(x => x !== id) : prev
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  /* Active dashboard tab */
  const [activeTab, setActiveTab] = useState('summary');

  /* Modal & Cookie State */
  const [activeModal, setActiveModal] = useState(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      setShowCookieBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieBanner(false);
  };

  useEffect(() => {
    const p = usageProfiles[profile];
    setSessions(p.sessionsPerMonth);
    setInputTokens(p.inputTokensPerSession);
    setOutputTokens(p.outputTokensPerSession);
  }, [profile]);

  /* ── Derived calcs ── */
  const model      = apiModels.find(m => m.id === selectedModel) || apiModels[0];
  const monthlyIn  = sessions * inputTokens;
  const monthlyOut = sessions * outputTokens;
  const costIn     = (monthlyIn  / 1e6) * model.inputPrice;
  const costOut    = (monthlyOut / 1e6) * model.outputPrice;
  const totalApi   = costIn + costOut;
  const annualApi  = totalApi * 12;
  const dailyApi   = totalApi / 30;
  const weeklyApi  = totalApi / 4.33;
  const tokenRatio = inputTokens > 0 ? (outputTokens / inputTokens).toFixed(1) : '—';

  /* Cheapest sub that beats API */
  const cheapestSub = [...subscriptions]
    .filter(s => totalApi >= s.price)
    .sort((a, b) => a.price - b.price)[0];

  /* Best value = highest mid-est / price */
  const bestValue = [...subscriptions]
    .map(s => ({ ...s, ratio: ((s.apiValueEstimate[0] + s.apiValueEstimate[1]) / 2) / s.price }))
    .sort((a, b) => b.ratio - a.ratio)[0];

  /* Filtered & sorted subs */
  const filteredSubs = [...subscriptions]
    .filter(s => providerFilter === 'All' || s.provider === providerFilter)
    .sort((a, b) => a.price - b.price);

  /* Simulator calcs */
  const simInChars   = simInput.length;
  const simInWords   = simInput.trim() ? simInput.trim().split(/\s+/).length : 0;
  const simInTokens  = Math.ceil(simInChars / 4);
  const simInCost    = (simInTokens / 1e6) * model.inputPrice;

  const simOutChars  = simOutput.length;
  const simOutWords  = simOutput.trim() ? simOutput.trim().split(/\s+/).length : 0;
  const simOutTokens = Math.ceil(simOutChars / 4);
  const simOutCost   = (simOutTokens / 1e6) * model.outputPrice;

  /* Example prompt cost helper */
  const exCost = (inTok, outTok) => {
    return (inTok / 1e6) * model.inputPrice + (outTok / 1e6) * model.outputPrice;
  };

  const scrollToCalc = () => calcRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="app-wrapper">

      {/* ━━━━━━━━━━ LANDING HERO ━━━━━━━━━━ */}
      <section className="landing-hero">
        <span className="hero-eyebrow"><Zap size={14} /> Free · No Sign-Up · Instant Results</span>
        <h1 className="hero-headline">
          What Should You <em>Actually Pay</em><br/>for AI Each Month?
        </h1>
        <p className="hero-sub">
          AI pricing is broken into API billing, consumer subscriptions, and tool-specific usage pools. 
          Even when the monthly price looks simple, the actual value is fuzzy. We cut through the noise 
          and show you <strong>exactly</strong> what each dollar buys — in tokens, sessions, and real workflows.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">17</div>
            <div className="hero-stat-label">API Models Compared</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">9</div>
            <div className="hero-stat-label">Subscription Plans</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">5</div>
            <div className="hero-stat-label">User Profiles</div>
          </div>
        </div>
        <div className="hero-cta">
          <button className="cta-btn" onClick={scrollToCalc}>
            <ArrowDown size={18} style={{marginRight: 6, verticalAlign: 'middle'}} />
            Calculate My True Cost
          </button>
        </div>
      </section>

      {/* ━━━━━━━━━━ FEATURES ROW ━━━━━━━━━━ */}
      <div className="features-row">
        <div className="feature-card">
          <div className="feature-icon blue"><DollarSign size={24} /></div>
          <h3>Exact API Math</h3>
          <p>Real token pricing from OpenAI, Anthropic & Google — no guesswork.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon green"><Shield size={24} /></div>
          <h3>Confidence Ratings</h3>
          <p>Every subscription estimate is tagged Exact, High, or Low confidence.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon amber"><BarChart3 size={24} /></div>
          <h3>Side-by-Side Comparisons</h3>
          <p>Compare plans, model abilities, and exact token costs natively side-by-side.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon purple"><Code2 size={24} /></div>
          <h3>Developer Profiles</h3>
          <p>Instant presets for vibe coders and heavy agentic workflows.</p>
        </div>
      </div>

      <div className="section-divider"></div>

      {/* ━━━━━━━━━━ AD SLOT 1 ━━━━━━━━━━ */}
      <AdSlot id="top" />

      {/* ━━━━━━━━━━ CALCULATOR ━━━━━━━━━━ */}
      <section className="calculator-section" ref={calcRef}>
        <div className="calc-section-header">
          <h2>AI Cost Calculator</h2>
          <p>Configure your usage on the left. Results update instantly.</p>
        </div>

        <div className="calc-layout">
          {/* ── SIDEBAR ── */}
          <aside className="sidebar">
            <div className="sidebar-title">
              <Calculator size={20} color="#3b82f6" /> Settings
            </div>

            <div className="input-group">
              <Tip icon={User} label="User Profile" 
                tooltip="Presets that auto-fill usage numbers based on your typical workflow. Pick the closest match to your role." />
              <div className="toggle-group profile-grid">
                <button className={`toggle-btn ${profile==='vibe'?'active':''}`} onClick={()=>setProfile('vibe')}>
                  <Coffee size={14}/> Vibe Coder
                </button>
                <button className={`toggle-btn ${profile==='heavy'?'active':''}`} onClick={()=>setProfile('heavy')}>
                  <Code2 size={14}/> Heavy Coder
                </button>
                <button className={`toggle-btn ${profile==='researcher'?'active':''}`} onClick={()=>setProfile('researcher')}>
                  <Search size={14}/> Researcher
                </button>
                <button className={`toggle-btn ${profile==='marketer'?'active':''}`} onClick={()=>setProfile('marketer')}>
                  <PenTool size={14}/> Marketer
                </button>
                <button className={`toggle-btn ${profile==='analyst'?'active':''}`} onClick={()=>setProfile('analyst')}>
                  <BarChart2 size={14}/> Analyst
                </button>
                <button className={`toggle-btn ${profile==='superheavy'?'active':''}`} onClick={()=>setProfile('superheavy')}>
                  <Zap size={14}/> Super Heavy
                </button>
              </div>
              {usageProfiles[profile] && (
                <p style={{fontSize:'0.72rem', color:'var(--text-secondary)', marginTop:'0.4rem', lineHeight:1.4}}>
                  {usageProfiles[profile].description}
                </p>
              )}
            </div>

            <div className="input-group">
              <Tip icon={Zap} label="Base Model" 
                tooltip="Select the AI model you use most. The two numbers shown are the API prices per 1 million tokens — Input price (what you send) / Output price (what the model replies with). Output is always more expensive. Example: $2.50 / $15.00 means $2.50 per 1M input tokens and $15.00 per 1M output tokens." />
              <select value={selectedModel} onChange={e=>setSelectedModel(e.target.value)}>
                {apiModels.map(m=>(
                  <option key={m.id} value={m.id}>
                    {m.provider}: {m.name} (In ${m.inputPrice} / Out ${m.outputPrice} per 1M)
                  </option>
                ))}
              </select>
              <p style={{fontSize:'0.7rem', color:'var(--text-secondary)', marginTop:'0.3rem'}}>
                Prices per 1 million tokens · In = prompt · Out = response
              </p>
            </div>

            <div className="input-group">
              <Tip icon={Activity} label="Monthly Sessions" 
                tooltip="Number of individual chat threads, coding tasks, or agent runs you do each month." />
              <input type="number" value={sessions} onChange={e=>setSessions(Number(e.target.value))} min="0" />
            </div>

            <div className="input-group">
              <Tip icon={Settings} label="Avg Input Tokens / Session" 
                tooltip="Size of each prompt. A short question ≈ 50 tokens. A code file ≈ 3,000–10,000 tokens." />
              <input type="number" value={inputTokens} onChange={e=>setInputTokens(Number(e.target.value))} step="500" min="0" />
            </div>

            <div className="input-group">
              <Tip icon={Settings} label="Avg Output Tokens / Session" 
                tooltip="Size of AI's response. A function ≈ 200 tokens. Full file rewrite ≈ 2,000–5,000 tokens." />
              <input type="number" value={outputTokens} onChange={e=>setOutputTokens(Number(e.target.value))} step="100" min="0" />
            </div>

            {/* Monthly usage summary */}
            <div className="monthly-summary">
              <div className="monthly-summary-row"><span>Total Input / mo</span><span>{fmt(monthlyIn)} tokens</span></div>
              <div className="monthly-summary-row"><span>Total Output / mo</span><span>{fmt(monthlyOut)} tokens</span></div>
              <div className="monthly-summary-row"><span>Output:Input ratio</span><span>{tokenRatio}×</span></div>
              <div className="monthly-summary-row"><span>Input cost</span><span>{fmtUsd(costIn)}</span></div>
              <div className="monthly-summary-row"><span>Output cost</span><span>{fmtUsd(costOut)}</span></div>
            </div>

            <button className="reset-btn" onClick={()=>{
              const p = usageProfiles[profile];
              setSessions(p.sessionsPerMonth);
              setInputTokens(p.inputTokensPerSession);
              setOutputTokens(p.outputTokensPerSession);
            }}>
              <RotateCcw size={14} style={{marginRight: 4, verticalAlign: 'middle'}} /> Reset to Defaults
            </button>
          </aside>

          {/* ── DASHBOARD ── */}
          <div className="dashboard">

            {/* Sticky Tab Nav */}
            <div className="dash-tabs">
              <button className={`dash-tab ${activeTab==='summary'?'active':''}`} onClick={()=>setActiveTab('summary')}>
                <DollarSign size={14}/> Summary
              </button>
              <button className={`dash-tab ${activeTab==='compare'?'active':''}`} onClick={()=>setActiveTab('compare')}>
                <BarChart3 size={14}/> Compare
              </button>
              <button className={`dash-tab ${activeTab==='examples'?'active':''}`} onClick={()=>setActiveTab('examples')}>
                <FileCode size={14}/> Examples
              </button>
              <button className={`dash-tab ${activeTab==='subs'?'active':''}`} onClick={()=>setActiveTab('subs')}>
                <Trophy size={14}/> Subscriptions
              </button>
            </div>

            {/* ──── TAB: SUMMARY ──── */}
            {activeTab === 'summary' && (
              <div className="dash-tab-content">
                <div className="summary-grid">
                  <div className="summary-card glass-panel primary">
                    <span className="card-label"><DollarSign size={14}/> Direct API / Month</span>
                    <div className="card-value">{fmtUsd(totalApi)}</div>
                    <div className="card-sub">{model.name} · In {fmtUsd(costIn)} + Out {fmtUsd(costOut)}</div>
                  </div>
                  <div className="summary-card glass-panel amber">
                    <span className="card-label"><BarChart3 size={14}/> Annualized API Cost</span>
                    <div className="card-value">{fmtUsd(annualApi)}</div>
                    <div className="card-sub">12 months at current usage</div>
                  </div>
                  <div className="summary-card glass-panel green">
                    <span className="card-label"><TrendingDown size={14}/> Cheapest Sub Alternative</span>
                    <div className="card-value">{cheapestSub ? cheapestSub.name : '—'}</div>
                    <div className="card-sub">{cheapestSub ? `${fmtUsd(cheapestSub.price)}/mo · saves ${fmtUsd(totalApi - cheapestSub.price)}/mo` : 'API is cheaper than all subscriptions'}</div>
                  </div>
                  <div className="summary-card glass-panel purple">
                    <span className="card-label"><Trophy size={14}/> Best Value Plan</span>
                    <div className="card-value">{bestValue ? bestValue.name : '—'}</div>
                    <div className="card-sub">{bestValue ? `${fmtUsd(bestValue.price)}/mo · ${bestValue.ratio.toFixed(1)}× value ratio` : 'N/A'}</div>
                  </div>
                </div>
                <div className="cost-breakdown-row">
                  <div className="breakdown-cell">
                    <span className="breakdown-label">Cost Per Day</span>
                    <span className="breakdown-value">{fmtUsd(dailyApi)}</span>
                    <span className="breakdown-sub">÷ 30 days</span>
                  </div>
                  <div className="breakdown-cell">
                    <span className="breakdown-label">Cost Per Week</span>
                    <span className="breakdown-value">{fmtUsd(weeklyApi)}</span>
                    <span className="breakdown-sub">÷ 4.33 weeks</span>
                  </div>
                  <div className="breakdown-cell">
                    <span className="breakdown-label">Cost Per Year</span>
                    <span className="breakdown-value">{fmtUsd(annualApi)}</span>
                    <span className="breakdown-sub">× 12 months</span>
                  </div>
                </div>
                <div className="simulator-section">
                  <h3>🧪 Token Simulator</h3>
                  <p>Paste a real prompt or expected response to estimate tokens and cost with {model.name}.</p>
                  <div className="sim-grid">
                    <div className="sim-card glass-panel input-side">
                      <div className="sim-card-title">Your Prompt (Input)</div>
                      <textarea className="token-textarea" placeholder="Paste your prompt, code, or context here…"
                        value={simInput} onChange={e=>setSimInput(e.target.value)} />
                      <div className="sim-stats">
                        <div className="sim-meta">
                          <strong>{fmt(simInTokens)}</strong> tokens<br/>
                          <span className="sim-cost">{fmt(simInChars)} chars · {fmt(simInWords)} words · ≈ {fmtUsd(simInCost)} per call</span>
                        </div>
                        <button className="btn-sync blue" onClick={()=>setInputTokens(simInTokens)}>Sync to Input</button>
                      </div>
                    </div>
                    <div className="sim-card glass-panel output-side">
                      <div className="sim-card-title">AI Response (Output)</div>
                      <textarea className="token-textarea" placeholder="Paste an expected AI response here…"
                        value={simOutput} onChange={e=>setSimOutput(e.target.value)} />
                      <div className="sim-stats">
                        <div className="sim-meta">
                          <strong>{fmt(simOutTokens)}</strong> tokens<br/>
                          <span className="sim-cost">{fmt(simOutChars)} chars · {fmt(simOutWords)} words · ≈ {fmtUsd(simOutCost)} per call</span>
                        </div>
                        <button className="btn-sync green" onClick={()=>setOutputTokens(simOutTokens)}>Sync to Output</button>
                      </div>
                    </div>
                  </div>
                </div>
                <AdSlot id="summary-bottom" />
              </div>
            )}

            {/* ──── TAB: COMPARE ──── */}
            {activeTab === 'compare' && (() => {
              const cols = compareIds.map(id => apiModels.find(m => m.id === id)).filter(Boolean);
              const colColors = ['#3b82f6','#8b5cf6','#f59e0b'];
              const modelCost = (m) => (sessions*inputTokens/1e6)*m.inputPrice + (sessions*outputTokens/1e6)*m.outputPrice;
              const speedColor = s => s==='Fast'?'#22c55e':s==='Medium'?'#f59e0b':'#ef4444';
              const ratingStars = r => r==='Excellent'?'⭐⭐⭐':r==='Good'?'⭐⭐':'⭐';
              return (
                <div className="dash-tab-content">
                  <h3>⚡ Model Comparison</h3>
                  <p style={{fontSize:'0.85rem',color:'var(--text-secondary)',marginBottom:'1rem'}}>Select up to 3 models. Costs use your current profile settings.</p>
                  <div className="compare-picker">
                    {apiModels.map(m => (
                      <button key={m.id} className={`model-pill ${compareIds.includes(m.id)?'selected':''}`} onClick={()=>toggleCompare(m.id)}>
                        {m.provider}: {m.name}
                      </button>
                    ))}
                  </div>
                  <div className="compare-table-wrap" style={{ width: 'fit-content', maxWidth: '100%', margin: '0' }}>
                    <div className="compare-grid" style={{gridTemplateColumns:`120px repeat(${cols.length}, minmax(130px, 220px))`}}>
                      <div className="compare-cell header-label"></div>
                      {cols.map((m,i) => <div key={m.id} className="compare-cell compare-header" style={{borderTop:`3px solid ${colColors[i]}`}}><div className="cmp-name">{m.name}</div><div className="cmp-provider">{m.provider}</div></div>)}
                      <div className="compare-cell row-label">Overall Rating</div>
                      {cols.map(m => <div key={m.id} className="compare-cell">{ratingStars(m.rating)} <span className={`rating-badge rating-${m.rating?.toLowerCase()}`}>{m.rating}</span></div>)}
                      <div className="compare-cell row-label">Response Speed</div>
                      {cols.map(m => <div key={m.id} className="compare-cell"><span style={{color:speedColor(m.speed),fontWeight:600}}>● {m.speed}</span></div>)}
                      <div className="compare-cell row-label">Context Window</div>
                      {cols.map(m => <div key={m.id} className="compare-cell cmp-context">{m.contextWindow}</div>)}
                      <div className="compare-cell row-label">Specialties</div>
                      {cols.map(m => <div key={m.id} className="compare-cell"><div className="specialty-pills">{m.specialties?.map(s=><span key={s} className="specialty-pill">{s}</span>)}</div></div>)}
                      <div className="compare-cell row-label">Input Price /1M</div>
                      {cols.map(m => <div key={m.id} className="compare-cell price-cell in">${m.inputPrice.toFixed(2)}</div>)}
                      <div className="compare-cell row-label">Output Price /1M</div>
                      {cols.map(m => <div key={m.id} className="compare-cell price-cell out">${m.outputPrice.toFixed(2)}</div>)}
                      <div className="compare-cell row-label">Daily API Cost</div>
                      {cols.map(m => <div key={m.id} className="compare-cell price-cell">{fmtUsd(modelCost(m)/30)}</div>)}
                      <div className="compare-cell row-label">Monthly API Cost</div>
                      {cols.map(m => <div key={m.id} className="compare-cell price-cell primary">{fmtUsd(modelCost(m))}</div>)}
                      <div className="compare-cell row-label">Annual API Cost</div>
                      {cols.map(m => <div key={m.id} className="compare-cell price-cell">{fmtUsd(modelCost(m)*12)}</div>)}
                      <div className="compare-cell row-label">Best For</div>
                      {cols.map(m => <div key={m.id} className="compare-cell cmp-bestfor">{m.bestFor}</div>)}
                      <div className="compare-cell row-label">Pros ✓</div>
                      {cols.map(m => <div key={m.id} className="compare-cell"><ul className="pro-con-list">{m.pros?.map((p,i)=><li key={i} className="pro-item">{p}</li>)}</ul></div>)}
                      <div className="compare-cell row-label">Cons ✗</div>
                      {cols.map(m => <div key={m.id} className="compare-cell"><ul className="pro-con-list">{m.cons?.map((c,i)=><li key={i} className="con-item">{c}</li>)}</ul></div>)}
                    </div>
                  </div>

                  {/* ── SUBSCRIPTION vs API COMPARISON ── */}
                  <div style={{marginTop:'2rem'}}>
                    <h4 style={{fontSize:'1rem',color:'var(--text-primary)',marginBottom:'0.35rem'}}>
                      💳 Subscription Plans vs Your API Cost
                    </h4>
                    <p style={{fontSize:'0.8rem',color:'var(--text-secondary)',marginBottom:'1rem'}}>
                      Monthly subscription prices with approximate token capacity based on each selected model's pricing.
                      Token estimates use the midpoint API-equivalent value ÷ model input price.
                    </p>
                    <div className="compare-table-wrap" style={{ width: 'fit-content', maxWidth: '100%', margin: '0' }}>
                      <table className="sub-compare-table">
                        <thead>
                          <tr>
                            <th>Plan</th>
                            <th>Mo. Cost</th>
                            <th>Ann. Cost</th>
                            {cols.map((m,i) => (
                              <th key={m.id} style={{borderTop:`3px solid ${colColors[i]}`}}>
                                {m.name} — Tokens &amp; Savings
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[...subscriptions].sort((a,b)=>a.price-b.price).map((sub, ri) => {
                            const midVal = (sub.apiValueEstimate[0] + sub.apiValueEstimate[1]) / 2;
                            return (
                              <tr key={sub.id} style={{background: ri%2===0 ? 'transparent' : 'rgba(255,255,255,0.015)'}}>
                                <td>
                                  <div style={{fontWeight:600,color:'var(--text-primary)',fontSize:'0.8rem'}}>{sub.name}</div>
                                  <div style={{fontSize:'0.68rem',color:'var(--text-secondary)'}}>{sub.provider}</div>
                                </td>
                                <td style={{fontWeight:700,color:'#60a5fa',whiteSpace:'nowrap'}}>{fmtUsd(sub.price)}/mo</td>
                                <td style={{color:'var(--text-secondary)',fontSize:'0.75rem',whiteSpace:'nowrap'}}>{fmtUsd(sub.price*12)}/yr</td>
                                {cols.map(m => {
                                  const tokEst = Math.round(midVal / m.inputPrice * 1e6);
                                  const tokStr = tokEst >= 1e6 ? `~${(tokEst/1e6).toFixed(1)}M` : `~${(tokEst/1e3).toFixed(0)}K`;
                                  const apiCost = modelCost(m);
                                  const saves = apiCost - sub.price;
                                  const better = saves > 0;
                                  return (
                                    <td key={m.id}>
                                      <div style={{fontWeight:600,color:'#a78bfa',fontSize:'0.8rem'}}>{tokStr} tokens</div>
                                      <div style={{fontSize:'0.68rem',color:'var(--text-secondary)',marginBottom:'0.25rem'}}>≈ {fmtUsd(sub.apiValueEstimate[0])}–{fmtUsd(sub.apiValueEstimate[1])} value</div>
                                      {better
                                        ? <span style={{color:'#4ade80',fontWeight:600,fontSize:'0.75rem'}}>✓ saves {fmtUsd(saves)}/mo vs API</span>
                                        : <span style={{color:'#f87171',fontWeight:600,fontSize:'0.75rem'}}>✗ API {fmtUsd(-saves)}/mo cheaper</span>
                                      }
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <AdSlot id="compare-bottom" />

                </div>
              );
            })()}

            {/* ──── TAB: EXAMPLES ──── */}
            {activeTab === 'examples' && (
              <div className="dash-tab-content">
                <div className="examples-section">
                  <h3>📋 Real-World Examples</h3>
                  <p>See what actual sessions look like — with token counts and costs using {model.name}.</p>
                  <div className="example-list">
                    {examplePrompts.map(ex => {
                      const isOpen = expandedExample === ex.id;
                      const cost = exCost(ex.inputTokens, ex.outputTokens);
                      const ratio = (ex.outputTokens / ex.inputTokens).toFixed(1);
                      const diffClass = ex.difficulty==='Light'?'diff-light':ex.difficulty==='Medium'?'diff-medium':'diff-heavy';
                      return (
                        <div key={ex.id} className="example-card" onClick={()=>setExpandedExample(isOpen?null:ex.id)}>
                          <div className="example-header">
                            <h4>
                              <FileCode size={16}/>{ex.title}
                              <span className={`diff-badge ${diffClass}`}>{ex.difficulty}</span>
                              <span className="diff-badge" style={{background:'rgba(124,58,237,0.15)',color:'#a78bfa',border:'1px solid rgba(124,58,237,0.3)'}}>{ex.category}</span>
                            </h4>
                            {isOpen?<ChevronUp size={18} color="var(--text-secondary)"/>:<ChevronDown size={18} color="var(--text-secondary)"/>}
                          </div>
                          <p className="example-desc">{ex.description}</p>
                          <div className="example-metrics">
                            <div className="example-metric"><span className="example-metric-label">Input</span><span className="example-metric-value blue">{fmt(ex.inputTokens)} tokens</span></div>
                            <div className="example-metric"><span className="example-metric-label">Output</span><span className="example-metric-value green">{fmt(ex.outputTokens)} tokens</span></div>
                            <div className="example-metric"><span className="example-metric-label">Ratio</span><span className="example-metric-value">{ratio}×</span></div>
                            <div className="example-metric"><span className="example-metric-label">API Cost</span><span className="example-metric-value purple">{fmtUsd(cost)}</span></div>
                          </div>
                          {isOpen && (
                            <div className="example-detail">
                              <div style={{marginBottom:'0.75rem'}}><div className="example-code-label">Input Prompt</div><div className="example-code">{ex.input}</div></div>
                              <div><div className="example-code-label">AI Output</div><div className="example-code">{ex.output}</div></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <AdSlot id="examples-bottom" />
              </div>
            )}

            {/* ──── TAB: SUBSCRIPTIONS ──── */}
            {activeTab === 'subs' && (
              <div className="dash-tab-content">
                <div>
                  <h3 style={{color:'var(--text-primary)',marginBottom:'0.75rem',fontSize:'1.1rem'}}>Subscription Breakdown</h3>
                  <div className="provider-filters">
                    {providers.map(p => <button key={p} className={`filter-pill ${providerFilter===p?'active':''}`} onClick={()=>setProviderFilter(p)}>{p}</button>)}
                  </div>
                </div>
                <div className="sub-list">
                  {filteredSubs.map(sub => {
                    const isWorthIt = totalApi > sub.price;
                    const badgeClass = sub.confidence==='exact'?'badge-exact':sub.confidence==='high'?'badge-high':'badge-low';
                    const SubIcon = sub.confidence==='exact'?CheckCircle2:AlertTriangle;
                    return (
                      <div key={sub.id} className="sub-item">
                        <div className="sub-info">
                          <h4>{sub.name}<span className={`badge ${badgeClass}`}><SubIcon size={10}/> {sub.confidence}</span></h4>
                          <p>{sub.description}</p>
                          <div className="equivalence">API-equivalent value: <strong style={{color:'#fff'}}>{fmtUsd(sub.apiValueEstimate[0])} – {fmtUsd(sub.apiValueEstimate[1])}</strong> /mo</div>
                          <div className={`break-even-text ${isWorthIt?'worth-it':''}`}>
                            {isWorthIt ? `✅ Your ${fmtUsd(totalApi)}/mo API usage exceeds this plan — subscription saves ${fmtUsd(totalApi-sub.price)}/mo.`
                              : `⚠️ At ${fmtUsd(totalApi)}/mo, direct API is ${fmtUsd(sub.price-totalApi)}/mo cheaper.`}
                          </div>
                        </div>
                        <div className="sub-price">
                          <div className="sub-price-val">{fmtUsd(sub.price)}</div>
                          <div className="sub-price-annual">{fmtUsd(sub.price*12)}/yr</div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredSubs.length===0 && <p style={{color:'var(--text-secondary)',textAlign:'center',padding:'2rem 0'}}>No subscriptions match this filter.</p>}
                </div>
                <AdSlot id="subs-bottom" />
              </div>
            )}

          </div>{/* end dashboard */}
        </div>{/* end calc-layout */}
      </section>

      {/* ━━━━━━━━━━ FOOTER ━━━━━━━━━━ */}
      <footer className="app-footer">
        <p>AI Cost Calculator · Pricing data sourced from official provider pages · Updated April 2026</p>
        <p style={{marginTop:'0.25rem', fontSize:'0.7rem'}}>Token estimates use a ~4 characters/token heuristic. Actual tokenization varies by model.</p>
        
        <div className="footer-links">
          <button className="footer-link" onClick={() => setActiveModal('privacy')}>Privacy Policy</button>
          <button className="footer-link" onClick={() => setActiveModal('tos')}>Terms of Service</button>
          <a href="mailto:brknolan4@gmail.com" className="footer-link">Contact</a>
        </div>
      </footer>

      {/* ━━━━━━━━━━ MODALS ━━━━━━━━━━ */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)}>
              <X size={20} />
            </button>
            {activeModal === 'privacy' && (
              <div>
                <h2>Privacy Policy</h2>
                <p>Welcome to AI Calc Solutions. We value your privacy and are committed to protecting your personal data. This policy explains how we collect and use data when you visit our website.</p>
                <p><strong>Third-Party Advertising:</strong> Third party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.</p>
                <p><strong>Opting Out:</strong> You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" style={{color: 'var(--accent-primary)'}}>Google Ads Settings</a>. We do not store any sensitive personal data or your actual AI prompts entered into the token simulator.</p>
                <p>For any questions regarding this policy, please contact us.</p>
              </div>
            )}
            {activeModal === 'tos' && (
              <div>
                <h2>Terms of Service & Disclaimer</h2>
                <p>By using the AI Cost Calculator, you agree to these terms.</p>
                <p><strong>Estimates Only:</strong> The pricing, token counts, and cost estimates provided by this tool are approximations meant for planning purposes only. We use general heuristic formulas (such as 4 characters per token) which may not exactly match the actual tokenization logic used by individual AI providers like OpenAI, Anthropic, or Google.</p>
                <p><strong>No Affiliation:</strong> AI Calc Solutions is an independent tool and is not affiliated with, endorsed by, or sponsored by OpenAI, Anthropic, Google, Cursor, or any other entity mentioned.</p>
                <p><strong>Limitation of Liability:</strong> We are not responsible for any actual billing discrepancies or unexpected API costs incurred by your usage of third-party AI services. Please verify all pricing directly with the providers before making financial decisions.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━ COOKIE BANNER ━━━━━━━━━━ */}
      {showCookieBanner && (
        <div className="cookie-banner">
          <div className="cookie-text">
            We use cookies to improve your experience and serve personalized ads. By using this site, you consent to our use of cookies as described in our Privacy Policy.
          </div>
          <button className="cookie-btn" onClick={acceptCookies}>Accept</button>
        </div>
      )}
    </div>
  );
}

export default App;
