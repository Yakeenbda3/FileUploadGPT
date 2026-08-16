import Link from 'next/link';
import { CATEGORIES } from '@/lib/articles';
import { CHROME_STORE_URL, SITE_NAME } from '@/lib/site';

const PRODUCT = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/features', label: 'Features' },
  { href: '/install', label: 'Install it' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/use-cases', label: 'Use cases' },
  { href: '/changelog', label: 'Changelog' },
];

const COMPANY = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy-policy', label: 'Privacy' },
  { href: '/terms-of-service', label: 'Terms' },
];

/**
 * Footer, and the site's main internal linking surface.
 *
 * Every content hub is linked from every page. On a site whose articles are mostly reached straight
 * from a search result, the footer is often the only route a crawler has from one cluster to
 * another, and orphaned clusters get crawled rarely and rank accordingly.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[1.0625rem] font-bold text-ink">
              FileUpload<span className="text-brand-700">GPT</span>
            </p>
            <p className="mt-2 max-w-xs text-[0.875rem] leading-relaxed text-ink-muted">
              A free Chrome extension that gets documents into ChatGPT when they are past the upload
              limit. Everything runs in your own browser.
            </p>
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener"
              className="btn btn-install mt-4 px-4 py-2.5 text-[0.875rem]"
            >
              Add to Chrome, it is free
            </a>
          </div>

          <div>
            <p className="text-[0.8125rem] font-bold uppercase tracking-wider text-ink">Guides</p>
            <ul className="mt-3 space-y-2">
              {Object.values(CATEGORIES).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/guides/${category.slug}`}
                    className="text-[0.875rem] text-ink-muted transition-colors hover:text-brand-700"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[0.8125rem] font-bold uppercase tracking-wider text-ink">Product</p>
            <ul className="mt-3 space-y-2">
              {PRODUCT.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.875rem] text-ink-muted transition-colors hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[0.8125rem] font-bold uppercase tracking-wider text-ink">Company</p>
            <ul className="mt-3 space-y-2">
              {COMPANY.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.875rem] text-ink-muted transition-colors hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-[0.8125rem] text-ink-faint">
          <p>
            &copy; {year} {SITE_NAME}. Not affiliated with, endorsed by, or sponsored by OpenAI.
            ChatGPT is a trademark of OpenAI.
          </p>
        </div>
      </div>
    </footer>
  );
}
