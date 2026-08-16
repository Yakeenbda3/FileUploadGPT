'use client';

import { useEffect, useState } from 'react';

export type BrowserFamily = 'chromium' | 'safari' | 'firefox' | 'unknown';

export interface DeviceCapability {
  /**
   * False during server render and the first client render, true after mount.
   *
   * Everything below is unknowable on the server, so the first client render MUST produce the same
   * markup the server did or React throws a hydration mismatch. Components read `ready` and keep
   * showing the neutral default until it flips.
   */
  ready: boolean;
  /** Phone or tablet. The extension cannot be installed here at all. */
  isMobile: boolean;
  browserFamily: BrowserFamily;
  /**
   * True only where the Chrome Web Store can actually install this: a desktop Chromium browser.
   * Everything else gets a different, honest call to action rather than a button that leads to a
   * page telling them no.
   */
  canInstall: boolean;
}

const INITIAL: DeviceCapability = {
  ready: false,
  isMobile: false,
  browserFamily: 'unknown',
  canInstall: false,
};

function detect(): DeviceCapability {
  const ua = navigator.userAgent;

  // userAgentData is the accurate signal where it exists (Chromium). The UA-string check is the
  // fallback for Safari and Firefox, which do not implement it.
  //
  // iPadOS deliberately lies: since iPadOS 13 Safari sends a desktop Mac user agent. The giveaway
  // is a Mac that reports touch points, since no real Mac does. Without this an iPad user is shown
  // an install button that cannot possibly work.
  const uaDataMobile = (navigator as Navigator & { userAgentData?: { mobile?: boolean } })
    .userAgentData?.mobile;
  const looksLikePhone = /Android|iPhone|iPod|Windows Phone/i.test(ua);
  const iPadPretendingToBeAMac =
    /Macintosh/.test(ua) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1;
  const isMobile = uaDataMobile === true || looksLikePhone || /iPad/i.test(ua) || iPadPretendingToBeAMac;

  // Order matters. Every Chromium browser puts "Safari" in its UA string, and Edge and Opera both
  // put "Chrome" in theirs, so the specific names have to be ruled in before the generic ones.
  let browserFamily: BrowserFamily = 'unknown';
  if (/Firefox\/|FxiOS/i.test(ua)) {
    browserFamily = 'firefox';
  } else if (/Edg\/|OPR\/|Chrome\/|CriOS/i.test(ua)) {
    browserFamily = 'chromium';
  } else if (/Safari\//i.test(ua)) {
    browserFamily = 'safari';
  }

  return {
    ready: true,
    isMobile,
    browserFamily,
    canInstall: !isMobile && browserFamily === 'chromium',
  };
}

/**
 * What this visitor's device can actually do, resolved after mount.
 *
 * The point of this hook is that the product is desktop-only and a large share of search traffic
 * is not. Showing a phone an "Add to Chrome" button sends it to a store page that will refuse to
 * install, which is a dead end at the exact moment the visitor was willing to act.
 */
export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>(INITIAL);

  useEffect(() => {
    setCapability(detect());
  }, []);

  return capability;
}
