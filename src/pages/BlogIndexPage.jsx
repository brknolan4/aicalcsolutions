import { Link } from 'react-router-dom'
import AdSlot from '../components/AdSlot'
import Seo from '../components/Seo'
import { absoluteUrl, webAppSchema } from '../lib/seo'
import { blogPosts } from '../content/blog/posts'

export default function BlogIndexPage() {
  return (
    <div className="page-shell narrow-page">
      <Seo
        title="AI Pricing Blog: Token, API, and Subscription Guides | AI Calc Solutions"
        description="Read practical guides on token pricing, ChatGPT vs API cost, Claude pricing, and AI subscription planning."
        canonical={absoluteUrl('/blog')}
        schema={webAppSchema({
          name: 'AI Calc Solutions Blog',
          url: absoluteUrl('/blog'),
          description: 'A library of AI pricing, token, and subscription planning guides.',
        })}
      />

      <section className="content-hero glass-panel">
        <p className="content-eyebrow">Blog hub</p>
        <h1>AI pricing guides and calculators</h1>
        <p>
          Search-focused articles that connect real pricing questions back into the calculators and comparison tools.
        </p>
      </section>

      <section className="content-card glass-panel">
        <h2>Latest articles</h2>
        <div className="blog-card-grid">
          {blogPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
              <span className="role-badge">{post.category}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <small>{post.datePublished}</small>
            </Link>
          ))}
        </div>
        <div className="content-actions">
          <Link to="/" className="content-link primary-link">Use the calculator</Link>
          <Link to="/compare" className="content-link">Compare model pricing</Link>
        </div>
      </section>

      <AdSlot id="blog-hub-inline" />
    </div>
  )
}
