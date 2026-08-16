import Script from 'next/script';

// The same Google Analytics property the previous site used. Carried across deliberately: a new
// measurement ID would have started the history from zero, and the whole point of the rebuild is
// being able to see whether it worked against what came before.
const GA_MEASUREMENT_ID = 'G-Y6VWG87TVB';

/**
 * Google Analytics, loaded after the page is interactive.
 *
 * `afterInteractive` rather than `beforeInteractive`, because analytics is never worth delaying the
 * page for. On a site whose visitors arrive from a search result and decide within a couple of
 * seconds whether to stay, a measurement script that blocks rendering costs more traffic than it
 * measures.
 */
export function Analytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
