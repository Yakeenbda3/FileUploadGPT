'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CHROME_STORE_URL, SITE_NAME } from '@/lib/site';
import { NAV_TREE, NAV_UTILITY } from '@/lib/nav';
import SiteSearch from '@/components/search/SiteSearch';

/**
 * Site header: a brand band over a navigation band.
 *
 * Two bars rather than one because they do different jobs. The top band carries identity, search
 * and the install button, which are wanted on every page. The band underneath is purely the
 * content map, and giving it its own row means every category can be a real dropdown holding every
 * article rather than a single "Guides" link.
 *
 * The dropdown panels are always rendered and hidden with a class, never conditionally mounted.
 * That is deliberate: it puts a link to all ninety-odd articles into the server HTML of every page
 * on the site. Internal linking is one of the few ranking inputs entirely under our control, and
 * mounting the menu on interaction gives it away, because a crawler never hovers.
 */
export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Any navigation closes everything. Without this the mega-menu stays open over the page you
  // just asked for, which reads as the click not having worked.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* ── Brand band ──────────────────────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
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

          <div className="mx-auto hidden w-full max-w-md md:block">
            <SiteSearch variant="bar" />
          </div>

          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener"
            className="btn btn-install ml-auto hidden shrink-0 px-4 py-2.5 text-[0.875rem] md:ml-0 md:inline-flex"
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
      </div>

      {/* ── Navigation band ─────────────────────────────────────────────────────────────────── */}
      <div ref={navRef} className="hidden border-b border-slate-200 bg-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <nav className="flex items-stretch" aria-label="Guide categories">
            {NAV_TREE.map((category) => {
              const open = openMenu === category.key;
              const panelWidth = Math.min(category.columns.length * 250 + 32, 1040);
              return (
                <div
                  key={category.key}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(category.key)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenMenu(open ? null : category.key)}
                    aria-expanded={open}
                    aria-haspopup="true"
                    className={`flex items-center gap-1.5 border-b-2 px-3.5 py-3 text-[0.875rem] font-medium transition-colors ${
                      isActive(category.href) || open
                        ? 'border-brand-600 text-brand-700'
                        : 'border-transparent text-ink-soft hover:text-brand-700'
                    }`}
                  >
                    {category.short}
                    <span className="text-[0.6875rem] font-normal text-ink-faint">{category.count}</span>
                    <svg
                      className={`h-2.5 w-2.5 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`}
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>

                  <div
                    className={`absolute left-0 top-full z-50 ${open ? '' : 'pointer-events-none invisible'}`}
                    style={{ width: `${panelWidth}px`, maxWidth: 'calc(100vw - 3rem)' }}
                  >
                    <div className="overflow-hidden rounded-b-xl border border-t-0 border-slate-200 bg-white shadow-lift">
                      <div className="h-0.5 bg-brand-600" />
                      <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
                        <p className="text-[0.8125rem] text-ink-muted">{category.blurb}</p>
                        <Link
                          href={category.href}
                          className="shrink-0 whitespace-nowrap text-[0.8125rem] font-semibold text-brand-700 hover:underline"
                        >
                          All {category.count}
                        </Link>
                      </div>
                      <div
                        className="grid gap-x-6 p-4"
                        style={{ gridTemplateColumns: `repeat(${category.columns.length}, minmax(0, 1fr))` }}
                      >
                        {category.columns.map((column, index) => (
                          <ul key={index} className="space-y-0.5">
                            {column.links.map((link) => (
                              <li key={link.slug}>
                                <Link
                                  href={link.href}
                                  className="block rounded px-2 py-1.5 text-[0.8125rem] leading-snug text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-800"
                                >
                                  {link.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            {NAV_UTILITY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-2 text-[0.875rem] transition-colors ${
                  isActive(item.href) ? 'font-medium text-brand-700' : 'text-ink-muted hover:text-brand-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ───────────────────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-slate-200 bg-white px-4 pb-6 pt-4 md:hidden"
        >
          <SiteSearch variant="panel" onNavigate={() => setMobileOpen(false)} />

          <div className="mt-4">
            {NAV_TREE.map((category) => {
              const open = mobileSection === category.key;
              return (
                <div key={category.key} className="border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => setMobileSection(open ? null : category.key)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between py-3 text-left"
                  >
                    <span className="text-[0.9375rem] font-medium text-ink">{category.label}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-[0.75rem] text-ink-faint">{category.count}</span>
                      <svg
                        className={`h-3 w-3 text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`}
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  {open && (
                    <div className="pb-2">
                      <Link
                        href={category.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 pl-3 text-[0.875rem] font-semibold text-brand-700"
                      >
                        All {category.count} guides
                      </Link>
                      {category.columns.flatMap((c) => c.links).map((link) => (
                        <Link
                          key={link.slug}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 pl-3 text-[0.875rem] leading-snug text-ink-soft"
                        >
                          {link.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {NAV_UTILITY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-slate-200 py-3 text-[0.9375rem] font-medium text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener"
            className="btn btn-install mt-5 w-full py-3 text-[0.9375rem]"
          >
            Add to Chrome, it is free
          </a>
        </nav>
      )}
    </header>
  );
}
