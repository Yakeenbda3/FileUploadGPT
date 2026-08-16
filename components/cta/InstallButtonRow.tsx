'use client';

import { CHROME_STORE_URL } from '@/lib/site';
import { useDeviceCapability } from './useDeviceCapability';
import { SaveForDesktop } from './SaveForDesktop';

/**
 * The primary install control on the install page.
 *
 * Larger and more explicit than the sticky bar, and it states the device situation in words rather
 * than only changing the button. Someone who landed here from a search on a phone deserves a
 * sentence explaining why the obvious button is not what they are being offered.
 */
export function InstallButtonRow() {
  const { ready, isMobile, canInstall, browserFamily } = useDeviceCapability();

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-accent-50/40 p-6 sm:p-8">
      {!ready || canInstall ? (
        <>
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener"
            className="btn btn-install px-6 py-4 text-base"
          >
            Add to Chrome, it is free
          </a>
          <p className="mt-3 text-[0.875rem] text-ink-muted">
            Opens the official Chrome Web Store listing. No account, no payment.
          </p>
        </>
      ) : isMobile ? (
        <>
          <p className="text-[1.0625rem] font-semibold text-ink">
            You are on a phone or tablet, so this cannot install here
          </p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
            Mobile Chrome does not support extensions. Send yourself this link and open it on a
            computer, and the install takes about twenty seconds.
          </p>
          <div className="mt-5">
            <SaveForDesktop className="px-6 py-4 text-base" />
          </div>
        </>
      ) : (
        <>
          <p className="text-[1.0625rem] font-semibold text-ink">
            {browserFamily === 'firefox'
              ? 'This is a Chrome extension, and you are on Firefox'
              : browserFamily === 'safari'
                ? 'This is a Chrome extension, and you are on Safari'
                : 'This needs a Chromium browser'}
          </p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
            It works in Chrome, Edge, Brave, Arc, Opera, and other Chromium browsers. Open this page
            in one of those and the install button will work.
          </p>
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener"
            className="btn btn-ghost mt-5 px-5 py-3"
          >
            View the store listing anyway
          </a>
        </>
      )}
    </div>
  );
}
