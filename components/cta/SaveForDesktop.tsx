'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SITE_URL } from '@/lib/site';

const INSTALL_PAGE = `${SITE_URL}/install`;
const SHARE_TEXT =
  'FileUploadGPT: a free Chrome extension that lets ChatGPT accept documents that are too big to upload. Open this on a computer to install it.';

type Outcome = 'idle' | 'shared' | 'copied' | 'failed';

/**
 * The mobile path to conversion.
 *
 * A phone cannot install a Chrome extension, so the honest options are to waste the visit or to
 * carry the intent across to the device that can. This does the second: one tap hands the install
 * link to the OS share sheet, or failing that the clipboard, or failing that a pre-filled email.
 *
 * The fallback chain matters because each step really does fail somewhere in the wild.
 * `navigator.share` needs a secure context and a real user gesture and does not exist on most
 * desktop browsers. `navigator.clipboard` is blocked outright in some in-app browsers, which is
 * exactly where a lot of social traffic lands. The mailto link always works.
 */
export function SaveForDesktop({ className = '' }: { className?: string }) {
  const [outcome, setOutcome] = useState<Outcome>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const announce = useCallback((next: Outcome) => {
    setOutcome(next);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setOutcome('idle'), 4000);
  }, []);

  const handleClick = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'FileUploadGPT', text: SHARE_TEXT, url: INSTALL_PAGE });
        announce('shared');
        return;
      } catch (error) {
        // A visitor dismissing the share sheet throws AbortError. That is not a failure and must
        // not fall through to copying something they chose not to send.
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(INSTALL_PAGE);
      announce('copied');
    } catch {
      announce('failed');
    }
  }, [announce]);

  // Kept short on purpose. This button sits beside two lines of text in a bar 390px wide on the
  // commonest phone, and "Send to my computer" squeezed the label next to it until it truncated
  // mid-word.
  const label =
    outcome === 'shared'
      ? 'Sent'
      : outcome === 'copied'
        ? 'Copied'
        : outcome === 'failed'
          ? 'Email it'
          : 'Send to computer';

  if (outcome === 'failed') {
    return (
      <a
        className={`btn btn-install ${className}`}
        href={`mailto:?subject=${encodeURIComponent('FileUploadGPT for ChatGPT')}&body=${encodeURIComponent(`${SHARE_TEXT}\n\n${INSTALL_PAGE}`)}`}
      >
        Email it to myself
      </a>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={`btn btn-install ${className}`}>
      <span aria-live="polite">{label}</span>
      {outcome === 'idle' ? (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5M3.5 12.5v2A2.5 2.5 0 0 0 6 17h8a2.5 2.5 0 0 0 2.5-2.5v-2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M4.5 10.5 8 14l7.5-8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
