'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CHROME_STORE_URL, SITE_NAME } from '@/lib/site';
import { CATEGORIES } from '@/lib/articles';

const PRIMARY_NAV = [
  { href: '/guides', label: 'Guides' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/faq', label: 'FAQ' },
] as const;

const CATEGORY_LINKS = Object.values(CATEGORIES).map((c) => ({
  href: `/guides/${c.slug}`,
  label: c.label,
  blurb: c.blurb,
}));

/**
 * Site header.
 *
 * The category links are rendered into the server HTML rather than being fetched or mounted on
 * interaction, so every crawl of every page carries a link to every content hub. Internal linking
 * is one of the few ranking inputs entirely under our control, and hiding it behind a click is
 * giving it away.
 */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={`${SITE_NAME} home`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 11V2.8m0 0L5.2 5.6M8 2.8l2.8 2.8M2.8 10.4v1.8A1.8 1.8 0 0 0 4.6 14h6.8a1.8 1.8 0 0 0 1.8-1.8v-1.8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-[1.0625rem] font-bold tracking-[-0.01em] text-ink">
            FileUpload<span className="text-brand-700">GPT</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex" aria-label="Main">
          <div
            className="relative"
            onMouseEnter={() => setGuidesOpen(true)}
            onMouseLeave={() => setGuidesOpen(false)}
          >
            <Link
              href="/guides"
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-[0.9375rem] font-medium transition-colors ${
                isActive('/guides') ? 'text-brand-700' : 'text-ink-soft hover:text-brand-700'
              }`}
            >
              Guides
              <svg className="h-3 w-3 opacity-60" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
            {guidesOpen && (
              <div className="absolute left-0 top-full w-80 pt-2">
                <div className="animate-fade-in rounded-xl border border-slate-200 bg-white p-2 shadow-lift">
                  {CATEGORY_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-brand-50"
                    >
                      <span className="block text-[0.875rem] font-semibold text-ink">{link.label}</span>
                      <span className="mt-0.5 block text-[0.75rem] leading-snug text-ink-muted">
                        {link.blurb}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {PRIMARY_NAV.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-[0.9375rem] font-medium transition-colors ${
                isActive(item.href) ? 'text-brand-700' : 'text-ink-soft hover:text-brand-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={CHROME_STORE_URL}
          target="_blank"
          rel="noopener"
          className="btn btn-install ml-auto hidden px-4 py-2.5 text-[0.875rem] md:ml-0 md:inline-flex"
        >
          Add to Chrome
        </a>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label="Menu"
          className="ml-auto rounded-lg p-2 text-ink-soft md:hidden"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="animate-fade-in border-t border-slate-200 bg-white px-4 pb-5 pt-3 md:hidden"
        >
          <p className="px-1 pb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-ink-faint">
            Guides
          </p>
          {CATEGORY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-1 py-2.5 text-[0.9375rem] text-ink-soft"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 border-t border-slate-200 pt-3">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-1 py-2.5 text-[0.9375rem] font-medium text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
