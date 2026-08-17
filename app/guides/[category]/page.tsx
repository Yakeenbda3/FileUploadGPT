import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, CATEGORY_ORDER, getArticlesByCategory, type CategoryKey } from '@/lib/articles';
import { breadcrumbSchema } from '@/lib/jsonld';
import { JsonLd } from '@/components/JsonLd';
import SiteSearch from '@/components/search/SiteSearch';

export const dynamicParams = false;

const BY_SLUG = Object.fromEntries(
  CATEGORY_ORDER.map((key) => [CATEGORIES[key].slug, key])
) as Record<string, CategoryKey>;

export function generateStaticParams() {
  return Object.values(CATEGORIES).map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const key = BY_SLUG[slug];
  if (!key) return {};
  const category = CATEGORIES[key];
  const count = getArticlesByCategory(key).length;

  return {
    // seoTitle, not label. "Comparisons" is a fine heading and a wasted search result.
    title: category.seoTitle,
    description: `${category.blurb} ${count} guides, kept up to date.`,
    alternates: { canonical: `/guides/${category.slug}` },
  };
}

/**
 * A content hub.
 *
 * Hubs exist to give a cluster of articles one address that can accumulate authority and one page
 * that links to every member. Without them each article is an island reached only from a search
 * result, which is how a site ends up with pages Google crawls once and then forgets.
 *
 * The sibling links at the bottom matter for the same reason: they turn six isolated hubs into a
 * connected set, so authority arriving at any one of them can reach the other five.
 */
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const key = BY_SLUG[slug];
  if (!key) notFound();

  const category = CATEGORIES[key];
  const articles = getArticlesByCategory(key);
  const siblings = CATEGORY_ORDER.filter((k) => k !== key).map((k) => ({
    key: k,
    ...CATEGORIES[k],
    href: `/guides/${CATEGORIES[k].slug}`,
    count: getArticlesByCategory(k).length,
  }));

  return (
    <>
      <JsonLd
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: category.label, path: `/guides/${category.slug}` },
          ]),
        ]}
      />

      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="mx-auto max-w-4xl px-4 py-11 text-center sm:px-6 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-4 text-[0.8125rem] text-ink-muted">
            <Link href="/" className="hover:text-brand-700">
              Home
            </Link>
            <span className="px-1.5 text-ink-faint">/</span>
            <Link href="/guides" className="hover:text-brand-700">
              Guides
            </Link>
          </nav>

          <h1 className="text-[1.875rem] font-bold leading-tight tracking-[-0.025em] text-ink sm:text-[2.5rem]">
            {category.label}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
            {category.blurb}
          </p>
          <p className="mt-3 text-[0.875rem] text-ink-muted">
            {articles.length} {articles.length === 1 ? 'guide' : 'guides'}
          </p>
          <div className="mt-6">
            <SiteSearch variant="hero" placeholder="Search every guide" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {articles.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-[0.9375rem] text-ink-muted">
            Nothing published in this section yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-card"
              >
                <h2 className="text-[0.9375rem] font-semibold leading-snug text-ink group-hover:text-brand-700">
                  {article.heading}
                </h2>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
                  {article.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-[1.125rem] font-semibold text-ink">Other sections</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {siblings.map((sibling) => (
              <Link
                key={sibling.key}
                href={sibling.href}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-300 hover:shadow-card"
              >
                <span className="block text-[0.875rem] font-semibold text-ink group-hover:text-brand-700">
                  {sibling.label}
                </span>
                <span className="mt-1 block text-[0.75rem] text-ink-muted">
                  {sibling.count} guides
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
