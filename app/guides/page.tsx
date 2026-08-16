import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, getArticlesByCategory, type CategoryKey } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Guides to getting files into ChatGPT',
  description:
    'Straight answers on upload limits, file types ChatGPT accepts, error messages, and how to work with documents it will not take.',
  alternates: { canonical: '/guides' },
};

export default function GuidesIndexPage() {
  const keys = Object.keys(CATEGORIES) as CategoryKey[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
        Guides
      </h1>
      <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
        Everything we know about getting documents into ChatGPT, what it will and will not accept,
        and what to do when it refuses.
      </p>

      <div className="mt-10 space-y-10">
        {keys.map((key) => {
          const category = CATEGORIES[key];
          const articles = getArticlesByCategory(key);
          return (
            <section key={key}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
                <h2 className="text-[1.25rem] font-bold text-ink">
                  <Link href={`/guides/${category.slug}`} className="hover:text-brand-700">
                    {category.label}
                  </Link>
                </h2>
                <p className="text-[0.8125rem] text-ink-muted">
                  {articles.length} {articles.length === 1 ? 'guide' : 'guides'}
                </p>
              </div>
              <p className="mt-3 text-[0.9375rem] text-ink-muted">{category.blurb}</p>
              {articles.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {articles.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={`/blog/${article.slug}`}
                        className="text-[0.9375rem] font-medium text-brand-700 hover:text-brand-800 hover:underline"
                      >
                        {article.heading}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
