import { CHATGPT_FACTS, stateFact, type FactKey } from '@/lib/chatgpt-facts';

/**
 * Renders one verified fact about ChatGPT inline in prose.
 *
 * Writing `<Fact k="freeDailyUploads" />` instead of typing "3 file uploads per day" means the day
 * OpenAI changes it, one edit in lib/chatgpt-facts.ts corrects every article at once. With a
 * hundred articles quoting these numbers, the alternative is a slow drift into being wrong in
 * places nobody remembers to look.
 *
 * The `title` attribute carries the source and check date, so the provenance of any number on the
 * site is one hover away without cluttering the sentence it sits in.
 */
export function Fact({ k }: { k: FactKey }) {
  const fact = CHATGPT_FACTS[k] as { source: string; verifiedOn: string; status: string };
  return (
    <span
      title={`Checked against ${fact.source} on ${fact.verifiedOn}`}
      className={fact.status === 'verified' ? undefined : 'underline decoration-dotted'}
    >
      {stateFact(k)}
    </span>
  );
}
