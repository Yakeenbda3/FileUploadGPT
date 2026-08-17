#!/usr/bin/env node
// Post-build gate. Fails the build on three classes of defect that are invisible until a real user
// or a crawler hits them.
//
//   1. A REDIRECT THAT LANDS NOWHERE. The site has 28 legacy .html addresses that Google has been
//      ranking since January. Each 308s to a clean URL. If the page behind that clean URL does not
//      exist, the redirect turns a ranking page into a 404, and `next build` reports nothing at all
//      because a redirect rule is just configuration. This is the single most expensive mistake
//      available on this project and it is entirely silent.
//
//   2. AN INTERNAL LINK TO A PAGE THAT DOES NOT EXIST. Same silence, smaller blast radius.
//
//   3. AN INTERNAL LINK TO A REDIRECT SOURCE. Not fatal, but it spends a hop on every crawl of
//      every page for no reason, and it is trivially avoidable when a machine is checking.
//
//   4. A PAGE THAT EXISTS BUT IS DECLARED NOWHERE. Caught this one the hard way: the first deploy
//      shipped five audience pages and their index that returned 200, were listed in no sitemap,
//      and were linked from no navigation. One of them had been ranking at position 8.8. A page
//      nothing points at gets crawled rarely and ranks accordingly, and nothing reports it, because
//      from every other angle the page is fine.
//
// The authority for "what pages exist" is .next/prerender-manifest.json, which is the set the build
// actually emitted. Not a list maintained by hand, and not an inference from the file tree: the
// thing that shipped.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ── What the build actually emitted ──────────────────────────────────────────────────────────
let manifest;
try {
  manifest = JSON.parse(readFileSync(join(root, '.next', 'prerender-manifest.json'), 'utf8'));
} catch {
  console.error('[check-links] No .next/prerender-manifest.json. Run this after `next build`.');
  process.exit(1);
}

// Next's metadata file conventions (opengraph-image, icon, apple-icon, and friends) become routes
// in the manifest, but they are ASSETS referenced from meta tags rather than pages a person can
// land on. They must not be in the sitemap, and they are not link targets, so they are excluded
// from both checks below. Without this the orphan check reports every one of them as a page
// declared nowhere, which is a false positive that would train everyone to ignore a real one.
const ASSET_ROUTE = /\/(opengraph-image|twitter-image|icon|apple-icon|favicon)(\.[a-z0-9]+)?$/;

const served = new Set(
  Object.keys(manifest.routes ?? {}).filter(
    (route) => !route.endsWith('.txt') && !route.endsWith('.xml') && !ASSET_ROUTE.test(route)
  )
);

// ── The redirect table, read from the same module next.config.ts uses ────────────────────────
const redirectsSource = readFileSync(join(root, 'lib', 'redirects.ts'), 'utf8');
const listOf = (name) => {
  const block = redirectsSource.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\] as const`));
  return block ? [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]) : [];
};

const redirects = [
  ['/index.html', '/'],
  ['/blog/index.html', '/blog'],
  ['/use-cases/index.html', '/use-cases'],
  ...listOf('LEGACY_ROOT_PAGES').map((s) => [`/${s}.html`, `/${s}`]),
  ...listOf('LEGACY_BLOG_POSTS').map((s) => [`/blog/${s}.html`, `/blog/${s}`]),
  ...listOf('LEGACY_USE_CASES').map((s) => [`/use-cases/${s}.html`, `/use-cases/${s}`]),
];
const redirectSources = new Set(redirects.map(([from]) => from));

const failures = [];

// ── 1. Every redirect must land on a page that exists ────────────────────────────────────────
for (const [from, to] of redirects) {
  if (!served.has(to)) {
    failures.push(
      `REDIRECT TO NOWHERE  ${from} -> ${to}\n` +
        `    ${to} was not built, so this indexed URL would 308 straight into a 404.`
    );
  }
}

// ── 2 and 3. Internal links in authored source ───────────────────────────────────────────────
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry === '.legacy' || entry === '.git') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx?|mdx)$/.test(full)) out.push(full);
  }
  return out;
}

// Only literal hrefs are checkable. A template literal like `/blog/${slug}` is built from the
// article index, which assertArticleIntegrity() already validates, so nothing is lost by skipping
// it here. Better to check what can be checked exactly than to guess at the rest.
const LINK_PATTERNS = [
  /href="(\/[^"#?]*)"/g, // JSX and HTML
  /href=\{'(\/[^'#?]*)'\}/g, // JSX with a string expression
  /\]\((\/[^)#?\s]*)\)/g, // markdown links in .mdx
];

for (const file of walk(root)) {
  const source = readFileSync(file, 'utf8');
  const where = relative(root, file);

  for (const pattern of LINK_PATTERNS) {
    for (const match of source.matchAll(pattern)) {
      const href = match[1].replace(/\/$/, '') || '/';

      if (redirectSources.has(href)) {
        failures.push(
          `LINK TO A REDIRECT  ${where}\n    links to ${href}, which 308s. Link to the destination instead.`
        );
        continue;
      }

      // Files served straight from public/ are real URLs but never appear in the route manifest.
      if (/\.(png|jpe?g|svg|webp|ico|webmanifest|xml|txt|pdf)$/.test(href)) continue;

      if (!served.has(href)) {
        failures.push(`LINK TO A MISSING PAGE  ${where}\n    links to ${href}, which was not built.`);
      }
    }
  }
}

// ── 4. Every page built must be declared in the sitemap ──────────────────────────────────────
// The sitemap is the one place that is supposed to list the whole site, so it is the right thing
// to measure completeness against. Comparing it with the emitted route set is the only way to see
// a page that exists and that nothing announces.
try {
  const sitemapBody = readFileSync(join(root, '.next', 'server', 'app', 'sitemap.xml.body'), 'utf8');
  const declared = new Set(
    [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => m[1].replace(/^https?:\/\/[^/]+/, '') || '/'
    )
  );

  for (const route of served) {
    // The 404 is deliberately absent: it is noindex and has no canonical, so declaring it would be
    // inviting Google to index a page whose whole job is to say nothing is here.
    if (route === '/_not-found') continue;
    if (!declared.has(route)) {
      failures.push(
        `PAGE DECLARED NOWHERE  ${route}\n` +
          `    Built and reachable, but absent from the sitemap. Add it, or delete the route.`
      );
    }
  }
} catch {
  failures.push(
    'SITEMAP NOT FOUND  .next/server/app/sitemap.xml.body was not emitted, so completeness could not be checked.'
  );
}

// ── Report ───────────────────────────────────────────────────────────────────────────────────
if (failures.length > 0) {
  const unique = [...new Set(failures)].sort();
  console.error(`\n[check-links] ${unique.length} problem(s):\n`);
  for (const failure of unique) console.error(`  ${failure}\n`);
  console.error(`Pages built: ${served.size}. Redirects declared: ${redirects.length}.\n`);
  process.exit(1);
}

console.log(
  `[check-links] OK. ${served.size} pages built, ${redirects.length} redirects all landing on real pages, no internal link points at a redirect.`
);
