import { useEffect } from 'react'

function ensureTag(selector, createTag) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = createTag()
    document.head.appendChild(el)
  }
  return el
}

export default function Seo({ title, description, canonical, image = 'https://aicalcsolutions.com/banner.png', schema }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const metaDescription = ensureTag('meta[name="description"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('name', 'description')
      return el
    })
    metaDescription.setAttribute('content', description)

    const canonicalLink = ensureTag('link[rel="canonical"]', () => {
      const el = document.createElement('link')
      el.setAttribute('rel', 'canonical')
      return el
    })
    canonicalLink.setAttribute('href', canonical)

    const ogTitle = ensureTag('meta[property="og:title"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'og:title')
      return el
    })
    ogTitle.setAttribute('content', title)

    const ogDescription = ensureTag('meta[property="og:description"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'og:description')
      return el
    })
    ogDescription.setAttribute('content', description)

    const ogUrl = ensureTag('meta[property="og:url"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'og:url')
      return el
    })
    ogUrl.setAttribute('content', canonical)

    const ogImage = ensureTag('meta[property="og:image"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'og:image')
      return el
    })
    ogImage.setAttribute('content', image)

    const twitterTitle = ensureTag('meta[property="twitter:title"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'twitter:title')
      return el
    })
    twitterTitle.setAttribute('content', title)

    const twitterDescription = ensureTag('meta[property="twitter:description"]', () => {
      const el = document.createElement('meta')
      el.setAttribute('property', 'twitter:description')
      return el
    })
    twitterDescription.setAttribute('content', description)

    let schemaEl = document.head.querySelector('script[data-hermes-seo="page-schema"]')
    if (schema) {
      if (!schemaEl) {
        schemaEl = document.createElement('script')
        schemaEl.type = 'application/ld+json'
        schemaEl.setAttribute('data-hermes-seo', 'page-schema')
        document.head.appendChild(schemaEl)
      }
      schemaEl.textContent = JSON.stringify(schema)
    } else if (schemaEl) {
      schemaEl.remove()
    }

    return () => {
      document.title = previousTitle
    }
  }, [title, description, canonical, image, schema])

  return null
}
