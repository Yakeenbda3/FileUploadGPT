#!/usr/bin/env node
// Writes lib/articles.generated.ts: a barrel of STATIC imports over content/articles/*.mdx.
//
// Static imports, not dynamic ones, and that is the whole point of this script. A dynamic
// `import(`../content/articles/${slug}.mdx`)` looks tidier and behaves badly: the bundler cannot
// see which files are reachable, so a missing article becomes a runtime 500 in production instead
// of a failed build, and tree-shaking gets confused about the rest. Generating the imports means
// the module graph is fully known at compile time, so a missing or unparsable article stops the
// build on the machine that made the mistake.
//
// Run: npm run build (wired into prebuild) or `node scripts/build-article-index.mjs`.

import { readdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const articlesDir = join(root, 'content', 'articles');
const outFile = join(root, 'lib', 'articles.generated.ts');

const files = readdirSync(articlesDir)
  .filter((f) => f.endsWith('.mdx'))
  .sort();

const slugs = files.map((f) => f.slice(0, -4));

// A slug becomes a URL path segment. Anything outside this set either breaks the route or produces
// an address that needs percent-encoding, which is ugly in a search result and easy to get wrong in
// a link.
const badSlug = slugs.find((s) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s));
if (badSlug) {
  console.error(
    `[build-article-index] "${badSlug}.mdx" is not a valid slug. Use lowercase letters, digits and single hyphens.`
  );
  process.exit(1);
}

// Every article must export `meta`, or the route has no title, description or canonical and would
// silently inherit the layout defaults. Cheap textual check here; the type checker does the rest.
for (const file of files) {
  const source = readFileSync(join(articlesDir, file), 'utf8');
  if (!/export\s+const\s+meta\b/.test(source)) {
    console.error(`[build-article-index] content/articles/${file} does not export a "meta" object.`);
    process.exit(1);
  }
}

const imports = slugs
  .map((slug, i) => `import * as article${i} from '@/content/articles/${slug}.mdx';`)
  .join('\n');

const entries = slugs.map((slug, i) => `  '${slug}': article${i},`).join('\n');

const output = `// GENERATED FILE. Do not edit by hand.
// Written by scripts/build-article-index.mjs. Re-run it after adding or removing an article.
// Committed to git on purpose: the build must not depend on the script having been run first.

${imports}

export const ARTICLE_MODULES = {
${entries}
} as const;
`;

writeFileSync(outFile, output, 'utf8');
console.log(`[build-article-index] indexed ${slugs.length} article(s) into lib/articles.generated.ts`);

// ── The client-safe metadata index ─────────────────────────────────────────────────────────────
//
// The header's menu and the site search both need every article's title, description and category.
// They cannot read them from `articles.generated.ts`, because that barrel imports every .mdx file:
// importing it from a client component would ship the entire compiled body of the whole site to
// the browser to render a menu. This second file carries the metadata and nothing else.
//
// The `meta` object in each article is a plain literal, so it is extracted textually and evaluated
// in isolation. A file whose meta cannot be read fails the build here rather than rendering an
// article with no title.

/** Pull the object literal out of `defineArticle({ ... })` by matching braces. */
function extractMetaLiteral(source, file) {
  const marker = source.indexOf('defineArticle(');
  if (marker === -1) {
    console.error(`[build-article-index] ${file}: no defineArticle(...) call found.`);
    process.exit(1);
  }
  const start = source.indexOf('{', marker);
  let depth = 0;
  let inString = null;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    const prev = source[i - 1];
    if (inString) {
      if (ch === inString && prev !== '\\') inString = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inString = ch;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  console.error(`[build-article-index] ${file}: meta object literal is not closed.`);
  process.exit(1);
}

const index = files.map((file) => {
  const source = readFileSync(join(articlesDir, file), 'utf8');
  const literal = extractMetaLiteral(source, file);
  let meta;
  try {
    // The literal contains only data. Evaluated in its own function scope with nothing in scope.
    meta = Function(`"use strict"; return (${literal});`)();
  } catch (error) {
    console.error(`[build-article-index] ${file}: could not read meta. ${error.message}`);
    process.exit(1);
  }
  return {
    slug: meta.slug,
    title: meta.title,
    heading: meta.heading,
    description: meta.description,
    category: meta.category,
    updated: meta.updated,
  };
});

const indexOut = `// GENERATED FILE. Do not edit by hand.
// Written by scripts/build-article-index.mjs.
//
// Article metadata only, with no MDX imports, so the header menu and the site search can import it
// from the browser without dragging every article's compiled body along with them.

export interface ArticleIndexEntry {
  slug: string;
  title: string;
  heading: string;
  description: string;
  category: string;
  updated: string;
}

export const ARTICLE_INDEX: ArticleIndexEntry[] = ${JSON.stringify(index, null, 2)};
`;

writeFileSync(join(root, 'lib', 'article-index.generated.ts'), indexOut, 'utf8');
console.log(`[build-article-index] wrote metadata for ${index.length} article(s) into lib/article-index.generated.ts`);
