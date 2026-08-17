import type { Metadata } from 'next';
import Link from 'next/link';
import { CHROME_STORE_URL } from '@/lib/site';
import { CATEGORIES, CATEGORY_ORDER, getAllArticles, getArticlesByCategory } from '@/lib/articles';
import { JsonLd } from '@/components/JsonLd';
import { softwareApplicationSchema } from '@/lib/jsonld';
import SiteSearch from '@/components/search/SiteSearch';
import SectionHeading from '@/components/layout/SectionHeading';

export const metadata: Metadata = {
  // Leads with the task in the visitor's own words. The brand still earns brand searches whatever
  // the title says; everyone else is searching for the thing they are trying to do. The previous
  // title was 37 characters, which left roughly a third of the space Google gives us unused.
  title: 'Upload Large Files to ChatGPT Free | FileUploadGPT',
  description:
    'A free Chrome extension that splits documents ChatGPT will not accept and feeds them in for you, in order. Works with PDF, Word, text and markdown.',
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

/**
 * The routing grid.
 *
 * Modelled on the reference project's "which situation are you in" block, and it is the single most
 * useful thing on the page. Someone arriving from search has one specific failure in front of them.
 * A list of article titles asks them to translate their problem into our vocabulary; a list of
 * symptoms lets them recognise it and go straight to the answer.
 */
const SYMPTOMS: Array<{ symptom: string; detail: string; href: string }> = [
  {
    symptom: 'It says my file is too large',
    detail: 'A clear error and the upload is refused. The easiest of the four to fix.',
    href: '/blog/chatgpt-file-is-too-large-error',
  },
  {
    symptom: 'It only read the first few pages',
    detail: 'No error at all. The file went in and ChatGPT worked from a fraction of it.',
    href: '/blog/did-chatgpt-read-my-whole-document',
  },
  {
    symptom: 'I have run out of uploads',
    detail: '"You have reached our limit of file uploads." When it resets and how to avoid it.',
    href: '/blog/chatgpt-upload-limit-reached-error',
  },
  {
    symptom: 'My scanned PDF comes back empty',
    detail: 'There is no text in a scan to read. What to run it through first.',
    href: '/blog/chatgpt-scanned-pdf-not-working',
  },
  {
    symptom: 'I need to send a whole book or codebase',
    detail: 'Past a certain size, splitting stops being the right answer.',
    href: '/blog/how-to-split-a-document-for-chatgpt',
  },
  {
    symptom: 'I just want the limit gone',
    detail: 'Five ways round it, what each costs you, and the three that waste your time.',
    href: '/blog/chatgpt-file-upload-limit-workaround',
  },
];

const COMMITMENTS = [
  {
    title: 'Free, with no account',
    body: 'No sign-up, no email, no payment, no trial that ends.',
    icon: (
      <path
        d="M20 6.7 8.7 18l-5.4-5.4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Your file never leaves your browser',
    body: 'It is read on your own machine and typed into ChatGPT. We receive nothing.',
    icon: (
      <path
        d="M12 3 4 6.5V12c0 5 8 9 8 9s8-4 8-9V6.5L12 3Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Nothing is tracked',
    body: 'No analytics inside the extension, no history, no profile of what you upload.',
    icon: (
      <path
        d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Zm3-7 12 14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Open about what it cannot do',
    body: 'It will not help with video, audio or scanned pages, and the guides say so.',
    icon: (
      <path
        d="M12 8v5m0 3.5v.1M12 3l9 16H3l9-16Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function HomePage() {
  const total = getAllArticles().length;

  const categories = CATEGORY_ORDER.map((key) => ({
    key,
    ...CATEGORIES[key],
    href: `/guides/${CATEGORIES[key].slug}`,
    articles: getArticlesByCategory(key).slice(0, 4),
    count: getArticlesByCategory(key).length,
  }));

  return (
    <>
      <JsonLd schemas={[softwareApplicationSchema()]} />

      {/* ── Hero ──────────────────────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50/70 via-brand-50/20 to-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:py-20">
          <p className="text-[0.8125rem] font-semibold uppercase tracking-wider text-brand-600">
            Free Chrome extension
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-[2.125rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[3.25rem]">
            Upload files ChatGPT <span className="text-brand-700">says are too big</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft sm:text-[1.1875rem]">
            ChatGPT refuses long documents, or takes them and quietly reads only the first few pages.
            FileUploadGPT splits your file into pieces it will accept and sends them in for you, in
            order, with the instructions that stop it answering early.
          </p>

          {/* Short placeholder on purpose: anything longer is cut off inside the input at 390px,
              and a placeholder that ends mid-word looks like a rendering fault. */}
          <div className="mt-8">
            <SiteSearch variant="hero" placeholder={`Search ${total} guides`} />
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
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
      </section>

      {/* ── Commitments ───────────────────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading lead="What you" accent="get" />
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {COMMITMENTS.map((item) => (
              <li key={item.title} className="text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center text-brand-600">
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    {item.icon}
                  </svg>
                </span>
                <h3 className="mt-3 text-[0.9375rem] font-semibold text-ink">{item.title}</h3>
                <p className="mx-auto mt-1.5 max-w-[16rem] text-[0.875rem] leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Which problem do you have ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          lead="What is"
          accent="stopping you"
          blurb="Four different limits produce four different symptoms, and the fix is different for each. Find yours."
        />
        <div className="mt-10 grid gap-x-8 gap-y-1 md:grid-cols-2">
          {SYMPTOMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-4 border-b border-slate-200 py-5 transition-colors hover:border-brand-300"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100">
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-[1rem] font-semibold leading-snug text-ink group-hover:text-brand-700">
                  {item.symptom}
                </span>
                <span className="mt-1 block text-[0.875rem] leading-relaxed text-ink-muted">
                  {item.detail}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading lead="How it" accent="works" />
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-[0.9375rem] font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-[1.0625rem] font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener"
              className="btn btn-install px-6 py-3.5 text-base"
            >
              Add to Chrome, it is free
            </a>
          </div>
        </div>
      </section>

      {/* ── Every guide, by category ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          lead="Every guide, by"
          accent="category"
          blurb={`${total} guides on getting documents into ChatGPT, what it will and will not accept, and what to do when it refuses.`}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.key}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[1.0625rem] font-semibold text-ink">
                  <Link href={category.href} className="hover:text-brand-700">
                    {category.label}
                  </Link>
                </h3>
                <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-0.5 text-[0.75rem] font-semibold text-brand-700">
                  {category.count}
                </span>
              </div>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">{category.blurb}</p>
              <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                {category.articles.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="block text-[0.875rem] leading-snug text-ink-soft transition-colors hover:text-brand-700"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={category.href}
                className="mt-4 inline-flex items-center gap-1 text-[0.875rem] font-semibold text-brand-700 hover:text-brand-800"
              >
                All {category.count}
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Formats ───────────────────────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeading
            lead="What file types it"
            accent="handles"
            blurb="Anything that is text underneath. It cannot help with video, audio, or scanned pages, because there is no text in those to send."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {SUPPORTED.map((format) => (
              <div
                key={format.ext}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center shadow-card"
              >
                <p className="font-mono text-[0.875rem] font-bold text-brand-700">{format.ext}</p>
                <p className="mt-0.5 text-[0.75rem] text-ink-muted">{format.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[0.875rem] text-ink-muted">
            <Link href="/guides/file-types" className="font-medium text-brand-700 hover:underline">
              Every format, and what happens to each
            </Link>
          </p>
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-[1.5rem] font-semibold tracking-[-0.015em] text-ink sm:text-[1.875rem]">
          Stop cutting documents up by hand
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[1rem] leading-relaxed text-ink-soft">
          Splitting a long file into forty pastes works, until the one you skip is the one that
          mattered. This does the same thing without the place-keeping.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener"
            className="btn btn-install px-6 py-3.5 text-base"
          >
            Add to Chrome, it is free
          </a>
          <Link href="/guides" className="btn btn-ghost px-5 py-3.5">
            Read the guides
          </Link>
        </div>
      </section>
    </>
  );
}
