import { Link, useParams } from 'react-router-dom'
import AdSlot from '../components/AdSlot'
import Seo from '../components/Seo'
import { absoluteUrl, blogPostingSchema } from '../lib/seo'
import { blogPostBySlug, blogPosts } from '../content/blog/posts'

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = blogPostBySlug[slug]

  if (!post) {
    return (
      <div className="page-shell narrow-page">
        <section className="content-card glass-panel">
          <h1>Post not found</h1>
          <p>The requested article is not available yet.</p>
          <div className="content-actions">
            <Link to="/blog" className="content-link primary-link">Back to blog</Link>
          </div>
        </section>
      </div>
    )
  }

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2)
  const url = absoluteUrl(`/blog/${post.slug}`)

  return (
    <div className="page-shell narrow-page">
      <Seo
        title={`${post.title} | AI Calc Solutions`}
        description={post.description}
        canonical={url}
        schema={blogPostingSchema({
          headline: post.title,
          description: post.description,
          url,
          datePublished: post.datePublished,
          dateModified: post.dateModified,
        })}
      />

      <article className="content-card glass-panel blog-article">
        <p className="content-eyebrow">{post.category}</p>
        <h1>{post.title}</h1>
        <p className="blog-meta">Published {post.datePublished} · Updated {post.dateModified}</p>
        <p className="blog-excerpt">{post.excerpt}</p>

        <div className="blog-body">
          {post.body.map((block, index) => {
            if (block.type === 'h2') return <h2 key={index}>{block.text}</h2>
            return <p key={index}>{block.text}</p>
          })}
        </div>

        <div className="content-actions">
          <Link to="/token-calculator" className="content-link primary-link">Try the token calculator</Link>
          <Link to="/subscriptions" className="content-link">Open subscription planner</Link>
        </div>
      </article>

      <AdSlot id={`blog-${post.slug}`} />

      <section className="content-card glass-panel">
        <h2>Related articles</h2>
        <div className="blog-card-grid">
          {related.map((item) => (
            <Link key={item.slug} to={`/blog/${item.slug}`} className="blog-card">
              <span className="role-badge">{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
