'use client';

import { useState } from 'react';
import { CHROME_STORE_URL } from '@/lib/site';
import { useDeviceCapability } from './useDeviceCapability';
import { SaveForDesktop } from './SaveForDesktop';

/**
 * The persistent install prompt, pinned to the bottom of the viewport on phones and tablets.
 *
 * It is fixed rather than sticky-at-the-end because the visitor arrived from a search result, will
 * read a paragraph or two, and may leave from anywhere on the page. A call to action at the bottom
 * of a 2,000-word article is only seen by the few who finish it.
 *
 * Three audiences, three different asks:
 *
 *   desktop Chromium  the store link works, so ask for the install
 *   desktop Safari/FF the store link leads to a refusal, so name the browsers that do work
 *   phone or tablet   installing is impossible, so carry the intent to a computer instead
 *
 * The third case is the one that matters most here, because it is a large share of search traffic
 * and the naive version of this component throws all of it away.
 *
 * Nothing renders until `ready`, so the server HTML and the first client render agree, and nobody
 * sees an "Add to Chrome" button flip into something else a moment later.
 */
export function StickyInstallBar() {
  const { ready, isMobile, canInstall, browserFamily } = useDeviceCapability();
  const [explainerOpen, setExplainerOpen] = useState(false);

  return (
    <>
      {/* Without JavaScript there is no detection, so offer the one link that is correct for
          everyone: the install page, which explains the desktop requirement in prose. */}
      <noscript>
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-800 bg-brand-900 px-4 py-3 text-center text-sm text-white lg:hidden">
          <a href="/install" className="font-semibold underline">
            Get FileUploadGPT, free for Chrome on desktop
          </a>
        </div>
      </noscript>

      {ready && (
        <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
          {explainerOpen && (
            <div
              id="sticky-explainer"
              className="animate-fade-in border-t border-slate-200 bg-white px-4 pb-4 pt-4 shadow-sticky"
            >
              <p className="text-sm font-semibold text-ink">What this actually is</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">
                A browser extension is a small add-on for Chrome on a laptop or desktop. Ours watches
                for files ChatGPT refuses, splits them into pieces it will accept, and feeds them in
                for you. You keep using ChatGPT normally and the size limit stops getting in the way.
              </p>
              {isMobile && (
                <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-soft">
                  It cannot run on a phone or tablet, because those versions of Chrome do not support
                  extensions at all. Send yourself the link, open it on your computer, and click Add
                  to Chrome. It takes about twenty seconds and it is free.
                </p>
              )}
              <button
                type="button"
                onClick={() => setExplainerOpen(false)}
                className="mt-3 text-[0.8125rem] font-medium text-brand-700 underline"
              >
                Close
              </button>
            </div>
          )}

          <div
            className="flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-sticky backdrop-blur"
            style={{ minHeight: 'var(--sticky-cta-height)' }}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9375rem] font-semibold leading-tight text-ink">
                {isMobile
                  ? 'File too big for ChatGPT?'
                  : canInstall
                    ? 'Stop hitting the upload limit'
                    : 'Works in Chrome, Edge and Brave'}
              </p>
              <button
                type="button"
                onClick={() => setExplainerOpen((open) => !open)}
                aria-expanded={explainerOpen}
                aria-controls="sticky-explainer"
                className="mt-0.5 flex items-center gap-1 text-[0.75rem] leading-tight text-ink-muted"
              >
                <span className="truncate">
                  {isMobile ? 'Free Chrome extension for computers' : 'Free, no account needed'}
                </span>
                <svg
                  className={`h-3 w-3 shrink-0 transition-transform ${explainerOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {isMobile ? (
              <SaveForDesktop className="shrink-0 px-4 py-2.5 text-[0.8125rem]" />
            ) : browserFamily === 'chromium' ? (
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener"
                className="btn btn-install shrink-0 px-4 py-2.5 text-[0.8125rem]"
              >
                Add to Chrome
              </a>
            ) : (
              <a href="/install" className="btn btn-install shrink-0 px-4 py-2.5 text-[0.8125rem]">
                How to install
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
