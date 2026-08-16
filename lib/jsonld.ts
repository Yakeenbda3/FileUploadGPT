// Structured data builders.
//
// All JSON-LD on the site is produced here, from the same values the visible page renders. That is
// the point: schema that is written by hand drifts from the page it describes, and Google treats a
// mismatch between structured data and visible content as a reason to drop the rich result and, in
// the worse cases, as a manual-action-grade problem.

import { SITE_NAME, SITE_URL, CHROME_STORE_URL, absoluteUrl } from './site';

/**
 * Serialise for embedding in a <script> tag.
 *
 * Escaping "<" is a genuine security control, not tidiness. Any string that reaches this, an
 * article title, an FAQ answer, is content; if one ever contained the literal text "</script>" the
 * browser would close the tag early and treat the rest of the JSON as markup. Escaping the angle
 * bracket makes that impossible while leaving the JSON valid, because < is the same character
 * to a JSON parser.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/images/logo.png'),
    description:
      'FileUploadGPT makes a free Chrome extension that lets ChatGPT work with documents that are too large to upload normally.',
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/**
 * The extension itself.
 *
 * `price: '0'` with a currency is the correct way to declare free software. Omitting the offer
 * entirely loses the "Free" annotation in results, and writing "Free" as the price is invalid.
 *
 * No `aggregateRating`. The listing has four ratings, and review snippets on that little data are
 * both unstable and, if they ever came from anywhere other than the store, a policy violation.
 */
export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'Chrome, Edge, Brave, and other Chromium browsers on desktop',
    url: CHROME_STORE_URL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  path: string;
  updated: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.path) },
    dateModified: input.updated,
    // A named author rather than a bare organisation, because Google's guidance on helpful content
    // is explicit about wanting content attributed to someone accountable for it.
    author: { '@type': 'Organization', name: `${SITE_NAME} editorial team`, url: SITE_URL },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/**
 * FAQ structured data.
 *
 * Only call this when the same questions and answers are VISIBLE on the page. Marking up an FAQ the
 * reader cannot see is a structured data policy violation, and it is an easy one to commit by
 * accident if the visible accordion and the schema are built from different arrays. Everything here
 * is fed from the article's single `faq` array for exactly that reason.
 */
export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
