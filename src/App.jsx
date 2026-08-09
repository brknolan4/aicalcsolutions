import { useEffect, useState } from 'react'
import { ArrowRight, BarChart3, BookOpen, Calculator, Code2, DollarSign, FileSpreadsheet, Shield, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdSlot from './components/AdSlot'
import Seo from './components/Seo'
import FocusedControlBar from './components/calculator/FocusedControlBar'
import ResultHighlightRow from './components/calculator/ResultHighlightRow'
import { examplePrompts } from './data/pricingModels'
import useCalculatorState from './hooks/useCalculatorState'
import { absoluteUrl, faqSchema, webAppSchema } from './lib/seo'
import { fmt, fmtUsd } from './lib/calculatorUtils'
import './App.css'

const actionCards = [
  {
    to: '/options-extractor',
    icon: FileSpreadsheet,
    title: 'Options Data Extractor',
    body: 'Extract real-time stock options chains (Calls & Puts) into CSV files for Excel & Google Sheets.',
  },
  {
    to: '/token-calculator',
    icon: Calculator,
    title: 'Estimate token cost',
    body: 'Paste a real prompt or output and estimate what a single interaction will cost.',
  },
  {
    to: '/compare',
    icon: BarChart3,
    title: 'Compare AI models',
    body: 'See pricing, capabilities, and subscription economics across the major providers.',
  },
  {
    to: '/subscriptions',
    icon: Shield,
    title: 'Plan subscriptions',
    body: 'Figure out when flat-rate plans beat direct API billing for your workflow.',
  },
]

export default function App() {
  const calculator = useCalculatorState({ activeTab: 'summary' })
  const { derived } = calculator
  const [showCookieBanner, setShowCookieBanner] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      setShowCookieBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true')
    setShowCookieBanner(false)
  }

  const highlights = [
    { label: 'Monthly API estimate', value: fmtUsd(derived.totalApi), note: 'Based on the quick assumptions below' },
    { label: 'Annualized budget', value: fmtUsd(derived.annualApi), note: 'Useful for a yearly spend ceiling' },
    { label: 'Best value plan', value: derived.bestValue?.name || '—', note: derived.bestValue ? `${fmtUsd(derived.bestValue.price)}/mo` : 'No subscription available' },
  ]

  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      webAppSchema({
        name: 'AI Cost Calculator',
        url: absoluteUrl('/'),
        description: 'Estimate AI API costs, compare models, and evaluate subscriptions.',
      }),
      faqSchema([
        {
          question: 'How is AI API pricing calculated?',
          answer: 'The calculator estimates monthly and annual cost from sessions, input tokens, output tokens, and the selected model pricing.',
        },
        {
          question: 'What is the difference between input and output tokens?',
          answer: 'Input tokens are what you send to the model. Output tokens are what the model returns in its response.',
        },
      ]),
    ],
  }

  return (
    <div className="app-wrapper homepage-clean">
      <Seo
        title="AI Cost Calculator: Compare API, Tokens, and Subscription Pricing"
        description="Estimate AI API cost, compare model pricing, and decide when subscriptions beat direct billing."
        canonical={absoluteUrl('/')}
        schema={homeSchema}
      />
      <section className="landing-hero">
        <span className="hero-eyebrow"><Zap size={14} /> Free · No Sign-Up · Instant Results</span>
        <h1 className="hero-headline">
          What Should You <em>Actually Pay</em><br />for AI Each Month?
        </h1>
        <p className="hero-sub">
          A clean way to estimate AI spend across direct API pricing, flat-rate subscriptions, and real developer workflows.
          Start with a quick estimate, then jump into the tool that matches your question.
        </p>
        <div className="hero-cta-group">
          <Link to="/token-calculator" className="cta-btn cta-link">Start with token estimate</Link>
          <Link to="/compare" className="secondary-cta-link">Compare models <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="home-action-grid">
        {actionCards.map(({ to, icon: Icon, title, body }) => (
          <Link key={to} to={to} className="home-action-card glass-panel">
            <div className="home-action-icon"><Icon size={22} /></div>
            <h2>{title}</h2>
            <p>{body}</p>
            <span className="home-action-link">Open tool <ArrowRight size={14} /></span>
          </Link>
        ))}
      </section>

      <section className="home-quick-estimate">
        <div className="section-divider"></div>
        <div className="home-section-intro">
          <p className="content-eyebrow">Quick estimate</p>
          <h2>Get a fast answer without the full dashboard</h2>
          <p>Use the compact controls below for a rough monthly and annual estimate, then open the dedicated page for deeper analysis.</p>
        </div>

        <FocusedControlBar
          calculator={calculator}
          title="Quick workload assumptions"
          subtitle="Keep this lightweight on the homepage. If you need deeper analysis, jump into the focused tools above."
        />

        <ResultHighlightRow items={highlights} />
      </section>

      <AdSlot id="home-inline-top" />

      <section className="home-example-section glass-panel">
        <div className="home-section-intro">
          <p className="content-eyebrow">Example workloads</p>
          <h2>See how roles change token usage</h2>
          <p>Three real examples to help you sanity-check the quick estimate before opening a focused page.</p>
        </div>
        <div className="home-example-grid">
          {examplePrompts.slice(0, 3).map((example) => {
            const estimatedCost = derived.exCost(example.inputTokens, example.outputTokens)
            return (
              <div key={example.id} className="home-example-card">
                <div className="home-example-top">
                  <strong>{example.title}</strong>
                  <span className="role-badge">{example.category}</span>
                </div>
                <p>{example.description}</p>
                <div className="home-example-metrics">
                  <span>In {fmt(example.inputTokens)}</span>
                  <span>Out {fmt(example.outputTokens)}</span>
                  <span>{fmtUsd(estimatedCost)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="home-secondary-grid">
        <div className="content-card glass-panel home-guide-card">
          <p className="content-eyebrow">Use cases</p>
          <h2>Choose the right path</h2>
          <ul className="content-list compact-list">
            <li>If you want prompt pricing, open the Token Calculator</li>
            <li>If you want model tradeoffs, open Compare</li>
            <li>If you want plan recommendations, open Subscriptions</li>
          </ul>
        </div>

        <div className="content-card glass-panel home-guide-card">
          <p className="content-eyebrow">Content</p>
          <h2>Read the supporting guides</h2>
          <p>
            The new blog area will hold focused articles like ChatGPT Plus vs API cost, Claude Pro vs API,
            token estimation guides, and pricing strategy posts.
          </p>
          <div className="homepage-link-list">
            <Link to="/blog" className="content-link primary-link"><BookOpen size={15} /> Visit Blog hub</Link>
            <Link to="/subscriptions" className="content-link">See subscription planner</Link>
          </div>
        </div>
      </section>

      <section className="features-row home-feature-row">
        <div className="feature-card"><div className="feature-icon blue"><DollarSign size={24} /></div><h3>Exact API Math</h3><p>Real token pricing from OpenAI, Anthropic, Google, and more.</p></div>
        <div className="feature-card"><div className="feature-icon green"><Shield size={24} /></div><h3>Cleaner Navigation</h3><p>Focused pages for tokens, model compare, subscriptions, and guides.</p></div>
        <div className="feature-card"><div className="feature-icon amber"><BarChart3 size={24} /></div><h3>Planning-Friendly</h3><p>Quick monthly and annual estimates you can use for budgeting immediately.</p></div>
        <div className="feature-card"><div className="feature-icon purple"><Code2 size={24} /></div><h3>Built for power users</h3><p>Profiles for coding, research, analysis, and heavier AI-native workflows.</p></div>
      </section>

      <AdSlot id="home-inline-bottom" />

      {showCookieBanner && (
        <div className="cookie-banner">
          <div className="cookie-text">
            We use cookies to improve your experience and serve personalized ads. By using this site, you consent to our use of cookies as described in our Privacy Policy.
          </div>
          <button className="cookie-btn" onClick={acceptCookies}>Accept</button>
        </div>
      )}
    </div>
  )
}
