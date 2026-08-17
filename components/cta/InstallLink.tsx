import type { ReactNode } from 'react';
import { CHROME_STORE_URL } from '@/lib/site';

/**
 * An inline link straight to the Chrome Web Store listing, for use inside article prose.
 *
 * It exists so the store URL is never typed into an article. The listing address contains the
 * extension's id, and an id pasted into a hundred MDX files is a hundred places to update if it
 * ever moves, with no build error to tell you which ones you missed. Here it resolves from the
 * single constant in lib/site.ts.
 *
 * Rendered slightly heavier than a normal body link, because in an answer box it is the one thing
 * on the page we are actually asking the reader to do.
 */
export function InstallLink({ children }: { children?: ReactNode }) {
  return (
    <a
      href={CHROME_STORE_URL}
      target="_blank"
      rel="noopener"
      className="font-semibold text-brand-700 underline decoration-brand-400 decoration-2 underline-offset-2 transition-colors hover:text-brand-800 hover:decoration-brand-600"
    >
      {children ?? 'add it to Chrome, free'}
    </a>
  );
}
