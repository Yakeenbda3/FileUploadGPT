import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, getArticlesByCategory, type CategoryKey } from '@/lib/articles';
import { breadcrumbSchema } from '@/lib/jsonld';
import { JsonLd } from '@/components/JsonLd';

export const dynamicParams = false;

const BY_SLUG = Object.fromEntries(
  (Object.keys(CATEGORIES) as CategoryKey[]).map((key) => [CATEGORIES[key].slug, key])
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

  return {
    title: category.label,
    description: `${category.blurb} Every guide we have on the subject, in one place.`,
    alternates: { canonical: `/guides/${category.slug}` },
  };
}

/**
 * A content hub.
 *
 * Hubs exist to give a cluster of articles one address that can accumulate authority and one page
 * that links to every member. Without them each article is an island reached only from a search
 * result, which is how a site ends up with pages Google crawls once and then forgets.
 */
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const key = BY_SLUG[slug];
  if (!key) notFound();

  const category = CATEGORIES[key];
  const articles = getArticlesByCategory(key);

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

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-5 text-[0.8125rem] text-ink-muted">
          <Link href="/guides" className="hover:text-brand-700">
            Guides
          </Link>
        </nav>

        <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
          {category.label}
        </h1>
        <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
          {category.blurb}
        </p>

        {articles.length === 0 ? (
          <p className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6 text-[0.9375rem] text-ink-muted">
            Nothing published in this section yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group rounded-2xl border border-slate-200 p-6 transition-all hover:border-brand-300 hover:shadow-card"
              >
                <h2 className="text-[1.0625rem] font-semibold leading-snug text-ink group-hover:text-brand-700">
                  {article.heading}
                </h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {article.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
