// The article content model.
//
// Every article is one file: `content/articles/<slug>.mdx`, exporting a typed `meta` object and a
// default MDX body. `lib/articles.generated.ts` is a barrel of static imports over that directory,
// written by `scripts/build-article-index.mjs`, so the router, the sitemap, and the internal-link
// checker all read the same list and cannot drift apart.
//
// Nothing here is hand-maintained twice. Adding an article means adding one file and re-running the
// index script. Forgetting the script is caught by the build, not by a reader six weeks later.

import { ARTICLE_MODULES } from './articles.generated';

/**
 * Content clusters, taken from the site's real Search Console data rather than invented.
 *
 * The split is the important part. `bypass` is the cluster our extension genuinely solves, it is a
 * small share of impressions but nearly all of the clicks, and it converts at roughly 4%. The
 * `file-types` cluster is an order of magnitude more impressions and converts at approximately
 * nothing, because someone asking whether ChatGPT reads mp4 has a problem this product does not
 * touch. Both are worth serving. Only one is worth pushing hard, and the CTA strength per cluster
 * reflects that.
 */
export const CATEGORIES = {
  bypass: {
    slug: 'bypass-upload-limits',
    label: 'Getting past the limits',
    blurb: 'Practical fixes for files ChatGPT refuses to take.',
    ctaStrength: 'strong',
  },
  'file-types': {
    slug: 'file-types',
    label: 'What ChatGPT accepts',
    blurb: 'Straight answers on which formats work, which do not, and what to do instead.',
    ctaStrength: 'soft',
  },
  errors: {
    slug: 'errors',
    label: 'Error messages explained',
    blurb: 'The exact message you hit, what causes it, and how to get past it.',
    ctaStrength: 'strong',
  },
  limits: {
    slug: 'limits',
    label: 'Limits by plan',
    blurb: 'What Free, Plus, Pro and Team actually allow.',
    ctaStrength: 'medium',
  },
  workflows: {
    slug: 'workflows',
    label: 'Working with documents',
    blurb: 'Getting better results once the file is in.',
    ctaStrength: 'medium',
  },
  compare: {
    slug: 'comparisons',
    label: 'Comparisons',
    blurb: 'How ChatGPT stacks up against the alternatives for document work.',
    ctaStrength: 'soft',
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
export type CtaStrength = (typeof CATEGORIES)[CategoryKey]['ctaStrength'];

export interface ArticleMeta {
  /** URL segment. Must match the filename, which the index script enforces. */
  slug: string;
  /** The <title> tag. Written for the search result, so it leads with the answer, not the brand. */
  title: string;
  /** The <h1>. Allowed to differ from `title`, but must not contradict it. */
  heading: string;
  /** Meta description. Aim for 140 to 158 characters so Google does not truncate it. */
  description: string;
  category: CategoryKey;
  /** ISO date. Shown to readers and used for `dateModified` in Article JSON-LD. */
  updated: string;
  /** The search intent this page exists to answer. Kept for editorial review, never rendered. */
  targetQuery: string;
  /** Rendered as an FAQ block and as FAQPage structured data. */
  faq?: Array<{ q: string; a: string }>;
  /** Slugs of related articles. Validated against the index at build time. */
  related?: string[];
  /**
   * Set when the page's central claim depends on a fact that is not yet verified in
   * `lib/chatgpt-facts.ts`. The template renders a visible "last checked" notice instead of
   * stating the number flatly.
   */
  factKeys?: string[];
}

/** Identity function that exists purely so each .mdx file's `meta` is type-checked at the source. */
export function defineArticle(meta: ArticleMeta): ArticleMeta {
  return meta;
}

export interface ArticleModule {
  meta: ArticleMeta;
  default: React.ComponentType;
}

// @types/mdx types every .mdx file as a module with only a default export, so TypeScript cannot see
// the `meta` each of ours also exports. The cast asserts what the build already enforces from two
// other directions: scripts/build-article-index.mjs refuses to index a file with no `meta`, and
// assertArticleIntegrity() below checks the shape of every one of them before any page renders.
const MODULES = ARTICLE_MODULES as unknown as Record<string, ArticleModule>;

export function getAllArticleSlugs(): string[] {
  return Object.keys(MODULES).sort();
}

export function getArticle(slug: string): ArticleModule | null {
  return MODULES[slug] ?? null;
}

export function getAllArticles(): ArticleMeta[] {
  return getAllArticleSlugs().map((slug) => MODULES[slug].meta);
}

export function getArticlesByCategory(category: CategoryKey): ArticleMeta[] {
  return getAllArticles()
    .filter((a) => a.category === category)
    .sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Build-time consistency checks over the whole article set.
 *
 * Called from `generateStaticParams`, which means a violation fails the BUILD rather than shipping
 * a page with a broken related link or a category that renders as blank. Every one of these has a
 * matching real-world failure: a slug that disagreed with its filename produces a 404 on a page
 * that looks fine locally, and a `related` pointing at a deleted article produces a dead internal
 * link that no crawler report will attribute back to here.
 */
export function assertArticleIntegrity(): void {
  const slugs = new Set(getAllArticleSlugs());

  for (const slug of slugs) {
    const { meta } = MODULES[slug];

    if (meta.slug !== slug) {
      throw new Error(
        `[articles] content/articles/${slug}.mdx declares slug "${meta.slug}". ` +
          `The filename is the URL, so these must match.`
      );
    }

    if (!(meta.category in CATEGORIES)) {
      throw new Error(
        `[articles] "${slug}" has category "${meta.category}", which is not in CATEGORIES. ` +
          `Add it there or fix the article.`
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.updated)) {
      throw new Error(`[articles] "${slug}" has updated "${meta.updated}". Expected YYYY-MM-DD.`);
    }

    // Google truncates around 160 characters. Over that and the tail is wasted; well under and we
    // are giving away snippet space we were handed for free.
    if (meta.description.length < 80 || meta.description.length > 160) {
      throw new Error(
        `[articles] "${slug}" description is ${meta.description.length} characters. Keep it 80 to 160.`
      );
    }

    if (meta.title.length > 65) {
      throw new Error(
        `[articles] "${slug}" title is ${meta.title.length} characters and will be truncated in ` +
          `search results. Keep it at 65 or fewer.`
      );
    }

    for (const rel of meta.related ?? []) {
      if (!slugs.has(rel)) {
        throw new Error(`[articles] "${slug}" links to related article "${rel}", which does not exist.`);
      }
      if (rel === slug) {
        throw new Error(`[articles] "${slug}" lists itself as related.`);
      }
    }

    // An em dash is the single most reliable tell that copy was generated rather than written, and
    // this site's previous titles were full of them. Catching it at build time is cheaper than
    // catching it after publication, across a hundred pages.
    for (const [field, text] of [
      ['title', meta.title],
      ['heading', meta.heading],
      ['description', meta.description],
    ] as const) {
      if (text.includes('—') || text.includes('–')) {
        throw new Error(
          `[articles] "${slug}" ${field} contains an em or en dash. Use a comma, a full stop, or a ` +
            `hyphen instead.`
        );
      }
    }
  }
}
