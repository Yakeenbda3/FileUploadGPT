import { jsonLdScript } from '@/lib/jsonld';

/**
 * Renders schema objects as `application/ld+json` script tags.
 *
 * Rendered on the server into the initial HTML, deliberately. Structured data injected after
 * hydration is only seen if the crawler runs and waits for JavaScript, which is not something to
 * depend on for the markup that produces rich results.
 */
export function JsonLd({ schemas }: { schemas: unknown[] }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }}
        />
      ))}
    </>
  );
}
