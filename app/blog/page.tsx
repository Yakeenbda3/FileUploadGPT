import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, getAllArticles } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Every guide, newest first',
  description:
    'The full archive of FileUploadGPT guides on ChatGPT upload limits, supported file types, error messages, and working with long documents.',
  alternates: { canonical: '/blog' },
};

export default function BlogIndexPage() {
  // Newest first. `updated` is the only date an article carries, deliberately: a "published" date
  // that never moves makes a maintained page look abandoned, and on a subject whose facts change
  // every few months, that is the wrong signal to send a reader or a crawler.
  const articles = getAllArticles().sort((a, b) => b.updated.localeCompare(a.updated));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
        Every guide, newest first
      </h1>
      <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
        Sorted by when we last checked the facts in them. Browsing by subject instead?{' '}
        <Link href="/guides" className="font-medium text-brand-700 underline">
          Start here
        </Link>
        .
      </p>

      <div className="mt-10 divide-y divide-slate-200 border-t border-slate-200">
        {articles.map((article) => (
          <article key={article.slug} className="py-6">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-600">
              {CATEGORIES[article.category].label}
            </p>
            <h2 className="mt-1.5 text-[1.1875rem] font-semibold leading-snug">
              <Link href={`/blog/${article.slug}`} className="text-ink hover:text-brand-700">
                {article.heading}
              </Link>
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              {article.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
