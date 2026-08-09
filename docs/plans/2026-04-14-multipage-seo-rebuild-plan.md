# AI Calculator Multipage SEO Rebuild Plan

> For Hermes: Use subagent-driven-development skill to implement this plan task-by-task.

Goal: Convert the current single-page AI calculator into a multipage, search-friendly site with reusable calculator data, crawlable comparison/tool pages, a blog area, and preserved Google Ads placeholders.

Architecture: Keep the existing React UI logic and pricing dataset, but reorganize the app into route-based pages with shared layout, SEO metadata per page, reusable calculator modules, and a simple content system for blog posts. The first version should prioritize static crawlable pages over perfect polish.

Tech Stack: React, Vite, React Router, shared JSON/JS pricing data, static public assets, optional markdown-or-JS content modules for blog posts.

---

## Phase 1 — Foundation and routing

### Task 1: Add route architecture
Objective: Introduce route-based navigation so key content becomes crawlable and indexable.

Files:
- Modify: `/Users/brendy/AI Calculator/package.json`
- Modify: `/Users/brendy/AI Calculator/src/main.jsx`
- Create: `/Users/brendy/AI Calculator/src/router.jsx`

Plan:
1. Add `react-router-dom` dependency.
2. Replace direct `App` render in `main.jsx` with a router provider.
3. Define routes for:
   - `/`
   - `/token-calculator`
   - `/compare`
   - `/subscriptions`
   - `/blog`
   - `/blog/:slug`
   - `/tools/chatgpt-cost-calculator`
   - `/tools/claude-cost-calculator`
   - `/tools/gemini-cost-calculator`
   - `/tools/cursor-vs-api-calculator`
   - `/privacy`
   - `/terms`
   - `/about`
   - `/contact`
4. Keep route names simple and keyword-aligned.

Verification:
- `npm run build`
- Open each route locally and confirm it renders without a 404 in dev mode.

### Task 2: Create shared site layout
Objective: Build a reusable shell so every page has consistent nav, footer, ad placeholders, and internal links.

Files:
- Create: `/Users/brendy/AI Calculator/src/components/SiteLayout.jsx`
- Create: `/Users/brendy/AI Calculator/src/components/SiteHeader.jsx`
- Create: `/Users/brendy/AI Calculator/src/components/SiteFooter.jsx`
- Create: `/Users/brendy/AI Calculator/src/components/AdSlot.jsx`
- Modify: `/Users/brendy/AI Calculator/src/App.css`

Plan:
1. Extract the existing ad placeholder block into `AdSlot`.
2. Create a top nav with links to Calculator, Compare, Subscriptions, Blog, About.
3. Create a footer with real links to Privacy, Terms, Contact, About.
4. Preserve current ad placeholder visuals and IDs so Google Ads wiring can be swapped in later.
5. Add a “related tools/articles” area capability for later reuse.

Verification:
- All pages render with shared header/footer.
- Existing ad placeholders still appear.

### Task 3: Convert modal-only legal content into real pages
Objective: Improve crawlability and trust by moving legal/help text into dedicated routes.

Files:
- Create: `/Users/brendy/AI Calculator/src/pages/PrivacyPage.jsx`
- Create: `/Users/brendy/AI Calculator/src/pages/TermsPage.jsx`
- Create: `/Users/brendy/AI Calculator/src/pages/AboutPage.jsx`
- Create: `/Users/brendy/AI Calculator/src/pages/ContactPage.jsx`
- Modify: `/Users/brendy/AI Calculator/src/App.jsx`

Plan:
1. Remove modal-only dependency for privacy/terms from homepage UX.
2. Reuse the existing copy as first-pass page content.
3. Add crawlable links in header/footer.
4. Keep contact email visible.

Verification:
- `/privacy`, `/terms`, `/about`, `/contact` all render directly.

---

## Phase 2 — Break homepage into reusable calculator modules

### Task 4: Extract calculator state and utilities
Objective: Make calculator logic reusable across multiple pages without duplicating code.

Files:
- Create: `/Users/brendy/AI Calculator/src/lib/calculatorUtils.js`
- Create: `/Users/brendy/AI Calculator/src/hooks/useCalculatorState.js`
- Modify: `/Users/brendy/AI Calculator/src/App.jsx`

Plan:
1. Move formatting and cost logic out of `App.jsx`.
2. Move shared calculator state into a custom hook.
3. Keep current functionality identical.
4. Ensure modules can be embedded on homepage and focused tool pages.

Verification:
- Homepage outputs match current values for default profile/model.
- Build passes.

### Task 5: Split the homepage tab sections into reusable components
Objective: Turn existing sections into independently renderable modules.

Files:
- Create: `/Users/brendy/AI Calculator/src/components/calculator/CalculatorSidebar.jsx`
- Create: `/Users/brendy/AI Calculator/src/components/calculator/SummaryPanel.jsx`
- Create: `/Users/brendy/AI Calculator/src/components/calculator/ComparePanel.jsx`
- Create: `/Users/brendy/AI Calculator/src/components/calculator/ExamplesPanel.jsx`
- Create: `/Users/brendy/AI Calculator/src/components/calculator/SubscriptionsPanel.jsx`
- Modify: `/Users/brendy/AI Calculator/src/App.jsx`

Plan:
1. Extract each existing section from `App.jsx`.
2. Preserve current visuals first.
3. Allow each page to render a focused panel without needing the tabbed homepage.
4. Keep “Summary / Compare / Examples / Subscriptions” homepage tabs as a convenience layer.

Verification:
- Homepage still works.
- Each extracted panel can render on its own route.

---

## Phase 3 — Build search-focused landing pages

### Task 6: Create a stronger homepage
Objective: Keep `/` as the main marketing page while improving internal linking and search clarity.

Files:
- Create: `/Users/brendy/AI Calculator/src/pages/HomePage.jsx`
- Modify: `/Users/brendy/AI Calculator/index.html`
- Modify: `/Users/brendy/AI Calculator/src/App.jsx`

Plan:
1. Move homepage content into `HomePage.jsx`.
2. Add crawlable blocks linking to:
   - token calculator
   - compare page
   - subscriptions page
   - blog hub
   - provider-specific tool pages
3. Add a short FAQ section near the bottom.
4. Preserve hero and ad placeholders.

Verification:
- Homepage still feels like the current app, but now links into the site structure.

### Task 7: Create a dedicated token calculator page
Objective: Capture “token calculator” and “how many tokens” search intent.

Files:
- Create: `/Users/brendy/AI Calculator/src/pages/TokenCalculatorPage.jsx`

Plan:
1. Reuse token simulator component as the main content.
2. Add explanatory copy for:
   - what a token is
   - chars vs words vs tokens
   - prompt vs response cost
3. Add FAQ section.
4. Link back to main pricing calculator and provider pages.

Suggested SEO target:
- Title: `AI Token Calculator: Estimate Prompt and Response Cost`
- H1: `AI Token Calculator`

Verification:
- Page is focused and useful even without the rest of the dashboard.

### Task 8: Create comparison hub page
Objective: Capture comparison intent around API vs subscriptions and provider pricing.

Files:
- Create: `/Users/brendy/AI Calculator/src/pages/ComparePage.jsx`

Plan:
1. Render the extracted compare panel as the page core.
2. Add indexable intro sections such as:
   - ChatGPT vs Claude vs Gemini pricing
   - API vs subscription tradeoffs
   - best models by workload
3. Add links to provider-specific tool pages and blog posts.

Verification:
- `/compare` reads like a destination page, not just a hidden tab.

### Task 9: Create subscriptions page
Objective: Capture “AI subscription vs API” and “best plan” queries.

Files:
- Create: `/Users/brendy/AI Calculator/src/pages/SubscriptionsPage.jsx`

Plan:
1. Render subscriptions panel as main content.
2. Add explanatory sections around:
   - when subscriptions beat API
   - low/high confidence estimates
   - developer vs researcher use cases
3. Add CTA back to homepage calculator.

Verification:
- `/subscriptions` stands on its own.

### Task 10: Create provider-specific tool pages
Objective: Add high-intent landing pages for major search terms.

Files:
- Create: `/Users/brendy/AI Calculator/src/pages/tools/ChatGPTCostCalculatorPage.jsx`
- Create: `/Users/brendy/AI Calculator/src/pages/tools/ClaudeCostCalculatorPage.jsx`
- Create: `/Users/brendy/AI Calculator/src/pages/tools/GeminiCostCalculatorPage.jsx`
- Create: `/Users/brendy/AI Calculator/src/pages/tools/CursorVsApiCalculatorPage.jsx`

Plan:
1. Reuse calculator modules with preselected provider/model defaults.
2. Give each page unique intro copy and FAQs.
3. Suggested page purposes:
   - ChatGPT cost calculator: API vs Plus/Pro
   - Claude cost calculator: API vs Pro/Max
   - Gemini cost calculator: model tiers + large-context economics
   - Cursor vs API: tool credits vs direct API spending
4. Add “related articles” blocks to each.

Verification:
- Each page works independently and feels purpose-built.

---

## Phase 4 — Add SEO infrastructure

### Task 11: Add page-level metadata management
Objective: Give every route a unique title, description, canonical, and social metadata.

Files:
- Create: `/Users/brendy/AI Calculator/src/components/Seo.jsx`
- Modify: `/Users/brendy/AI Calculator/index.html`
- Modify: route pages created above

Plan:
1. Use a lightweight head manager approach for React/Vite.
2. Set per-page:
   - title
   - meta description
   - canonical
   - Open Graph title/description/image
   - Twitter title/description/card
3. Keep homepage image placeholder support.

Verification:
- Browser inspection shows unique metadata per route.

### Task 12: Add structured data
Objective: Improve rich-result eligibility and search understanding.

Files:
- Create: `/Users/brendy/AI Calculator/src/lib/schema.js`
- Modify: homepage and key route pages

Plan:
1. Add WebApplication schema to homepage and core calculator pages.
2. Add FAQPage schema where FAQs exist.
3. Add BreadcrumbList schema on nested tool/blog pages.
4. Add BlogPosting schema on article pages once blog is live.

Verification:
- JSON-LD appears on relevant pages.

### Task 13: Expand sitemap and robots support
Objective: Make new pages discoverable.

Files:
- Modify: `/Users/brendy/AI Calculator/public/sitemap.xml`
- Modify: `/Users/brendy/AI Calculator/public/robots.txt`

Plan:
1. Add all static pages to sitemap.
2. Include blog URLs once created.
3. Keep robots open.
4. Later, automate sitemap generation if page count grows.

Verification:
- Sitemap includes new routes.

---

## Phase 5 — Build blog system

### Task 14: Create blog content architecture
Objective: Add a simple blog area for publishing search-focused articles.

Files:
- Create: `/Users/brendy/AI Calculator/src/content/blog/index.js`
- Create: `/Users/brendy/AI Calculator/src/content/blog/posts/`
- Create: `/Users/brendy/AI Calculator/src/pages/BlogIndexPage.jsx`
- Create: `/Users/brendy/AI Calculator/src/pages/BlogPostPage.jsx`
- Create: `/Users/brendy/AI Calculator/src/components/blog/BlogCard.jsx`
- Create: `/Users/brendy/AI Calculator/src/components/blog/BlogLayout.jsx`

Plan:
1. Store posts as JS modules first for simplicity.
2. Each post should include:
   - slug
   - title
   - excerpt
   - publish date
   - updated date
   - category
   - SEO metadata
   - article body
3. Create blog hub page with cards and categories.
4. Create single-post route with related post links and calculator CTA.

Verification:
- `/blog` lists posts.
- `/blog/:slug` renders correctly.

### Task 15: Seed first 5 blog posts
Objective: Launch the blog with strong intent-driven content.

Files:
- Create first posts under `/Users/brendy/AI Calculator/src/content/blog/posts/`

Initial post set:
1. `chatgpt-plus-vs-api-cost-2026`
2. `claude-pro-vs-api-cost-2026`
3. `gemini-vs-openai-vs-anthropic-pricing`
4. `how-many-tokens-is-1000-words`
5. `best-ai-model-for-coding-by-budget`

Requirements for each post:
- 800–1500 words to start
- clear H1/H2 structure
- calculator CTA section
- internal links to at least 2 other pages
- FAQ block if appropriate

Verification:
- All 5 posts render and are linked from `/blog`.

### Task 16: Add blog-to-tool internal linking system
Objective: Turn blog traffic into calculator traffic.

Files:
- Modify: blog post layout/components
- Create: `/Users/brendy/AI Calculator/src/components/RelatedTools.jsx`
- Create: `/Users/brendy/AI Calculator/src/components/RelatedArticles.jsx`

Plan:
1. Add a reusable “Try the calculator” CTA block inside posts.
2. Add “related tools” and “related articles” sections at the end of each post.
3. Add reciprocal “learn more” blocks on tool pages.

Verification:
- Internal links connect homepage, tools, compare pages, and blog posts.

---

## Phase 6 — Content and monetization polish

### Task 17: Preserve and improve ad placeholder placement
Objective: Keep future AdSense integration simple without hurting usability.

Files:
- Modify: layout and page components

Plan:
1. Keep placeholder ad slots on:
   - homepage above fold lower section
   - between calculator sections
   - blog sidebar or between article sections
   - compare/subscriptions pages lower down
2. Do not place ads in a way that interrupts calculator inputs.
3. Standardize slot names/IDs.

Verification:
- Ads remain visible as placeholders with stable IDs.

### Task 18: Add “last updated” and source-trust blocks
Objective: Improve trust for pricing content.

Files:
- Modify: homepage, compare page, provider tool pages, blog layout

Plan:
1. Show “Updated April 2026” more consistently.
2. Add provider source references area.
3. Highlight confidence levels for non-explicit subscription estimates.

Verification:
- Trust signals appear on high-intent pages.

---

## Recommended execution order

1. Routing + shared layout
2. Real legal/help pages
3. Extract reusable calculator modules
4. Dedicated token / compare / subscriptions pages
5. Provider-specific calculator pages
6. SEO metadata + schema
7. Blog architecture
8. Seed first 5 posts
9. Expand sitemap
10. Linking + monetization polish

---

## Initial page map

Core:
- /
- /token-calculator
- /compare
- /subscriptions
- /blog
- /privacy
- /terms
- /about
- /contact

Tools:
- /tools/chatgpt-cost-calculator
- /tools/claude-cost-calculator
- /tools/gemini-cost-calculator
- /tools/cursor-vs-api-calculator

Blog starters:
- /blog/chatgpt-plus-vs-api-cost-2026
- /blog/claude-pro-vs-api-cost-2026
- /blog/gemini-vs-openai-vs-anthropic-pricing
- /blog/how-many-tokens-is-1000-words
- /blog/best-ai-model-for-coding-by-budget

---

## Success criteria

The rebuild is successful when:
- the site has 10+ crawlable URLs instead of 1
- each important query intent has a dedicated landing page
- homepage calculator still works and ad placeholders remain intact
- blog posts are publishable and internally linked
- sitemap reflects all public pages
- metadata/schema are unique per page
- the site is ready for ongoing content publishing without structural rework
