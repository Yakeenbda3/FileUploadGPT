import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CATEGORIES,
  assertArticleIntegrity,
  getAllArticleSlugs,
  getArticle,
  getRelatedArticles,
  type ArticleMeta,
} from '@/lib/articles';
import { absoluteUrl, SITE_NAME } from '@/lib/site';
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/jsonld';
import { JsonLd } from '@/components/JsonLd';
import { Faq } from '@/components/article/Faq';
import { TableOfContents } from '@/components/article/TableOfContents';
import { InstallCard } from '@/components/cta/InstallCard';

// The prerendered set IS the article surface. Anything not in it 404s at the router, before a
// component runs, which is what stops the site answering 200 for addresses that do not exist.
export const dynamicParams = false;

export function generateStaticParams() {
  // Runs once at build. A bad `related` slug, a filename that disagrees with its declared slug, an
  // over-length title, or an em dash in a heading fails the build here rather than shipping.
  assertArticleIntegrity();
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const { meta } = article;
  const path = `/blog/${meta.slug}`;

  return {
    title: meta.title,
    description: meta.description,
    // Self-canonical. Every article has exactly one address, and the legacy .html form 308s onto
    // it, so there is no second address for this tag to have to choose between.
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: meta.title,
      description: meta.description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      modifiedTime: meta.updated,
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
  };
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function RelatedArticles({ related }: { related: ArticleMeta[] }) {
  if (related.length === 0) return null;

  return (
    <section className="mt-14 border-t border-slate-200 pt-8">
      <h2 className="text-[1.25rem] font-bold text-ink">Keep reading</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {related.map((meta) => (
          <Link
            key={meta.slug}
            href={`/blog/${meta.slug}`}
            className="group rounded-xl border border-slate-200 p-4 transition-all hover:border-brand-300 hover:shadow-card"
          >
            <p className="text-[0.9375rem] font-semibold leading-snug text-ink group-hover:text-brand-700">
              {meta.heading}
            </p>
            {/* Three lines, not two. Descriptions are capped at 160 characters, which lands on
                three lines in a half-width card, so clamping at two was truncating almost every
                one of them into an ellipsis for no reason. */}
            <p className="mt-1.5 line-clamp-3 text-[0.8125rem] leading-relaxed text-ink-muted">
              {meta.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { meta, default: Body } = article;
  const category = CATEGORIES[meta.category];
  const path = `/blog/${meta.slug}`;

  const schemas: unknown[] = [
    articleSchema({
      headline: meta.title,
      description: meta.description,
      path,
      updated: meta.updated,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: category.label, path: `/guides/${category.slug}` },
      { name: meta.heading, path },
    ]),
  ];
  // FAQ schema only when the same questions render visibly below. Marking up an FAQ a reader
  // cannot see is a structured data policy violation, so the two are driven from one array.
  if (meta.faq && meta.faq.length > 0) schemas.push(faqSchema(meta.faq));

  return (
    <>
      <JsonLd schemas={schemas} />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <article className="min-w-0">
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-ink-muted">
                <li>
                  <Link href="/" className="transition-colors hover:text-brand-700">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/guides/${category.slug}`}
                    className="transition-colors hover:text-brand-700"
                  >
                    {category.label}
                  </Link>
                </li>
              </ol>
            </nav>

            <h1 className="text-[2rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[2.5rem]">
              {meta.heading}
            </h1>

            {/* A visible "last checked" date, because every factual claim on this site is about a
                product whose limits change without notice. It is also the honest place to put the
                date, next to the claims it qualifies, rather than buried in a footer. */}
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-ink-muted">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand-700">
                {category.label}
              </span>
              <span>
                Last checked <time dateTime={meta.updated}>{formatDate(meta.updated)}</time>
              </span>
            </p>

            <div className="article mt-8">
              <Body />
            </div>

            {meta.faq && <Faq items={meta.faq} />}
            <RelatedArticles related={getRelatedArticles(meta.slug)} />
          </article>

          <aside className="hidden lg:block">
            {/* One sticky rail holding both the install card and the contents, so they travel down
                the page together as a single unit.

                The install card sits ABOVE the table of contents deliberately. The contents were
                there first and pushed the call to action below the fold on a laptop, which meant
                the one thing the page is asking the reader to do was the one thing they had to
                scroll to find. The contents are a navigation aid for people already committed to
                reading; they lose nothing by sitting second. */}
            <div className="sticky top-24 space-y-5">
              <InstallCard />
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
