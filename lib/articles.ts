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
import { CATEGORIES, type CategoryKey } from './categories';

// Re-exported so existing imports from '@/lib/articles' keep working. The definitions live in
// lib/categories.ts because client components need them and must not import this file: this one
// pulls in the MDX barrel, which is the entire site's compiled content.
export { CATEGORIES, categoryHref, CATEGORY_ORDER } from './categories';
export type { CategoryKey, CtaStrength } from './categories';

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

/**
 * Related articles, in both directions.
 *
 * `related` in an article's frontmatter can only ever point BACKWARDS, because an article can only
 * name articles that already existed when it was written. Left as declared, that produces a link
 * graph where every new page links out and nothing links back to it: after 56 articles, 15 of them
 * had zero inbound contextual links, and the number was going to grow with every batch.
 *
 * Resolving the reverse edges here fixes it once and permanently. If B declares A as related, then
 * A shows B too. No article has to be revisited when a later one is added, and the graph stays
 * connected by construction rather than by anyone remembering.
 *
 * Declared links come first, since those were an editorial judgement. Reverse edges follow.
 */
export function getRelatedArticles(slug: string, limit = 6): ArticleMeta[] {
  const self = MODULES[slug];
  if (!self) return [];

  const declared = self.meta.related ?? [];
  const reverse = getAllArticleSlugs().filter(
    (other) => other !== slug && (MODULES[other].meta.related ?? []).includes(slug)
  );

  const seen = new Set<string>();
  const ordered: ArticleMeta[] = [];
  for (const candidate of [...declared, ...reverse]) {
    if (candidate === slug || seen.has(candidate)) continue;
    seen.add(candidate);
    const meta = MODULES[candidate]?.meta;
    if (meta) ordered.push(meta);
    if (ordered.length >= limit) break;
  }
  return ordered;
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

  // ── Two articles must never chase the same search intent ────────────────────────────────────
  // Two pages aimed at one question do not double the traffic for it. They split the internal
  // links and the external ones between them, and Google picks one and largely ignores the other,
  // usually not the one you would have chosen. At a hundred articles this is the failure that
  // creeps in silently, because nobody remembers what the other ninety-nine were targeting.
  //
  // `targetQuery` is never rendered. It exists so this check can exist.
  const byTarget = new Map<string, string[]>();
  for (const slug of slugs) {
    const key = MODULES[slug].meta.targetQuery.trim().toLowerCase();
    byTarget.set(key, [...(byTarget.get(key) ?? []), slug]);
  }
  for (const [target, owners] of byTarget) {
    if (owners.length > 1) {
      throw new Error(
        `[articles] ${owners.length} articles target the same query "${target}": ${owners.join(', ')}.\n` +
          `Merge them, or give each one a genuinely different question to answer.`
      );
    }
  }

  // ── No article may end up with nothing pointing at it ───────────────────────────────────────
  // Measured against the EFFECTIVE graph, declared links plus their reverse edges, which is what
  // getRelatedArticles() renders. An article nothing links to gets crawled rarely and ranks
  // accordingly, and it is invisible from every other angle: the page is fine, it is in the
  // sitemap, it returns 200. Only the graph shows it.
  const inbound = new Map<string, number>();
  for (const slug of slugs) inbound.set(slug, 0);
  for (const slug of slugs) {
    for (const target of MODULES[slug].meta.related ?? []) {
      if (target === slug) continue;
      // A declares B gives B an inbound link on A's page, and A an inbound link on B's page,
      // because the related block resolves in both directions.
      inbound.set(target, (inbound.get(target) ?? 0) + 1);
      inbound.set(slug, (inbound.get(slug) ?? 0) + 1);
    }
  }
  const unlinked = [...inbound].filter(([, count]) => count === 0).map(([slug]) => slug);
  if (unlinked.length > 0) {
    throw new Error(
      `[articles] ${unlinked.length} article(s) have nothing linking to them: ${unlinked.join(', ')}.\n` +
        `Give each one a "related" list, or name it in the related list of an article it belongs with.`
    );
  }

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

    // Google renders roughly 55 to 60 characters of a title. Over that and the tail is cut off;
    // well under it and we are handing back space that was free. Several pages on this site were
    // sitting at eleven and fourteen characters, which is a third of the search result given away.
    if (meta.title.length > 65) {
      throw new Error(
        `[articles] "${slug}" title is ${meta.title.length} characters and will be truncated in ` +
          `search results. Keep it at 65 or fewer.`
      );
    }

    if (meta.title.length < 25) {
      throw new Error(
        `[articles] "${slug}" title is only ${meta.title.length} characters. That wastes most of ` +
          `the space a search result gives you. Aim for 40 to 60.`
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
