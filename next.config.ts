import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import { LEGACY_REDIRECTS } from './lib/redirects';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // Clean URLs are the canonical shape (decision, 16 Aug 2026). Next serves /blog/foo with no
  // suffix; every legacy .html address 308s onto it via LEGACY_REDIRECTS below.
  trailingSlash: false,

  // Metadata that React renders (title, canonical, robots) must land in <head>, not <body>.
  //
  // This setting is not cosmetic. On the reference project it was the single worst SEO defect
  // found in a full crawl: for crawlers not on Next's built-in allow-list, React streamed the
  // metadata into <body>, where Google does not read it. Every canonical and every robots
  // directive on the entire commercial surface was silently ignored.
  //
  // Setting this key REPLACES Next's default list rather than extending it, so the value must be
  // the full default list plus our additions, never just our additions.
  htmlLimitedBots:
    /Mediapartners-Google|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Googlebot|Google-InspectionTool|GoogleOther|Storebot-Google/,

  async redirects() {
    return LEGACY_REDIRECTS;
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
