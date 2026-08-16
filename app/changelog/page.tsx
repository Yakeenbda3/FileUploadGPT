import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';

export const metadata: Metadata = {
  title: 'FileUploadGPT changelog',
  description:
    'What has changed in the extension and on this site, with dates. Short, because the extension does one thing and does not need much changing.',
  alternates: { canonical: '/changelog' },
};

interface Entry {
  date: string;
  label: string;
  title: string;
  items: string[];
}

// Only things that actually happened, with the dates they happened on. A changelog padded with
// invented releases is worse than a short one, because the first time a reader spots an entry that
// never shipped, nothing else on the site is trustworthy either.
const ENTRIES: Entry[] = [
  {
    date: '2026-08-16',
    label: 'Website',
    title: 'Site rebuilt',
    items: [
      'Rebuilt the site so that canonical tags, the sitemap, and structured data are generated from one source rather than typed into each page. The previous version had 23 pages declaring a canonical URL that returned 404.',
      'Every ChatGPT limit quoted on the site now comes from OpenAI\'s own documentation and records the date it was last checked.',
      'Rewrote all twelve guides, with the facts corrected against the source.',
      'Added a persistent install prompt that behaves sensibly on phones, where extensions cannot be installed at all.',
      'Old .html addresses now redirect permanently to their new clean URLs, so nothing that was linked or indexed is lost.',
    ],
  },
  {
    date: '2025-12-16',
    label: 'Extension v1.0.0',
    title: 'First release',
    items: [
      'Reads PDF, DOCX, TXT, MD and HTML files in the browser and extracts the text.',
      'Splits documents into pieces ChatGPT accepts and sends them in order.',
      'Sends an instruction first so ChatGPT waits for every part before answering.',
      'Progress display and the ability to cancel part way through.',
      'Four prompt shortcuts: summary, professional rewrite, code review, and quiz questions.',
    ],
  },
];

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function ChangelogPage() {
  return (
    <PageShell
      title="Changelog"
      intro="The extension does one thing, so this list is short by design. Everything here shipped."
      path="/changelog"
    >
      <div className="space-y-10">
        {ENTRIES.map((entry) => (
          <article key={entry.date} className="border-l-2 border-brand-200 pl-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[0.75rem] font-semibold text-brand-700">
                {entry.label}
              </span>
              <time dateTime={entry.date} className="text-[0.8125rem] text-ink-muted">
                {formatDate(entry.date)}
              </time>
            </div>
            <h2 className="mt-2 text-[1.25rem] font-bold text-ink">{entry.title}</h2>
            <ul className="mt-3 space-y-2">
              {entry.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
