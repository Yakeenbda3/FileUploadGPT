import type { MetadataRoute } from 'next';
import { INDEXABLE, SITE_URL, absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    // No Crawl-delay. The old robots.txt set `Crawl-delay: 1`, which Google ignores outright and
    // which Bing reads as an instruction to crawl a page per second at most. On a site that is
    // about to grow to well over a hundred pages, that is a self-imposed handicap on discovery for
    // no benefit, since the host is a CDN that does not care about the load.
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
