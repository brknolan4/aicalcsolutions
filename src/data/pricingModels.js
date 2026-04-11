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
    description: 'Chat-style coding: write functions, explain code, quick edits.',
    sessionsPerMonth: 120,
    inputTokensPerSession: 800,
    outputTokensPerSession: 2400,
    toolUsagePercent: 10,
  },
  heavy: {
    name: 'Heavy Coder',
    description: 'Agentic workflows: repo-wide edits, long debugging, Composer/Auto runs.',
    sessionsPerMonth: 250,
    inputTokensPerSession: 15000,
    outputTokensPerSession: 5000,
    toolUsagePercent: 60,
  }
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
    id: 'repo-agent',
    title: 'Repo-Wide Agent Refactor',
    category: 'Agentic Coding',
    difficulty: 'Heavy',
    input: '(Agent reads 8 files of context: package.json, 3 component files, 2 utility modules, a config file, and a test file — then receives instruction: "Refactor all API calls to use a centralized fetch wrapper with retry logic and error handling. Update all imports. Add the wrapper to utils/api.js.")',
    inputTokens: 12000,
    output: '(Agent produces: new utils/api.js file, modifies 5 existing files with updated imports and refactored fetch calls, updates 1 test file — approximately 4,500 tokens of coordinated output)',
    outputTokens: 4500,
    description: 'A heavy agentic session where the AI reads your entire repo context (~12K input tokens) and produces coordinated edits across multiple files. This is where Cursor Ultra or Claude Max pays for itself.'
  }
];
