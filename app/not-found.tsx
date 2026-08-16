import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/articles';

// A 404 must never be indexable. Without this it is a real page with real content that Google can
// index under whatever URL produced it, which is how sites end up with hundreds of indexed "page
// not found" results competing with the pages that do exist.
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-[0.8125rem] font-bold uppercase tracking-wider text-brand-600">404</p>
      <h1 className="mt-3 text-[2rem] font-bold tracking-[-0.02em] text-ink">
        That page is not here
      </h1>
      <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">
        It may have moved when we rebuilt the site. The guides below cover most of what people come
        here looking for.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {Object.values(CATEGORIES).map((category) => (
          <Link
            key={category.slug}
            href={`/guides/${category.slug}`}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-[0.875rem] font-medium text-ink-soft transition-colors hover:border-brand-400 hover:text-brand-700"
          >
            {category.label}
          </Link>
        ))}
      </div>
      <Link href="/" className="btn btn-brand mt-8">
        Back to the homepage
      </Link>
    </div>
  );
}
