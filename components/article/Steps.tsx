import type { ReactNode } from 'react';

/**
 * A numbered walkthrough with visible step markers and a connecting rail.
 *
 * An ordered list would carry the same meaning, but instructions are the part of an article people
 * scan rather than read, and a plain `<ol>` gives the eye nothing to lock onto. Still renders as a
 * real `<ol>` underneath, so it is announced correctly by a screen reader and stays meaningful with
 * styles off.
 */
export function Steps({ children }: { children: ReactNode }) {
  // A CSS counter rather than a prop on each step. Numbering by hand means a step inserted in the
  // middle silently renumbers nothing, and the list reads 1, 2, 2, 3 until someone notices.
  return (
    <ol className="not-prose my-6 space-y-0 [counter-reset:step]">
      {children}
    </ol>
  );
}

export function Step({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <li className="group relative flex gap-4 pb-6 [counter-increment:step] last:pb-0">
      {/* The rail linking one marker to the next. Hidden on the final step so the line does not
          dangle past the end of the list. */}
      <span
        aria-hidden="true"
        className="absolute left-[0.9375rem] top-8 h-[calc(100%-2rem)] w-px bg-brand-200 group-last:hidden"
      />
      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[0.8125rem] font-bold text-white before:content-[counter(step)]" />
      <div className="min-w-0 pt-1">
        <p className="font-semibold text-ink">{title}</p>
        {children && (
          <div className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft [&_a]:font-medium [&_a]:text-brand-700 [&_a]:underline [&_code]:rounded [&_code]:border [&_code]:border-slate-200 [&_code]:bg-slate-50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em] [&>*+*]:mt-2">
            {children}
          </div>
        )}
      </div>
    </li>
  );
}
