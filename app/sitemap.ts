import type { MetadataRoute } from 'next';
import { CATEGORIES, getAllArticles } from '@/lib/articles';
import { USE_CASES } from '@/lib/use-cases';
import { REDIRECT_SOURCES } from '@/lib/redirects';
import { absoluteUrl } from '@/lib/site';

/**
 * The sitemap, derived from the same lists the router builds pages from.
 *
 * The previous sitemap was maintained by hand and had gone wrong in the way hand-maintained
 * sitemaps always do: all 30 entries pointed at addresses that redirected, and none of them agreed
 * with the canonical tags on the pages they described. Google was handed a list of hops, processed
 * it once in January, and by February had stopped re-reading it.
 *
 * Deriving it removes the whole class of problem. Every URL here is a page because it came from the
 * page list. Every page is here once because the list has no duplicates. And the assertion below
 * makes it impossible to ship a sitemap that declares a redirect, which is the specific mistake
 * that was made before.
 */

/** Pages that exist as their own route rather than as content. Kept beside the routes they mirror. */
const STATIC_PAGES: Array<{ path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }> = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/install', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/how-it-works', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/features', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/guides', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/use-cases', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/changelog', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'monthly' },
  { path: '/terms-of-service', priority: 0.3, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    ...STATIC_PAGES.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),

    ...Object.values(CATEGORIES).map((category) => ({
      url: absoluteUrl(`/guides/${category.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),

    // Derived from the same array the route builds pages from, so a new audience page cannot be
    // added and forgotten here. These were missed on the first deploy precisely because they were
    // listed by hand: five pages existed, returned 200, and were declared nowhere.
    ...USE_CASES.map((useCase) => ({
      url: absoluteUrl(`/use-cases/${useCase.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),

    // Articles carry their own `updated` date rather than today's. A sitemap that claims every page
    // changed today on every deploy trains Google to ignore the field, which then stops helping on
    // the pages that genuinely did change.
    ...getAllArticles().map((article) => ({
      url: absoluteUrl(`/blog/${article.slug}`),
      lastModified: new Date(`${article.updated}T00:00:00Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  // A sitemap exists to list destinations. Listing a redirect source sends a crawler on a hop it
  // did not need to make, and doing it across every entry is how the last one stopped being read.
  for (const entry of entries) {
    const path = entry.url.replace(absoluteUrl(''), '') || '/';
    if (REDIRECT_SOURCES.has(path)) {
      throw new Error(
        `[sitemap] "${path}" is a redirect source and must not be declared. Declare its destination instead.`
      );
    }
  }

  return entries;
}
