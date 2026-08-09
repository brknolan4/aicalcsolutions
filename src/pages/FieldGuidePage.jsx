import { BookOpen, Check, FileSpreadsheet, HelpCircle, Info, Sliders, TrendingUp, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdSlot from '../components/AdSlot'
import Seo from '../components/Seo'
import { absoluteUrl, faqSchema, webAppSchema } from '../lib/seo'

const FIELD_DEFINITIONS = [
  {
    key: 'contractSymbol',
    title: 'Contract Symbol',
    category: 'Identification',
    symbol: 'OCC Code',
    shortDesc: 'The standardized Options Clearing Corporation (OCC) contract ticker identifier.',
    fullDesc: 'The OCC Option Contract Symbol encodes the root stock ticker, expiration date, option type (Call or Put), and strike price into a single 21-character string.',
    example: 'AAPL260821C00190000',
    breakdown: [
      { part: 'AAPL', meaning: 'Root Stock Ticker (Apple Inc.)' },
      { part: '260821', meaning: 'Expiration Date: August 21, 2026 (YYMMDD)' },
      { part: 'C', meaning: 'Option Type: Call (P = Put)' },
      { part: '00190000', meaning: 'Strike Price: $190.00 (padded with zeroes to 8 digits)' },
    ],
  },
  {
    key: 'optionType',
    title: 'Option Type (CALL / PUT)',
    category: 'Contract Basics',
    symbol: 'CALL | PUT',
    shortDesc: 'Specifies whether the contract is a Call option or a Put option.',
    fullDesc: 'CALL options give the buyer the right (not obligation) to BUY 100 shares of the stock at the strike price before expiration. PUT options give the buyer the right to SELL 100 shares at the strike price.',
    example: 'Bullish strategy: Buy $200 CALL when stock is $195. Bearish strategy: Buy $190 PUT when stock is $195.',
  },
  {
    key: 'strike',
    title: 'Strike Price',
    category: 'Contract Basics',
    symbol: '$ Strike',
    shortDesc: 'The predetermined price at which the underlying stock can be bought or sold upon exercising.',
    fullDesc: 'The strike price is fixed when the contract is issued. For a Call option, you profit if the stock rises above the strike. For a Put option, you profit if the stock drops below the strike.',
    example: 'Stock is $225. A $220 Call is In-The-Money (ITM by $5). A $230 Call is Out-of-The-Money (OTM by $5).',
  },
  {
    key: 'lastPrice',
    title: 'Last Price (Premium)',
    category: 'Pricing',
    symbol: '$ Last',
    shortDesc: 'The most recent market price per share paid for the option contract.',
    fullDesc: 'Options are quoted on a per-share basis. Because 1 standard option contract controls 100 shares of stock, multiply the quoted Last Price by 100 to determine the total contract cost.',
    example: 'If Last Price = $4.50, buying 1 contract costs $4.50 × 100 = $450.00 total premium.',
  },
  {
    key: 'bidAsk',
    title: 'Bid / Ask & Spread',
    category: 'Market Liquidity',
    symbol: 'Bid / Ask',
    shortDesc: 'Bid is the highest price buyers offer; Ask is the lowest price sellers accept.',
    fullDesc: 'The Bid-Ask spread represents the market maker transaction cost. A tight spread (e.g. Bid $2.10 / Ask $2.12) indicates high liquidity and easy execution. A wide spread (e.g. $2.00 / $2.50) indicates illiquidity.',
    example: 'Bid $3.40 / Ask $3.50 $\rightarrow$ Midpoint price is $3.45. Buying at Market Ask costs $350 per contract.',
  },
  {
    key: 'change',
    title: 'Change ($ & %)',
    category: 'Pricing',
    symbol: 'Δ Price ($ / %)',
    shortDesc: 'The price fluctuation of the option contract premium since the previous session close.',
    fullDesc: 'Shows how much the contract premium has gained or lost today relative to yesterday’s closing price.',
    example: 'Last price today = $6.20. Previous close = $5.00. Change = +$1.20 (+24.0%).',
  },
  {
    key: 'volume',
    title: 'Volume',
    category: 'Market Activity',
    symbol: 'Vol',
    shortDesc: 'The total number of contracts traded during the current trading session.',
    fullDesc: 'Volume measures daily trading activity. Spikes in volume signal unusual institutional trading, catalyst announcements, or heightened market interest.',
    example: 'Volume = 14,250 contracts traded today indicates very active trading.',
  },
  {
    key: 'openInterest',
    title: 'Open Interest (OI)',
    category: 'Market Activity',
    symbol: 'OI',
    shortDesc: 'The total number of active, outstanding option contracts that remain open.',
    fullDesc: 'Unlike stock shares which are fixed, option contracts are created or destroyed when buyers and sellers open/close positions. High Open Interest indicates established liquidity and key support/resistance levels.',
    example: 'Open Interest = 45,000 contracts at $200 Strike $\rightarrow$ Heavy position concentration.',
  },
  {
    key: 'iv',
    title: 'Implied Volatility (IV %)',
    category: 'Volatility & Pricing',
    symbol: 'IV %',
    shortDesc: 'The market’s annualized forecast of expected stock price fluctuation.',
    fullDesc: 'Implied Volatility is derived from market option prices using pricing models. High IV inflates option premiums (common before earnings reports). After major news, IV drops ("IV Crush"), reducing option prices.',
    example: 'Stock IV = 45.5% before earnings. After earnings announcement, IV drops to 22.0%, causing contract premiums to shrink even if stock price barely moved.',
  },
  {
    key: 'delta',
    title: 'Delta (Δ)',
    symbol: 'Δ Delta',
    category: 'Option Greeks',
    shortDesc: 'Measures expected change in option price for a $1.00 move in the underlying stock.',
    fullDesc: 'Delta ranges from 0.0 to +1.0 for Calls, and 0.0 to -1.0 for Puts. Delta also serves as an approximate estimate of the probability that the option will expire In-The-Money.',
    example: 'Stock price = $200. Call Delta = +0.60. If stock rises to $201 (+$1.00), the Call price rises by ~$0.60 (+$60 total contract value).',
  },
  {
    key: 'gamma',
    title: 'Gamma (Γ)',
    symbol: 'Γ Gamma',
    category: 'Option Greeks',
    shortDesc: 'Measures the rate of change in Delta for a $1.00 move in the underlying stock.',
    fullDesc: 'Gamma represents the acceleration of Delta. At-The-Money (ATM) options expiring soon have the highest Gamma, meaning Delta changes rapidly when stock moves.',
    example: 'Call Delta = 0.50. Gamma = 0.06. If stock rises by $1.00, the new Delta becomes 0.50 + 0.06 = 0.56.',
  },
  {
    key: 'theta',
    title: 'Theta (Θ)',
    symbol: 'Θ Theta',
    category: 'Option Greeks',
    shortDesc: 'Measures daily time decay — the dollar loss in contract value per calendar day.',
    fullDesc: 'Theta is negative for option buyers because options lose time value every day approaching expiration. Time decay accelerates rapidly during the final 30 days before expiration.',
    example: 'Theta = -0.12. If option is held for 1 day with no stock movement, the premium loses $0.12 ($12.00 per contract).',
  },
  {
    key: 'vega',
    title: 'Vega (ν)',
    symbol: 'ν Vega',
    category: 'Option Greeks',
    shortDesc: 'Measures option price change per 1% change in Implied Volatility.',
    fullDesc: 'Vega shows sensitivity to volatility. Longer-dated contracts (high DTE) have much higher Vega than short-dated weekly options.',
    example: 'Vega = 0.25. If Implied Volatility increases by 2.0% (e.g. 25% $\rightarrow$ 27%), option premium increases by $0.25 × 2 = +$0.50 ($50 per contract).',
  },
  {
    key: 'rho',
    title: 'Rho (ρ)',
    symbol: 'ρ Rho',
    category: 'Option Greeks',
    shortDesc: 'Measures option price sensitivity per 1% change in risk-free interest rates.',
    fullDesc: 'Rho measures interest rate sensitivity. Call options generally benefit from higher interest rates, while Put options decline in value.',
    example: 'Rho = 0.08. If the Federal Reserve raises interest rates by 1.0%, Call premium increases by ~$0.08.',
  },
  {
    key: 'itm',
    title: 'ITM / OTM Moneyness',
    symbol: 'Status',
    category: 'Contract Basics',
    shortDesc: 'In-The-Money (ITM) vs Out-of-The-Money (OTM) status relative to stock price.',
    fullDesc: 'ITM options possess intrinsic value. OTM options contain zero intrinsic value and consist entirely of extrinsic (time) value.',
    example: 'Stock = $150. A $140 Call is ITM by $10. A $160 Call is OTM by $10.',
  },
  {
    key: 'maxPain',
    title: 'Max Pain Strike',
    symbol: 'Max Pain',
    category: 'Market Analytics',
    shortDesc: 'The strike price where option buyers collectively suffer the maximum financial loss at expiration.',
    fullDesc: 'Max Pain theory suggests that market makers hedge positions so stock prices tend to gravitate toward the strike price where the highest total value of options expire worthless.',
    example: 'Stock is trading at $218. Max Pain strike calculated at $210 $\rightarrow$ Stock price may drift toward $210 approaching Friday expiration.',
  },
  {
    key: 'pcRatio',
    title: 'Put / Call Ratio (Volume & OI)',
    symbol: 'P/C Ratio',
    category: 'Market Analytics',
    shortDesc: 'Ratio comparing Put volume or Open Interest to Call volume or Open Interest.',
    fullDesc: 'A Put/Call ratio > 1.0 indicates bearish sentiment (more Puts traded than Calls). A Put/Call ratio < 0.7 indicates bullish sentiment. Extremes often act as contrarian indicators.',
    example: 'Put Volume = 80,000 | Call Volume = 50,000 $\rightarrow$ Put/Call Ratio = 80,000 / 50,000 = 1.60 (Bearish skew).',
  },
]

export default function FieldGuidePage() {
  const seoSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      webAppSchema({
        name: 'Stock Options Field Guide & Header Reference',
        url: absoluteUrl('/field-guide'),
        description: 'Complete field guide and dictionary explaining stock options metrics, Option Greeks (Delta, Gamma, Theta, Vega, Rho), and CSV output headers.',
      }),
      faqSchema([
        {
          question: 'What is Delta in options trading?',
          answer: 'Delta measures how much an option price is expected to change for a $1 move in the stock. For example, a Call with 0.50 Delta increases by $0.50 if the stock rises $1.00.',
        },
        {
          question: 'What is Theta in options trading?',
          answer: 'Theta measures daily time decay. It represents the dollar amount an option contract loses in value each day approaching expiration.',
        },
      ]),
    ],
  }

  return (
    <div className="app-wrapper field-guide-container">
      <Seo
        title="Stock Options Field Guide & Dictionary: Option Greeks & Data Headers Explained"
        description="Comprehensive stock options field dictionary. Detailed descriptions and real-world examples for Contract Symbols, Volume, Open Interest, IV, Delta, Gamma, Theta, Vega, and Rho."
        canonical={absoluteUrl('/field-guide')}
        schema={seoSchema}
      />

      {/* Hero Header */}
      <section className="landing-hero guide-page-hero">
        <span className="hero-eyebrow">
          <BookOpen size={14} /> Comprehensive Field Dictionary & Reference Guide
        </span>
        <h1 className="hero-headline">
          Stock Options <em>Field Guide</em> & Definitions
        </h1>
        <p className="hero-sub">
          Detailed explanations, real-world numerical examples, and mathematical formulas for every data field, metric, and Option Greek ($\Delta$, $\Gamma$, $\Theta$, $\nu$, $\rho$) exported in your CSV downloads.
        </p>

        <div className="hero-cta-group">
          <Link to="/" className="cta-btn cta-link">
            <FileSpreadsheet size={16} /> Open Options Extractor Tool
          </Link>
        </div>
      </section>

      {/* Field Glossary Cards */}
      <section className="field-guide-grid-section glass-panel">
        <div className="guide-section-intro">
          <h2>Option Output Headers & Greeks Explained</h2>
          <p>Click any topic below to view full details, breakdown, and practical examples.</p>
        </div>

        <div className="field-cards-stack">
          {FIELD_DEFINITIONS.map((f) => (
            <div key={f.key} className="field-detail-card" id={f.key}>
              <div className="field-card-top">
                <div className="field-title-badge">
                  <h3>{f.title}</h3>
                  <span className="category-pill">{f.category}</span>
                </div>
                <span className="symbol-tag">{f.symbol}</span>
              </div>

              <p className="field-short">{f.shortDesc}</p>
              <p className="field-full">{f.fullDesc}</p>

              {f.breakdown && (
                <div className="field-breakdown-box">
                  <strong>Structure Breakdown:</strong>
                  <ul>
                    {f.breakdown.map((b, idx) => (
                      <li key={idx}>
                        <code>{b.part}</code> &mdash; {b.meaning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {f.example && (
                <div className="field-example-box">
                  <div className="example-header">
                    <Zap size={14} className="zap-icon" />
                    <strong>Real-World Numerical Example:</strong>
                  </div>
                  <p>{f.example}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <AdSlot id="guide-inline-bottom" />
    </div>
  )
}
