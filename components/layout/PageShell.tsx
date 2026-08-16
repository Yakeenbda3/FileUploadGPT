import type { ReactNode } from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/jsonld';

/**
 * The shell for ordinary content pages: install, pricing, legal, and so on.
 *
 * Exists so the h1, the breadcrumb, the breadcrumb schema, and the reading width are defined once.
 * On the old site each of these was hand-written into thirty-odd HTML files, which is how they
 * drifted into disagreeing with each other about their own canonical URLs.
 */
export function PageShell({
  title,
  intro,
  path,
  wide = false,
  children,
}: {
  title: string;
  intro?: string;
  /** Site-relative path, for the breadcrumb schema. */
  path: string;
  /** Legal and reference pages read better narrow; marketing pages need the room. */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <JsonLd
        schemas={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: title, path }])]}
      />
      <div className={`mx-auto px-4 py-12 sm:px-6 lg:py-16 ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>
        <nav aria-label="Breadcrumb" className="mb-5 text-[0.8125rem] text-ink-muted">
          <Link href="/" className="transition-colors hover:text-brand-700">
            Home
          </Link>
        </nav>
        <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">{intro}</p>
        )}
        <div className="mt-10">{children}</div>
      </div>
    </>
  );
}
