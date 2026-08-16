import type { Metadata } from 'next';
import Link from 'next/link';
import { CHROME_STORE_URL } from '@/lib/site';
import { CATEGORIES, getAllArticles } from '@/lib/articles';
import { JsonLd } from '@/components/JsonLd';
import { softwareApplicationSchema } from '@/lib/jsonld';
import { InstallCard } from '@/components/cta/InstallCard';

export const metadata: Metadata = {
  // Leads with the problem in the visitor's own words, not the product name. The brand earns
  // clicks on brand searches whatever the title says; everyone else is searching for their problem.
  title: 'Upload files ChatGPT says are too big',
  description:
    'FileUploadGPT is a free Chrome extension that splits documents ChatGPT will not accept and feeds them in for you. Works with PDF, Word, text and markdown.',
  alternates: { canonical: '/' },
};

const SUPPORTED = [
  { ext: 'PDF', note: 'Text-based, not scans' },
  { ext: 'DOCX', note: 'Word documents' },
  { ext: 'TXT', note: 'Plain text' },
  { ext: 'MD', note: 'Markdown' },
  { ext: 'HTML', note: 'Saved web pages' },
];

const STEPS = [
  {
    title: 'Add it to Chrome',
    body: 'One click from the Chrome Web Store. No account, no email, no payment.',
  },
  {
    title: 'Open ChatGPT as usual',
    body: 'The extension sits quietly in your toolbar until you need it.',
  },
  {
    title: 'Pick your file',
    body: 'It reads the document, splits it into pieces ChatGPT accepts, and sends them in order.',
  },
];

export default function HomePage() {
  const latest = getAllArticles().slice(0, 4);

  return (
    <>
      <JsonLd schemas={[softwareApplicationSchema()]} />

      {/* ── Hero ──────────────────────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
              <p className="text-[0.8125rem] font-semibold uppercase tracking-wider text-brand-600">
                Free Chrome extension
              </p>
              <h1 className="mt-3 max-w-2xl text-[2.25rem] font-bold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[3rem]">
                Upload files ChatGPT says are too big
              </h1>
              <p className="mt-5 max-w-xl text-[1.125rem] leading-relaxed text-ink-soft">
                ChatGPT refuses long documents, or takes them and quietly reads only the first few
                pages. FileUploadGPT splits your file into pieces it will accept and sends them in
                for you, in order, with the instructions that stop it answering early.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={CHROME_STORE_URL}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-install px-6 py-3.5 text-base"
                >
                  Add to Chrome, it is free
                </a>
                <Link href="/how-it-works" className="btn btn-ghost px-5 py-3.5">
                  See how it works
                </Link>
              </div>

              <p className="mt-4 text-[0.875rem] text-ink-muted">
                Your file is read inside your own browser. Nothing is uploaded to us.
              </p>
            </div>

            <div className="lg:pt-6">
              <InstallCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── The problem ───────────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="max-w-2xl text-[1.75rem] font-bold tracking-[-0.015em] text-ink sm:text-[2rem]">
          Why ChatGPT rejects your file
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'The file is too large',
              body: 'Past a certain size the upload is refused outright. You get a clear error and nothing happens.',
            },
            {
              title: 'The document is too long',
              body: 'This one is worse, because there is often no error. It uploads, then ChatGPT works from a fraction of it and you never find out.',
            },
            {
              title: 'You hit a daily cap',
              body: 'Separate from size. A limit on how many files you can send in a window, which resets on its own.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-[1.0625rem] font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-[1.75rem] font-bold tracking-[-0.015em] text-ink sm:text-[2rem]">
            How to use it, start to finish
          </h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-[0.9375rem] font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-[1.0625rem] font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Formats ───────────────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-[1.75rem] font-bold tracking-[-0.015em] text-ink sm:text-[2rem]">
          What file types it handles
        </h2>
        <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-ink-soft">
          Anything that is text underneath. It cannot help with video, audio, or scanned pages,
          because there is no text in those to send.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {SUPPORTED.map((format) => (
            <div
              key={format.ext}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card"
            >
              <p className="font-mono text-[0.875rem] font-bold text-brand-700">{format.ext}</p>
              <p className="mt-0.5 text-[0.75rem] text-ink-muted">{format.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Guides ────────────────────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-[1.75rem] font-bold tracking-[-0.015em] text-ink sm:text-[2rem]">
            Guides and answers
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {latest.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-card"
              >
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-brand-600">
                  {CATEGORIES[article.category].label}
                </p>
                <h3 className="mt-2 text-[1.0625rem] font-semibold leading-snug text-ink group-hover:text-brand-700">
                  {article.heading}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {article.description}
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/guides"
            className="mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-brand-700 hover:text-brand-800"
          >
            All guides
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
