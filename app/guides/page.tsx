import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, CATEGORY_ORDER, getAllArticles, getArticlesByCategory } from '@/lib/articles';
import SiteSearch from '@/components/search/SiteSearch';
import SectionHeading from '@/components/layout/SectionHeading';

export const metadata: Metadata = {
  title: 'ChatGPT File Upload Guides: Limits, Formats, Errors',
  description:
    'Straight answers on upload limits, file types ChatGPT accepts, error messages, and how to work with documents it will not take.',
  alternates: { canonical: '/guides' },
};

/**
 * The guide index.
 *
 * This page used to be six headings with every article under them as a bare blue link, in a column
 * half the width of the screen. It contained everything and helped with nothing: a hundred link
 * texts in a row is not something anyone reads, it is something they scroll past. Search first,
 * then the six clusters as cards, then the articles as cards with their descriptions, which is the
 * only part that tells a visitor whether a guide answers their question.
 */
export default function GuidesIndexPage() {
  const total = getAllArticles().length;
  const categories = CATEGORY_ORDER.map((key) => ({
    key,
    ...CATEGORIES[key],
    href: `/guides/${CATEGORIES[key].slug}`,
    articles: getArticlesByCategory(key),
  }));

  return (
    <>
      {/* ── Header ────────────────────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:py-16">
          <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.025em] text-ink sm:text-[2.75rem]">
            ChatGPT file upload <span className="text-brand-700">guides</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
            {total} guides on getting documents into ChatGPT, what it will and will not accept, and
            what to do when it refuses.
          </p>
          <div className="mt-7">
            <SiteSearch variant="hero" placeholder={`Search ${total} guides`} />
          </div>
        </div>
      </section>

      {/* ── The six clusters ──────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={category.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-card"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-[1rem] font-semibold text-ink group-hover:text-brand-700">
                  {category.label}
                </h2>
                <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-0.5 text-[0.75rem] font-semibold text-brand-700">
                  {category.articles.length}
                </span>
              </div>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">{category.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Every article, grouped ────────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 sm:px-6">
          {categories.map((category) => (
            <section key={category.key} id={category.slug} className="scroll-mt-32">
              <SectionHeading
                lead={category.label.split(' ').slice(0, -1).join(' ') || category.label}
                accent={category.label.split(' ').slice(-1)[0]}
                blurb={category.blurb}
                align="left"
              />

              {category.articles.length === 0 ? (
                <p className="mt-6 text-[0.9375rem] text-ink-muted">Nothing published here yet.</p>
              ) : (
                <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {category.articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/blog/${article.slug}`}
                      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-card"
                    >
                      <h3 className="text-[0.9375rem] font-semibold leading-snug text-ink group-hover:text-brand-700">
                        {article.heading}
                      </h3>
                      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
                        {article.description}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
