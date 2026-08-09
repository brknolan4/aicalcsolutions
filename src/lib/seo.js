const SITE_URL = 'https://aicalcsolutions.com'

export const absoluteUrl = (path = '/') => new URL(path, SITE_URL).toString()

export const webAppSchema = ({ name, url, description }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url,
  description,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
})

export const faqSchema = (questions) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.map((q) => ({
    '@type': 'Question',
    name: q.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.answer,
    },
  })),
})

export const blogPostingSchema = ({ headline, description, url, datePublished, dateModified }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline,
  description,
  url,
  datePublished,
  dateModified,
  author: {
    '@type': 'Organization',
    name: 'AI Calc Solutions',
  },
  publisher: {
    '@type': 'Organization',
    name: 'AI Calc Solutions',
  },
})
