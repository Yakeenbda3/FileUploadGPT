'use client';

import { CHROME_STORE_URL } from '@/lib/site';
import { useDeviceCapability } from './useDeviceCapability';
import { SaveForDesktop } from './SaveForDesktop';

/**
 * A call to action placed inside the article body, roughly where the reader has just understood
 * the problem and has not yet been given a solution.
 *
 * Separate from the sticky bar on purpose. The sticky bar is always there and therefore easy to
 * stop seeing; this one interrupts the prose once, in context, at the moment it is relevant. On
 * mobile it also gives the "send it to my computer" action a full-width target, which is hard to
 * miss in a way the compact bottom bar is not.
 */
export function InlineInstall({
  heading = 'The quicker way to do this',
  body = 'FileUploadGPT is a free Chrome extension that splits your file into pieces ChatGPT accepts and sends them in for you. No copying, no pasting, no splitting anything by hand.',
}: {
  heading?: string;
  body?: string;
}) {
  const { ready, isMobile, canInstall } = useDeviceCapability();

  return (
    <aside className="not-prose my-9 overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-accent-50/40">
      <div className="p-5 sm:flex sm:items-center sm:gap-6 sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-[1.0625rem] font-bold leading-snug text-ink">{heading}</p>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">{body}</p>
          {ready && isMobile && (
            <p className="mt-2 text-[0.8125rem] text-ink-muted">
              It runs on a computer, not a phone. Send yourself the link and it will be waiting.
            </p>
          )}
        </div>
        <div className="mt-4 shrink-0 sm:mt-0">
          {!ready || canInstall ? (
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener"
              className="btn btn-install w-full sm:w-auto"
            >
              Add to Chrome, it is free
            </a>
          ) : isMobile ? (
            <SaveForDesktop className="w-full sm:w-auto" />
          ) : (
            <a href="/install" className="btn btn-install w-full sm:w-auto">
              How to install it
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
