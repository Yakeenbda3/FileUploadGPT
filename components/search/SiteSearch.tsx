'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchArticles, ARTICLE_COUNT, type SearchResult } from '@/lib/nav';

type Variant = 'hero' | 'bar' | 'panel';

/**
 * Search across every guide on the site.
 *
 * Runs entirely in the browser against the generated article index. That is a deliberate choice
 * over a hosted search service: the whole index is a few kilobytes of metadata, it costs nothing,
 * it works offline and on the first keystroke, and there is no third party receiving a log of what
 * visitors are looking for.
 *
 * The keyboard behaviour is the part people notice: arrows move, Enter opens, Escape closes and
 * returns focus. A search box that can only be used with a mouse is half a search box.
 */
export default function SiteSearch({
  variant = 'bar',
  placeholder,
  autoFocus = false,
  onNavigate,
}: {
  variant?: Variant;
  placeholder?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const listId = useId();

  const results: SearchResult[] = open ? searchArticles(query) : [];
  const showPanel = open && query.trim().length >= 2;

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const go = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    setActive(-1);
    onNavigate?.();
    router.push(result.href);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (i < results.length - 1 ? i + 1 : i));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (i > 0 ? i - 1 : -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (active >= 0 && results[active]) go(results[active]);
      else if (results[0]) go(results[0]);
    } else if (event.key === 'Escape') {
      setOpen(false);
      setActive(-1);
      inputRef.current?.blur();
    }
  };

  const isHero = variant === 'hero';
  const isPanel = variant === 'panel';

  const shell = isHero
    ? 'h-14 rounded-2xl border-2 border-ink/10 bg-white px-5 text-[1.0625rem] shadow-card focus-within:border-brand-500'
    : isPanel
      ? 'h-12 rounded-xl border border-slate-300 bg-white px-4 text-[0.9375rem] focus-within:border-brand-500'
      : 'h-10 rounded-full border border-slate-300 bg-white px-4 text-[0.875rem] focus-within:border-brand-500';

  return (
    <div ref={rootRef} className={`relative w-full ${isHero ? 'mx-auto max-w-2xl' : ''}`}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (results[0]) go(results[active >= 0 ? active : 0]);
        }}
      >
        <div className={`flex items-center gap-3 transition-colors ${shell}`}>
          <svg
            className={`shrink-0 text-ink-faint ${isHero ? 'h-5 w-5' : 'h-4 w-4'}`}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M18 18l-4.5-4.5M15 9a6 6 0 11-12 0 6 6 0 0112 0z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            autoFocus={autoFocus}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder ?? `Search ${ARTICLE_COUNT} guides`}
            aria-label="Search guides"
            aria-expanded={showPanel}
            aria-controls={listId}
            aria-autocomplete="list"
            role="combobox"
            className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-faint [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActive(-1);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="shrink-0 rounded p-1 text-ink-faint transition-colors hover:text-ink-soft"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {showPanel && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lift"
        >
          {results.length === 0 ? (
            <p className="px-4 py-5 text-[0.875rem] text-ink-muted">
              Nothing matches “{query.trim()}”. Try a shorter phrase, or{' '}
              <Link href="/guides" className="font-medium text-brand-700 underline" onClick={() => setOpen(false)}>
                browse all guides
              </Link>
              .
            </p>
          ) : (
            <ul className="max-h-[22rem] overflow-y-auto py-1">
              {results.map((result, index) => (
                <li key={result.slug}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(result)}
                    className={`block w-full px-4 py-2.5 text-left transition-colors ${
                      index === active ? 'bg-brand-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-[0.6875rem] font-bold uppercase tracking-wider text-brand-600">
                      {result.categoryLabel}
                    </span>
                    <span className="mt-0.5 block text-[0.9375rem] font-semibold leading-snug text-ink">
                      {result.title}
                    </span>
                    <span className="mt-0.5 block line-clamp-1 text-[0.8125rem] text-ink-muted">
                      {result.description}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
