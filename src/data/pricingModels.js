export const apiModels = [
  { id: 'gpt-5-4', name: 'GPT-5.4', provider: 'OpenAI', inputPrice: 2.50, outputPrice: 15.00 },
  { id: 'gpt-5-4-mini', name: 'GPT-5.4 Mini', provider: 'OpenAI', inputPrice: 0.75, outputPrice: 4.50 },
  { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic', inputPrice: 3.00, outputPrice: 15.00 },
  { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', provider: 'Anthropic', inputPrice: 1.00, outputPrice: 5.00 },
  { id: 'gemini-3-1-pro', name: 'Gemini 3.1 Pro Preview', provider: 'Google', inputPrice: 2.00, outputPrice: 12.00 },
  { id: 'gemini-2-5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', inputPrice: 1.25, outputPrice: 10.00 },
  { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', inputPrice: 0.55, outputPrice: 2.19 },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', inputPrice: 0.14, outputPrice: 0.28 },
  { id: 'llama-3-3-70b', name: 'Llama 3.3 70B (Meta)', provider: 'Meta', inputPrice: 0.50, outputPrice: 0.50 },
  { id: 'llama-3-1-405b', name: 'Llama 3.1 405B', provider: 'Meta', inputPrice: 2.00, outputPrice: 2.00 },
  { id: 'qwen-2-5-72b', name: 'Qwen 2.5 72B', provider: 'Alibaba', inputPrice: 0.40, outputPrice: 0.40 },
  { id: 'mistral-large-2', name: 'Mistral Large 2', provider: 'Mistral', inputPrice: 2.00, outputPrice: 6.00 },
  { id: 'codestral', name: 'Codestral', provider: 'Mistral', inputPrice: 0.20, outputPrice: 0.60 },
  { id: 'sonar-pro', name: 'Sonar Pro', provider: 'Perplexity', inputPrice: 1.00, outputPrice: 1.00 },
  { id: 'o1', name: 'o1', provider: 'OpenAI', inputPrice: 15.00, outputPrice: 60.00 },
  { id: 'o3-mini', name: 'o3-mini', provider: 'OpenAI', inputPrice: 1.10, outputPrice: 4.40 },
  { id: 'grok-3', name: 'Grok 3', provider: 'xAI', inputPrice: 2.00, outputPrice: 10.00 },
];

export const subscriptions = [
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    provider: 'OpenAI',
    price: 20,
    type: 'app',
    confidence: 'high', 
    description: 'General consumer access with high usage limits for GPT-5.4 and image generation.',
    associatedModel: 'gpt-5-4',
    apiValueEstimate: [15, 30] 
  },
  {
    id: 'chatgpt-pro',
    name: 'ChatGPT Pro',
    provider: 'OpenAI',
    price: 200,
    type: 'app',
    confidence: 'high',
    description: 'Unlimited access to all models including o1 pro mode. Best for power users.',
    associatedModel: 'gpt-5-4',
    apiValueEstimate: [150, 250]
  },
  {
    id: 'claude-pro',
    name: 'Claude Pro',
    provider: 'Anthropic',
    price: 20,
    type: 'app',
    confidence: 'low',
    description: '5x more usage than free tier. Limit details are opaque — described as "more usage".',
    associatedModel: 'claude-sonnet-4-6',
    apiValueEstimate: [15, 25]
  },
  {
    id: 'claude-max',
    name: 'Claude Max',
    provider: 'Anthropic',
    price: 100,
    type: 'app',
    confidence: 'low',
    description: '5× to 20× more usage than Pro. Ideal for heavy agentic coding sessions.',
    associatedModel: 'claude-sonnet-4-6',
    apiValueEstimate: [75, 150]
  },
  {
    id: 'google-ai-pro',
    name: 'Google AI Pro',
    provider: 'Google',
    price: 19.99,
    type: 'app',
    confidence: 'low',
    description: 'Access to Gemini Advanced and 2TB storage. Usage limits not explicitly published.',
    associatedModel: 'gemini-3-1-pro',
    apiValueEstimate: [15, 25]
  },
  {
    id: 'google-ai-ultra',
    name: 'Google AI Ultra',
    provider: 'Google',
    price: 249.99,
    type: 'app',
    confidence: 'low',
    description: 'Highest Gemini tier with maximum compute. Low-confidence on explicit capacity.',
    associatedModel: 'gemini-3-1-pro',
    apiValueEstimate: [180, 300]
  },
  {
    id: 'cursor-pro',
    name: 'Cursor Pro',
    provider: 'Cursor',
    price: 20,
    type: 'tool',
    confidence: 'exact',
    description: 'Includes explicit $20/month of frontier-model usage billed at API rates.',
    associatedModel: 'claude-sonnet-4-6',
    apiValueEstimate: [20, 20]
  },
  {
    id: 'cursor-pro-plus',
    name: 'Cursor Pro+',
    provider: 'Cursor',
    price: 60,
    type: 'tool',
    confidence: 'exact',
    description: 'Higher explicit credit pool for daily coding. Great for full-time developers.',
    associatedModel: 'claude-sonnet-4-6',
    apiValueEstimate: [60, 60]
  },
  {
    id: 'cursor-ultra',
    name: 'Cursor Ultra',
    provider: 'Cursor',
    price: 200,
    type: 'tool',
    confidence: 'exact',
    description: 'Top-tier $200 credit pool. Worth it only if your agentic usage exceeds $200/mo.',
    associatedModel: 'claude-sonnet-4-6',
    apiValueEstimate: [200, 200]
  }
];

export const providers = ['All', 'OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Meta', 'Mistral', 'Alibaba', 'Perplexity', 'xAI', 'Cursor'];

/*
  Token ratio guidance:
  - For coding, outputs are usually 2-4x larger than inputs.
    A short prompt ("build me a login form") → long code output.
  - For agentic/repo-wide tasks, inputs are large (full file context)
    and outputs are also large (rewritten files).
  - Typical ratios:
    • Light chat:      input 200 tokens  → output 400 tokens    (1:2)
    • Vibe coding:     input 500 tokens  → output 1,500 tokens  (1:3)
    • Heavy agent:     input 15,000 tokens → output 5,000 tokens (3:1, context-heavy)
*/
export const usageProfiles = {
  vibe: {
    name: 'Vibe Coder',
    icon: 'Coffee',
    description: 'Chat-style coding: write functions, explain code, quick edits.',
    sessionsPerMonth: 120,
    inputTokensPerSession: 800,
    outputTokensPerSession: 2400,
    toolUsagePercent: 10,
  },
  heavy: {
    name: 'Heavy Coder',
    icon: 'Code2',
    description: 'Agentic workflows: repo-wide edits, long debugging, Composer/Auto runs.',
    sessionsPerMonth: 250,
    inputTokensPerSession: 15000,
    outputTokensPerSession: 5000,
    toolUsagePercent: 60,
  },
  researcher: {
    name: 'Deep Researcher',
    icon: 'Search',
    description: 'Long document analysis, literature reviews, structured reports, multi-step synthesis.',
    sessionsPerMonth: 80,
    inputTokensPerSession: 12000,
    outputTokensPerSession: 6000,
    toolUsagePercent: 20,
  },
  marketer: {
    name: 'Marketer / Writer',
    icon: 'PenTool',
    description: 'Copy, campaigns, brand analysis, social content, SEO writing.',
    sessionsPerMonth: 150,
    inputTokensPerSession: 600,
    outputTokensPerSession: 1800,
    toolUsagePercent: 5,
  },
  analyst: {
    name: 'Data Analyst',
    icon: 'BarChart2',
    description: 'Financial modeling, SQL generation, data interpretation, structured JSON output.',
    sessionsPerMonth: 200,
    inputTokensPerSession: 5000,
    outputTokensPerSession: 3000,
    toolUsagePercent: 30,
  },
};

/*
  Example prompts to show users what real vibe-coding workflows look like
  and how tokens translate to cost.
*/
export const examplePrompts = [
  {
    id: 'quick-function',
    title: 'Quick Function Request',
    category: 'Vibe Coding',
    difficulty: 'Light',
    input: `Write me a JavaScript function that takes an array of objects with "name" and "score" properties, filters out any scores below 70, and returns the top 3 by score descending.`,
    inputTokens: 42,
    output: `function getTop3(students) {
  return students
    .filter(s => s.score >= 70)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// Example usage:
const students = [
  { name: "Alice", score: 95 },
  { name: "Bob", score: 62 },
  { name: "Carol", score: 88 },
  { name: "Dave", score: 74 },
  { name: "Eve", score: 91 }
];

console.log(getTop3(students));
// [{ name: "Alice", score: 95 }, { name: "Eve", score: 91 }, { name: "Carol", score: 88 }]`,
    outputTokens: 148,
    description: 'A simple prompt asking for a utility function. Typical of quick vibe-coding sessions — small input, moderate output.'
  },
  {
    id: 'react-component',
    title: 'Build a React Component',
    category: 'Vibe Coding',
    difficulty: 'Medium',
    input: `Build me a React component called PricingCard. It should accept props: title (string), price (number), features (array of strings), highlighted (boolean). Use modern CSS with a glass-morphism effect. If highlighted is true, add a blue border glow. Include a "Get Started" button.`,
    inputTokens: 68,
    output: `import React from 'react';

const PricingCard = ({ title, price, features, highlighted = false }) => {
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    border: highlighted ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '320px',
    boxShadow: highlighted ? '0 0 30px rgba(59, 130, 246, 0.2)' : 'none',
    transition: 'transform 0.3s ease',
  };

  return (
    <div style={cardStyle} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        \${price}<span style={{ fontSize: '1rem', opacity: 0.6 }}>/mo</span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
        {features.map((f, i) => (
          <li key={i} style={{ padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
            ✓ {f}
          </li>
        ))}
      </ul>
      <button style={{
        width: '100%', padding: '0.75rem', borderRadius: '10px', border: 'none',
        background: highlighted ? '#3b82f6' : 'rgba(255,255,255,0.1)',
        color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer'
      }}>
        Get Started
      </button>
    </div>
  );
};

export default PricingCard;`,
    outputTokens: 380,
    description: 'A medium prompt asking for a styled React component. Output is ~5.6× the input — typical for "build me X" vibe prompts.'
  },
  {
    id: 'debug-session',
    title: 'Debug a Broken API Route',
    category: 'Debugging',
    difficulty: 'Medium',
    input: `My Next.js API route at /api/users is returning a 500 error. Here's the code:

export default async function handler(req, res) {
  const users = await db.query('SELECT * FROM users WHERE active = true');
  const mapped = users.map(u => ({
    id: u.id,
    name: u.first_name + ' ' + u.last_name,
    email: u.email,
    joined: u.created_at.toISOString()
  }));
  res.status(200).json(mapped);
}

The error log says: "Cannot read properties of null (reading 'toISOString')". Some users have null created_at values. How do I fix this and make it more robust?`,
    inputTokens: 165,
    output: `The error occurs because some users have \`null\` for \`created_at\`, and you're calling \`.toISOString()\` on null.

**Here's the fixed and more robust version:**

\`\`\`js
export default async function handler(req, res) {
  try {
    const users = await db.query('SELECT * FROM users WHERE active = true');
    
    const mapped = users.map(u => ({
      id: u.id,
      name: [u.first_name, u.last_name].filter(Boolean).join(' ') || 'Unknown',
      email: u.email || null,
      joined: u.created_at ? new Date(u.created_at).toISOString() : null
    }));

    res.status(200).json({ data: mapped, count: mapped.length });
  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
\`\`\`

**What changed:**
1. Added null check on \`created_at\` before calling \`.toISOString()\`
2. Wrapped in try/catch for proper error handling
3. Added \`new Date()\` wrapper in case \`created_at\` is a string
4. Used \`filter(Boolean).join()\` for safer name concatenation
5. Wrapped response in a \`{ data, count }\` envelope for better API design`,
    outputTokens: 270,
    description: 'A debugging prompt with context code pasted in. Input is larger because it includes the broken code. Output explains the fix + provides corrected code.'
  },
  {
    id: 'full-page',
    title: 'Full Landing Page Build',
    category: 'Vibe Coding',
    difficulty: 'Heavy',
    input: `Build me a complete landing page for a SaaS product called "ShipFast". It should have:
- A hero section with headline, subtitle, CTA button, and a gradient background
- A features grid with 4 cards (icons, titles, descriptions)  
- A pricing section with 3 tiers (Starter $19, Pro $49, Enterprise $99)
- A testimonials section with 3 quotes
- A footer with links
Use React, modern CSS, and make it look premium. Dark mode. Use Inter font.`,
    inputTokens: 110,
    output: '(Full landing page component with ~350 lines of JSX, inline styles, gradient backgrounds, responsive grid layouts, testimonial cards, pricing table, and footer — approximately 1,800 tokens of output)',
    outputTokens: 1800,
    description: 'A heavy vibe-coding prompt requesting an entire page. Input is short but output is massive — 16× ratio. This is the kind of session that burns through subscription limits fast.'
  },
  {
    id: 'financial-analysis',
    title: 'Financial Analysis with Structured Output',
    category: 'Research',
    difficulty: 'Heavy',
    input: `You are a financial analyst AI. I'm providing you with 5 years of annual report data for a mid-cap SaaS company (AppFlow Inc). Analyze the following metrics and return a structured JSON report:

Revenue: 2020: $12M, 2021: $18M, 2022: $27M, 2023: $38M, 2024: $52M
Gross Margin: 68%, 70%, 72%, 74%, 75%
ARR Growth YoY: -, 50%, 50%, 40.7%, 36.8%
Churn Rate: 8%, 7%, 6%, 5.5%, 5%
Cash Burn/mo: $800K, $1.1M, $900K, $600K, -$200K (profitable)
Headcount: 45, 72, 110, 145, 180

Please produce:
1. A structured JSON object with all metrics normalized
2. A trend analysis narrative (growth acceleration/deceleration)
3. Rule of 40 scores for each year
4. A 3-year forward projection (conservative, base, aggressive scenarios)
5. Comparable SaaS valuation at 8x, 12x, and 16x ARR multiples
6. Key investment risks and strengths`,
    inputTokens: 380,
    output: `{
  "company": "AppFlow Inc",
  "analysis_date": "2025-04",
  "metrics": {
    "2020": { "revenue": 12000000, "gross_margin": 0.68, "arr_growth": null, "churn": 0.08, "rule_of_40": null },
    "2021": { "revenue": 18000000, "gross_margin": 0.70, "arr_growth": 0.50, "churn": 0.07, "rule_of_40": 43 },
    "2022": { "revenue": 27000000, "gross_margin": 0.72, "arr_growth": 0.50, "churn": 0.06, "rule_of_40": 47 },
    "2023": { "revenue": 38000000, "gross_margin": 0.74, "arr_growth": 0.407, "churn": 0.055, "rule_of_40": 41 },
    "2024": { "revenue": 52000000, "gross_margin": 0.75, "arr_growth": 0.368, "churn": 0.05, "rule_of_40": 39 }
  },
  "trend_analysis": "AppFlow demonstrates a classic SaaS growth deceleration curve — from hyper-growth (50% YoY) toward sustainable scale (~37%). Rule of 40 scores above 39 throughout indicate strong unit economics. The shift to profitability in 2024 (-$200K burn/mo) is a significant inflection point signaling operational efficiency...",
  "projections": {
    "conservative": { "2025": 67600000, "2026": 81120000, "2027": 93288000 },
    "base":         { "2025": 72800000, "2026": 90272000, "2027": 108326400 },
    "aggressive":   { "2025": 78000000, "2026": 101400000, "2027": 131820000 }
  },
  "valuations": {
    "at_8x_arr":  { "2024_value": 416000000, "note": "Discount for decelerating growth" },
    "at_12x_arr": { "2024_value": 624000000, "note": "Base case for Rule-of-40 company" },
    "at_16x_arr": { "2024_value": 832000000, "note": "Premium for accelerating margins" }
  },
  "risks": ["Growth deceleration from 50% → 37%", "Competitive pressure in SMB SaaS", "Churn stabilizing at 5% — needs to reach <3% for Series C premium"],
  "strengths": ["Six consecutive years of Rule-of-40 compliance", "Profitability achieved at sub-200 headcount", "75% gross margins vs 65% SaaS median"]
}`,
    outputTokens: 820,
    description: 'A deep research prompt feeding 5 years of financial data and requesting multi-format structured output: JSON, narrative analysis, forward projections, and valuation ranges. Typical of how analysts use frontier models for quarterly research.'
  },
  {
    id: 'market-research',
    title: 'Competitive Market Research Report',
    category: 'Research',
    difficulty: 'Heavy',
    input: `Act as a senior market research analyst. I need a comprehensive competitive analysis of the AI coding assistant market for a board presentation. Structure your output as a professional report covering:

1. Market Overview: TAM, SAM, SOM estimates for AI coding tools (2024-2028)
2. Competitive Landscape: Map the top 8 players (GitHub Copilot, Cursor, Codeium, Tabnine, Amazon CodeWhisperer, Replit AI, JetBrains AI, Sourcegraph Cody) across axes: pricing, model quality, IDE integration, enterprise features
3. Pricing Architecture Analysis: Compare freemium vs. subscription vs. API-credit models
4. User Segment Analysis: Identify top 4 buyer personas and their decision criteria
5. Key Trends: What is driving adoption in 2025? (Agentic workflows, context windows, etc.)
6. Strategic Recommendations: For a new entrant targeting enterprise developers

Format as executive summary + detailed sections with bullet points. Be specific with numbers where available.`,
    inputTokens: 210,
    output: `# AI Coding Assistant Market: Competitive Intelligence Report
**Prepared for Board Review | April 2025**

## Executive Summary
The AI coding assistant market is projected to grow from $4.8B (2024) to $23.6B by 2028, representing a 48.8% CAGR. GitHub Copilot maintains ~40% market share by revenue, but Cursor's usage-based model is rapidly capturing the "power developer" segment. The shift to agentic, multi-file editing is the defining competitive battleground of 2025.

## 1. Market Sizing
- **TAM** (all developer tools): $32B by 2028
- **SAM** (AI-augmented dev tools): $23.6B by 2028  
- **SOM** (realistic capture for new entrant): $450-800M by 2028 targeting enterprise

## 2. Competitive Landscape
| Player | Pricing | Model | IDE Coverage | Enterprise |
|--------|---------|-------|--------------|------------|
| GitHub Copilot | $19/mo | GPT-4o + custom | All major | ✅ Strong |
| Cursor | $20-200/mo | Claude/GPT multi | VS Code only | 🔶 Growing |
| Codeium | Free/$12 | Proprietary | 40+ IDEs | 🔶 Mid |
| Amazon Q | $19/mo | Custom | AWS-focused | ✅ Strong |

## 3. Pricing Architecture Trends
The market is bifurcating: **consumer subscriptions** (flat-rate, broad access) vs. **API-credit models** (Cursor's explicit $X/mo pool). The credit model wins with power users who want cost transparency...

## 4. Strategic Recommendations
1. Target the "agentic workflow" segment — 73% of enterprise devs report this as top unmet need
2. Offer explicit credit transparency (Cursor model) over opaque "unlimited"
3. Lead with security/compliance for regulated industries (finance, healthcare)`,
    outputTokens: 750,
    description: 'A multi-section research prompt requesting structured market analysis with quantitative estimates, competitive tables, and strategic recommendations. This is how marketing teams and consultants use frontier LLMs for board-level deliverables.'
  }
];
