import { Routes, Route } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'
import HomePage from './pages/HomePage'
import TokenCalculatorPage from './pages/TokenCalculatorPage'
import ComparePage from './pages/ComparePage'
import SubscriptionsPage from './pages/SubscriptionsPage'
import BlogIndexPage from './pages/BlogIndexPage'
import BlogPostPage from './pages/BlogPostPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PlaceholderPage from './pages/PlaceholderPage'
import OptionsExtractorPage from './pages/OptionsExtractorPage'
import FieldGuidePage from './pages/FieldGuidePage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="token-calculator"
          element={
            <TokenCalculatorPage
              title="AI Token Calculator"
              description="Estimate prompt and response tokens, then sync those values back into the full AI cost calculator."
            />
          }
        />
        <Route
          path="compare"
          element={
            <ComparePage
              title="AI Pricing Comparison"
              description="Compare model pricing, token costs, and subscription economics across major AI providers."
            />
          }
        />
        <Route
          path="subscriptions"
          element={
            <SubscriptionsPage
              title="AI Subscription vs API Pricing"
              description="See when monthly AI subscriptions beat direct API billing for your workflow."
            />
          }
        />
        <Route path="options-extractor" element={<OptionsExtractorPage />} />
        <Route path="tools/options-extractor" element={<OptionsExtractorPage />} />
        <Route path="field-guide" element={<FieldGuidePage />} />
        <Route path="fields" element={<FieldGuidePage />} />
        <Route path="blog" element={<BlogIndexPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route
          path="tools/chatgpt-cost-calculator"
          element={
            <PlaceholderPage
              title="ChatGPT Cost Calculator"
              description="This landing page is reserved for the dedicated ChatGPT pricing calculator. Phase 2 will connect the focused calculator module here."
            />
          }
        />
        <Route
          path="tools/claude-cost-calculator"
          element={
            <PlaceholderPage
              title="Claude Cost Calculator"
              description="This landing page is reserved for the dedicated Claude pricing calculator. Phase 2 will connect the focused calculator module here."
            />
          }
        />
        <Route
          path="tools/gemini-cost-calculator"
          element={
            <PlaceholderPage
              title="Gemini Cost Calculator"
              description="This landing page is reserved for the dedicated Gemini pricing calculator. Phase 2 will connect the focused calculator module here."
            />
          }
        />
        <Route
          path="tools/cursor-vs-api-calculator"
          element={
            <PlaceholderPage
              title="Cursor vs API Calculator"
              description="This landing page is reserved for the dedicated Cursor vs API cost calculator. Phase 2 will connect the focused calculator module here."
            />
          }
        />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  )
}
