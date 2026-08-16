'use client';

import { CHROME_STORE_URL } from '@/lib/site';
import { useDeviceCapability } from './useDeviceCapability';
import { SaveForDesktop } from './SaveForDesktop';

const STEPS = [
  'Add it to Chrome from the Web Store',
  'Open ChatGPT like you normally would',
  'Pick your file and it handles the rest',
];

/**
 * The desktop call to action: a card that rides along in the article's right rail.
 *
 * `position: sticky` inside a grid column, so it follows the reader down a long article and is
 * still there when they reach the part that convinces them, wherever that turns out to be.
 *
 * It repeats the three install steps rather than just showing a button because a meaningful share
 * of this audience has never installed a browser extension and does not know that "add to Chrome"
 * is a twenty-second, no-account, no-payment action. Saying so is worth more than another
 * adjective about the product.
 */
export function InstallCard() {
  const { ready, isMobile, canInstall } = useDeviceCapability();

  return (
    // Not sticky itself. Stickiness belongs to the rail that holds it, because a sticky element
    // nested inside another sticky element resolves against the wrong containing block and ends up
    // pinned in a place nobody intended.
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-brand-50/80 to-white p-5 shadow-card">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-600">
        Free Chrome extension
      </p>
      <p className="mt-2 text-[1.0625rem] font-bold leading-snug text-ink">
        Upload files ChatGPT says are too big
      </p>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-soft">
        FileUploadGPT splits your document into pieces ChatGPT will accept and sends them in for
        you, so the upload limit stops being your problem.
      </p>

      <ol className="mt-4 space-y-2.5">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-2.5 text-[0.8125rem] leading-snug text-ink-soft">
            <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[0.6875rem] font-bold text-white">
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className="mt-5">
        {/* Before detection resolves, show the plain store link. It is correct for the desktop
            majority who see this card, and it means the card is never empty. */}
        {!ready || canInstall ? (
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener"
            className="btn btn-install w-full"
          >
            Add to Chrome, it is free
          </a>
        ) : isMobile ? (
          <SaveForDesktop className="w-full" />
        ) : (
          <a href="/install" className="btn btn-install w-full">
            How to install it
          </a>
        )}
      </div>

      <p className="mt-3 text-center text-[0.75rem] text-ink-muted">
        {ready && isMobile
          ? 'Extensions need a computer. Chrome on phones cannot run them.'
          : 'No account, no payment, no file leaves your browser.'}
      </p>
    </div>
  );
}
