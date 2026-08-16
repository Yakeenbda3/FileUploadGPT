// Single source of truth for the site's SEO-facing identity.
//
// Every canonical tag, every Open Graph URL, every JSON-LD `url`, and every sitemap entry is built
// from SITE_URL. Nothing else in the codebase is allowed to hardcode the domain.
//
// This file exists because of a real defect it makes impossible. Before the rebuild, canonicals
// were typed by hand into 28 static HTML files. 23 of them declared a clean URL
// (https://fileuploadgpt.com/about) that returned 404, because clean URLs were never enabled on
// the host, and the sitemap declared a third shape again (apex + .html) that 307'd on every entry.
// Google was handed three contradictory answers to "what is the real address of this page", and
// the answer most pages gave was a dead one. A constant cannot disagree with itself.
//
// www, NOT apex. This reverses an earlier call, on evidence that arrived afterwards.
//
// The plan was to serve the apex, because that is what the old canonicals and sitemap claimed. Then
// the Search Console export showed what Google has actually indexed, and every single ranking URL
// is on www: the apex has been 307ing to www all along, so www is the host that earned the
// positions. Moving to the apex would mean migrating every indexed URL to a different host purely
// to match some tags that were wrong anyway, and it would need a change to the host's domain
// settings to boot.
//
// Declaring www instead makes the tags true immediately, with no host migration and nothing to
// reconfigure. The `.html` to clean-URL change is then the only migration in flight, which is one
// variable at a time rather than two.
//
// NO TRAILING SLASH: so `${SITE_URL}/${path}` is always correct and never produces a double slash.
export const SITE_URL = 'https://www.fileuploadgpt.com';

export const SITE_NAME = 'FileUploadGPT';

// Set to false to ship a noindex build (useful for a preview deploy that must not be indexed).
// Deliberately a constant rather than an env var: an env var that silently defaults to the wrong
// value is how a site ends up either invisible or indexing its own staging copy.
export const INDEXABLE = true;

// The Chrome Web Store listing. Hardcoded in exactly one place: it appears in every sticky CTA,
// every inline CTA, the nav, the footer, and the SoftwareApplication JSON-LD, so a stale copy of
// it in any one of those would send real install traffic to a 404.
export const CHROME_STORE_ID = 'ghnelikfhlahclcchbglbajekemkgghm';
export const CHROME_STORE_URL = `https://chromewebstore.google.com/detail/fileuploadgpt/${CHROME_STORE_ID}`;

// Used in Organization / SoftwareApplication JSON-LD and the contact page.
export const CONTACT_EMAIL = 'support@fileuploadgpt.com';

/** Absolute URL for a site-relative path. Pass "" for the homepage. */
export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${SITE_URL}/${clean}`;
}
