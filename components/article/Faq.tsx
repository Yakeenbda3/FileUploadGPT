/**
 * The article's FAQ block.
 *
 * Built on native `<details>` rather than a JavaScript accordion, for three reasons that all
 * matter here: it works before hydration, so a reader on a slow phone can open an answer
 * immediately; keyboard and screen reader behaviour is correct without any ARIA work; and the
 * answers are present in the server HTML, which is what a crawler reads. A JS accordion that
 * mounts answers on click hides them from the FAQ rich result entirely.
 *
 * The same `items` array feeds the FAQPage structured data on the page, so what Google is told and
 * what the reader sees cannot fall out of sync.
 */
export function Faq({ items }: { items: Array<{ q: string; a: string }> }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-14" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-[1.625rem] font-bold tracking-[-0.01em] text-ink">
        Common questions
      </h2>
      <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
        {items.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[1rem] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
              {item.q}
              <svg
                className="mt-1 h-4 w-4 shrink-0 text-brand-600 transition-transform group-open:rotate-45"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </summary>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
