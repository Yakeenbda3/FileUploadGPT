// The navigation model and the search index.
//
// Both are derived from the generated article metadata, so a new article appears in the header menu
// and becomes findable in search the moment its file exists. Nothing here is hand-maintained, which
// is the point: the previous header listed six category links and nothing else, so ninety-odd
// articles were reachable only by finding the category page first and reading a wall of blue links.
//
// Client-safe on purpose. It imports only plain data, never the MDX barrel.

import { ARTICLE_INDEX, type ArticleIndexEntry } from './article-index.generated';
import { CATEGORIES, CATEGORY_ORDER, categoryHref, type CategoryKey } from './categories';

export interface NavArticle {
  slug: string;
  title: string;
  href: string;
}

export interface NavColumn {
  heading: string | null;
  links: NavArticle[];
}

export interface NavCategory {
  key: CategoryKey;
  label: string;
  short: string;
  blurb: string;
  href: string;
  count: number;
  columns: NavColumn[];
}

function isCategoryKey(value: string): value is CategoryKey {
  return value in CATEGORIES;
}

export function articleHref(slug: string): string {
  return `/blog/${slug}`;
}

/** Every article in a category, shortest title first so the menu reads as a list of questions. */
export function articlesInCategory(key: CategoryKey): ArticleIndexEntry[] {
  return ARTICLE_INDEX.filter((a) => a.category === key).sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Split a category's articles into balanced columns for the dropdown panel.
 *
 * A single column of twenty links is unreadable and a fixed column count leaves a category with
 * four articles stretched across the whole panel. Column count is derived from the article count,
 * capped at four so a panel can never be wider than the page.
 */
function toColumns(articles: ArticleIndexEntry[]): NavColumn[] {
  const perColumn = 8;
  const columnCount = Math.max(1, Math.min(4, Math.ceil(articles.length / perColumn)));
  const size = Math.ceil(articles.length / columnCount);
  const columns: NavColumn[] = [];
  for (let i = 0; i < columnCount; i++) {
    columns.push({
      heading: null,
      links: articles.slice(i * size, (i + 1) * size).map((a) => ({
        slug: a.slug,
        title: a.title,
        href: articleHref(a.slug),
      })),
    });
  }
  return columns.filter((c) => c.links.length > 0);
}

/** The header menu: one entry per category, every article underneath it. */
export const NAV_TREE: NavCategory[] = CATEGORY_ORDER.map((key) => {
  const articles = articlesInCategory(key);
  return {
    key,
    label: CATEGORIES[key].label,
    short: CATEGORIES[key].short,
    blurb: CATEGORIES[key].blurb,
    href: categoryHref(key),
    count: articles.length,
    columns: toColumns(articles),
  };
});

/** Standalone links that sit to the right of the menu bar. */
export const NAV_UTILITY = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/install', label: 'Install' },
  { href: '/faq', label: 'FAQ' },
] as const;

// ── Search ─────────────────────────────────────────────────────────────────────────────────────

export interface SearchEntry {
  slug: string;
  title: string;
  description: string;
  category: CategoryKey;
  categoryLabel: string;
  href: string;
  /** Lowercased haystack, precomputed so matching does not rebuild it on every keystroke. */
  haystack: string;
}

export const SEARCH_INDEX: SearchEntry[] = ARTICLE_INDEX.filter((a) => isCategoryKey(a.category)).map(
  (a) => {
    const category = a.category as CategoryKey;
    return {
      slug: a.slug,
      title: a.title,
      description: a.description,
      category,
      categoryLabel: CATEGORIES[category].label,
      href: articleHref(a.slug),
      haystack: `${a.title} ${a.heading} ${a.description} ${CATEGORIES[category].label} ${a.slug.replace(/-/g, ' ')}`.toLowerCase(),
    };
  }
);

export interface SearchResult extends SearchEntry {
  score: number;
}

/**
 * Match a typed query against the article index.
 *
 * Every word has to appear somewhere, which keeps "pdf limit" from returning every article that
 * mentions either. Ranking then rewards a match in the title over one buried in the description,
 * and a phrase match over scattered words, because someone typing "scanned pdf" wants the article
 * about scanned PDFs first rather than the eleven that mention both words.
 */
export function searchArticles(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const words = q.split(/\s+/).filter(Boolean);

  const results: SearchResult[] = [];
  for (const entry of SEARCH_INDEX) {
    if (!words.every((w) => entry.haystack.includes(w))) continue;

    const title = entry.title.toLowerCase();
    let score = 0;
    if (title === q) score += 1000;
    if (title.startsWith(q)) score += 500;
    if (title.includes(q)) score += 250;
    if (entry.haystack.includes(q)) score += 60;
    for (const w of words) {
      if (title.includes(w)) score += 40;
      if (entry.slug.includes(w)) score += 20;
      if (entry.description.toLowerCase().includes(w)) score += 8;
    }
    // Shorter titles that still match are usually the more direct answer.
    score -= entry.title.length / 100;
    results.push({ ...entry, score });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export const ARTICLE_COUNT = ARTICLE_INDEX.length;
