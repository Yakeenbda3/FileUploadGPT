/**
 * A centred two-tone section title with a hairline rule under it.
 *
 * Borrowed from the reference project, where every section is introduced the same way: a short
 * phrase in the text colour, the noun it is about in the accent colour, and a thin rule spanning
 * the content width. It does more work than it looks like it does. On a long page of stacked
 * sections it gives the eye a fixed landmark to find, and the accent word turns the heading into a
 * label you can scan for rather than a sentence you have to read.
 */
export default function SectionHeading({
  lead,
  accent,
  blurb,
  align = 'center',
  as: Tag = 'h2',
}: {
  lead: string;
  accent: string;
  blurb?: string;
  align?: 'center' | 'left';
  as?: 'h1' | 'h2' | 'h3';
}) {
  const centred = align === 'center';
  return (
    <div className={centred ? 'text-center' : 'text-left'}>
      <Tag className="text-[1.5rem] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[1.875rem]">
        {lead} <span className="text-brand-700">{accent}</span>
      </Tag>
      <div
        className={`mt-4 h-px bg-slate-200 ${centred ? 'mx-auto w-full max-w-2xl' : 'w-full max-w-md'}`}
      />
      {blurb && (
        <p
          className={`mt-4 text-[1rem] leading-relaxed text-ink-soft ${
            centred ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          }`}
        >
          {blurb}
        </p>
      )}
    </div>
  );
}
