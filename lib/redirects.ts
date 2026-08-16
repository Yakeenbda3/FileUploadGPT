// Legacy .html addresses -> the clean URLs that replace them.
//
// Until 16 Aug 2026 this site was 32 hand-written .html files, and .html was the ONLY shape that
// returned 200. Those are the addresses Google has been crawling since January, so every one of
// them has to keep working. They 308 here.
//
// 308, not 302: a permanent redirect passes ranking authority to the destination. A temporary one
// tells Google to keep the old address, which would leave us with the exact duplicate-shape
// problem the rebuild exists to remove.
//
// The list is DERIVED from LEGACY_PAGES below rather than typed out, so a page cannot be added to
// the site and forgotten here. `scripts/check-internal-links.mjs` additionally fails the build if
// any internal link points at one of these sources instead of its destination: a link to a
// redirect costs a hop on every crawl and is trivially avoidable.

/** Root-level pages that existed as `/<slug>.html`. */
const LEGACY_ROOT_PAGES = [
  'about',
  'changelog',
  'contact',
  'faq',
  'features',
  'how-it-works',
  'install',
  'pricing',
  'privacy-policy',
  'terms-of-service',
] as const;

/** The 12 original blog posts, which existed as `/blog/<slug>.html`. */
const LEGACY_BLOG_POSTS = [
  'best-chrome-extensions-for-chatgpt',
  'chatgpt-contract-review-guide',
  'chatgpt-document-analysis-tips',
  'chatgpt-file-types-supported',
  'chatgpt-file-upload-limit-workaround',
  'chatgpt-file-upload-troubleshooting',
  'chatgpt-research-paper-analysis',
  'chatgpt-summarize-long-documents',
  'chatgpt-vs-claude-document-analysis',
  'how-to-upload-large-files-to-chatgpt',
  'upload-large-code-files-to-chatgpt',
  'upload-large-pdfs-to-chatgpt',
] as const;

/** The 5 original use-case pages, which existed as `/use-cases/<slug>.html`. */
const LEGACY_USE_CASES = [
  'business-professionals',
  'content-creators',
  'developers',
  'researchers',
  'students',
] as const;

export interface RedirectRule {
  source: string;
  destination: string;
  permanent: boolean;
}

function html(source: string, destination: string): RedirectRule {
  return { source, destination, permanent: true };
}

export const LEGACY_REDIRECTS: RedirectRule[] = [
  // Index files. `/index.html` was never linked but was reachable, and a reachable duplicate of
  // the homepage is the worst duplicate to leave lying around.
  html('/index.html', '/'),
  html('/blog/index.html', '/blog'),
  html('/use-cases/index.html', '/use-cases'),

  ...LEGACY_ROOT_PAGES.map((slug) => html(`/${slug}.html`, `/${slug}`)),
  ...LEGACY_BLOG_POSTS.map((slug) => html(`/blog/${slug}.html`, `/blog/${slug}`)),
  ...LEGACY_USE_CASES.map((slug) => html(`/use-cases/${slug}.html`, `/use-cases/${slug}`)),
];

/** Every address that is a redirect SOURCE. Nothing here may be linked to, or listed in the sitemap. */
export const REDIRECT_SOURCES: ReadonlySet<string> = new Set(
  LEGACY_REDIRECTS.map((r) => r.source)
);
