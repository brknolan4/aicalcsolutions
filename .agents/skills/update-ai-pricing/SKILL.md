---
name: update-ai-pricing
description: Weekly or on-demand skill to research and update AI model pricing in pricingModels.js for the AI Cost Calculator at aicalcsolutions.com.
---

# Update AI Model Pricing

Use this skill to keep the `pricingModels.js` data file current with the latest API pricing from all supported providers. Run this weekly or whenever a provider announces a pricing change.

## Target File
`/Users/brendy/AI Calculator/src/data/pricingModels.js`

## Step 1: Research Current Pricing

Visit each provider's official pricing page and note the **input price** and **output price** per 1 million tokens for each model listed in `apiModels`. Use the `read_url_content` or `search_web` tool to fetch the latest data.

### Provider Pricing Pages (check these URLs)

| Provider | URL |
|----------|-----|
| OpenAI (GPT-5.4, GPT-5.4 Mini, o1, o3-mini) | https://openai.com/api/pricing |
| Anthropic (Claude Sonnet 4.6, Claude Haiku 4.5) | https://www.anthropic.com/pricing |
| Google (Gemini 3.1 Pro, Gemini 2.5 Pro) | https://ai.google.dev/pricing |
| DeepSeek (R1, V3) | https://api-docs.deepseek.com/quick_start/pricing |
| Meta / Llama (via Together AI or Groq) | https://www.together.ai/pricing |
| Alibaba / Qwen | https://www.alibabacloud.com/help/en/model-studio/getting-started/models |
| Mistral (Mistral Large 2, Codestral) | https://mistral.ai/technology/#pricing |
| Perplexity (Sonar Pro) | https://docs.perplexity.ai/guides/pricing |
| xAI (Grok 3) | https://x.ai/api |

## Step 2: Compare with Current Values

Read the current `pricingModels.js` to extract the existing `inputPrice` and `outputPrice` for each model in `apiModels`. Note any discrepancies.

## Step 3: Update the File

For any models where pricing has changed:

1. Open `/Users/brendy/AI Calculator/src/data/pricingModels.js`
2. Update the `inputPrice` and `outputPrice` fields for the affected model entries in the `apiModels` array.
3. All prices are in **USD per 1 million tokens**.
4. Update the date in the footer reference in `App.jsx` if the month has changed:
   - File: `/Users/brendy/AI Calculator/src/App.jsx`
   - Look for the line: `AI Cost Calculator · Pricing data sourced from official provider pages · Updated [Month Year]`
   - Change the month/year to the current date.

## Step 4: Add New Models (if applicable)

If a major new model has been released since the last update:

1. Add a new entry to the `apiModels` array in `pricingModels.js`:
```js
{ id: 'model-id', name: 'Model Name', provider: 'Provider', inputPrice: X.XX, outputPrice: X.XX },
```
2. If the provider is brand new, add it to the `providers` array as well.
3. Update the hero stat in `App.jsx` that shows the model count (search for `hero-stat-value` near "API Models Compared").

## Step 5: Commit and Deploy

Once changes are made, run the following commands to push to production:

```bash
git add src/data/pricingModels.js src/App.jsx
git commit -m "Update AI model pricing - [Month Year]"
git push origin main
```

Vercel will automatically deploy the update to `aicalcsolutions.com` within ~30 seconds of the push.

## Step 6: Verify

After the push, confirm the pricing is live by checking `https://www.aicalcsolutions.com` and selecting a recently updated model in the Base Model dropdown.

## Pricing Change Log

Keep a running record of changes here:

| Date | Model | Old Input | New Input | Old Output | New Output | Source |
|------|-------|-----------|-----------|------------|------------|--------|
| 2026-04-11 | All | — | Initial | — | Initial | Provider pages |
