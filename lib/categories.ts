// The content clusters.
//
// Split out of lib/articles.ts so that client components can import it. articles.ts imports the
// generated MDX barrel, so anything importing it from the browser would pull every compiled
// article into the client bundle in order to render a menu. This module is pure data.

/**
 * Content clusters, taken from the site's real Search Console data rather than invented.
 *
 * The split is the important part. `bypass` is the cluster our extension genuinely solves, it is a
 * small share of impressions but nearly all of the clicks. The `file-types` cluster is an order of
 * magnitude more impressions and converts at approximately nothing, because someone asking whether
 * ChatGPT reads mp4 has a problem this product does not touch. Both are worth serving. Only one is
 * worth pushing hard, and the CTA strength per cluster reflects that.
 */
// `label` is what a reader sees on the page. `seoTitle` is what goes in <title>, and they are
// deliberately different: "Comparisons" is a perfectly good heading once you are already on the
// site, and a useless search result. Google gives a title roughly 55 to 60 characters; a
// hub page called "Limits by plan" was spending fourteen of them.
export const CATEGORIES = {
  bypass: {
    slug: 'bypass-upload-limits',
    label: 'Getting past the limits',
    /** Two or three words, for the navigation bar where the full label will not fit. */
    short: 'Upload limits',
    seoTitle: 'How to Get Past ChatGPT File Upload Limits',
    blurb: 'Practical fixes for files ChatGPT refuses to take.',
    ctaStrength: 'strong',
  },
  'file-types': {
    slug: 'file-types',
    label: 'What ChatGPT accepts',
    short: 'File types',
    seoTitle: 'ChatGPT Supported File Types: What It Can Read',
    blurb: 'Straight answers on which formats work, which do not, and what to do instead.',
    ctaStrength: 'soft',
  },
  errors: {
    slug: 'errors',
    label: 'Error messages explained',
    short: 'Errors',
    seoTitle: 'ChatGPT File Upload Errors and How to Fix Them',
    blurb: 'The exact message you hit, what causes it, and how to get past it.',
    ctaStrength: 'strong',
  },
  limits: {
    slug: 'limits',
    label: 'Limits by plan',
    short: 'Limits',
    seoTitle: 'ChatGPT Upload Limits by Plan: Free, Plus, Pro, Team',
    blurb: 'What Free, Plus, Pro and Team actually allow.',
    ctaStrength: 'medium',
  },
  workflows: {
    slug: 'workflows',
    label: 'Working with documents',
    short: 'Workflows',
    seoTitle: 'How to Work With Documents in ChatGPT',
    blurb: 'Getting better results once the file is in.',
    ctaStrength: 'medium',
  },
  compare: {
    slug: 'comparisons',
    label: 'Comparisons',
    short: 'Comparisons',
    seoTitle: 'ChatGPT vs the Alternatives for Long Documents',
    blurb: 'How ChatGPT stacks up against the alternatives for document work.',
    ctaStrength: 'soft',
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
export type CtaStrength = (typeof CATEGORIES)[CategoryKey]['ctaStrength'];

export const CATEGORY_ORDER = Object.keys(CATEGORIES) as CategoryKey[];

export function categoryHref(key: CategoryKey): string {
  return `/guides/${CATEGORIES[key].slug}`;
}
