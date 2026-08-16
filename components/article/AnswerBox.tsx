import type { ReactNode } from 'react';

/**
 * The direct answer, placed above everything else in the article.
 *
 * Two things at once. For the reader it respects the fact that they arrived from a search result
 * with one question and do not want four paragraphs of preamble first. For Google it is a compact,
 * self-contained answer immediately after the h1, which is the shape featured snippets are pulled
 * from.
 *
 * Keep it to roughly 40 to 55 words. Longer and it stops being extractable as a snippet, and stops
 * being scannable, which are the same failure seen from two directions.
 */
export function AnswerBox({ children, label = 'Short answer' }: { children: ReactNode; label?: string }) {
  return (
    <div className="not-prose mb-8 rounded-2xl border border-brand-200 bg-brand-50/70 p-5 sm:p-6">
      <p className="mb-2 flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-wider text-brand-700">
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 4.6v4M8 11.2v.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {label}
      </p>
      <div className="text-[1.0625rem] leading-relaxed text-ink [&_a]:font-medium [&_a]:text-brand-700 [&_a]:underline [&_strong]:font-semibold">
        {children}
      </div>
    </div>
  );
}
