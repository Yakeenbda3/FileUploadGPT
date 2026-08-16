import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { StickyInstallBar } from '@/components/cta/StickyInstallBar';
import { JsonLd } from '@/components/JsonLd';
import { Analytics } from '@/components/Analytics';
import { organizationSchema, websiteSchema } from '@/lib/jsonld';
import { INDEXABLE, SITE_NAME, SITE_URL } from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  // metadataBase is what makes every relative canonical and Open Graph URL in the app resolve to an
  // absolute one. Without it Next emits relative URLs, which are valid HTML and useless as a
  // canonical, since the whole job of the tag is to name one absolute address.
  metadataBase: new URL(SITE_URL),

  // No `template`. A brand suffix appended to every page eats characters Google truncates at around
  // 60, and on a site whose visitors arrive from an informational query, "ChatGPT file size limit"
  // earns the click and "| FileUploadGPT" does not. Pages that want the brand in the title put it
  // there themselves.
  title: 'FileUploadGPT: get big files into ChatGPT',
  description:
    'A free Chrome extension that splits documents ChatGPT will not accept and feeds them in for you. Works with PDF, Word, text and markdown files.',

  robots: INDEXABLE
    ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } }
    : { index: false, follow: false },

  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    url: SITE_URL,
  },
  twitter: { card: 'summary_large_image' },

  // NO canonical here, deliberately. A canonical is a per-page statement of "this page's one true
  // address", so a default at the layout level is always a lie for every page except one. Declared
  // here it was inherited by the 404 page, which then told Google it was the homepage. Every page
  // declares its own; anything that forgets gets no canonical, which is correct behaviour rather
  // than a confidently wrong one.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {/* Site-wide schema, declared once at the root with stable @ids so every page's own Article
            and Breadcrumb schema can reference the publisher instead of repeating it. */}
        <JsonLd schemas={[organizationSchema(), websiteSchema()]} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>

        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyInstallBar />
        <Analytics />
      </body>
    </html>
  );
}
