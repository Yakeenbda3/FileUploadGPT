'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Table of contents with scroll tracking.
 *
 * Headings are read from the rendered DOM rather than declared in the article's frontmatter. That
 * is deliberate: a hand-maintained contents list and the headings it points at drift apart the
 * first time someone rewrites a section, and the result is a link that scrolls nowhere. Reading the
 * DOM means the two cannot disagree.
 *
 * Reading the DOM is safe here specifically because this is navigation, not content. The headings
 * themselves are already in the server HTML for crawlers; this only adds a way to jump between
 * them.
 */
export function TableOfContents({ containerSelector = '.article' }: { containerSelector?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const found = Array.from(container.querySelectorAll<HTMLElement>('h2[id], h3[id]')).map((el) => ({
      id: el.id,
      text: el.textContent ?? '',
      level: (el.tagName === 'H2' ? 2 : 3) as 2 | 3,
    }));
    setHeadings(found);
    if (found.length === 0) return;

    // rootMargin pulls the detection line up near the top of the viewport, so a section counts as
    // "current" once its heading reaches the top rather than when it enters the bottom of the
    // screen. Without it every heading below the fold reads as active at once on a short article.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-88px 0px -70% 0px', threshold: 0 }
    );

    for (const heading of found) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [containerSelector]);

  if (headings.length < 3) return null;

  return (
    <nav aria-label="On this page" className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-ink-faint">On this page</p>
      <ul className="mt-3 space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block border-l-2 py-1 text-[0.8125rem] leading-snug transition-colors ${
                heading.level === 3 ? 'pl-5' : 'pl-3'
              } ${
                activeId === heading.id
                  ? 'border-brand-600 font-medium text-brand-700'
                  : 'border-slate-200 text-ink-muted hover:border-brand-300 hover:text-ink'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
