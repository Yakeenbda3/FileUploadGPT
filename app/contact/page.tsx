import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { CHROME_STORE_URL, CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact FileUploadGPT',
  description:
    'How to report a bug, correct a fact on the site, or ask something the guides do not answer, and what to include so it can be fixed.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <PageShell
      title="Get in touch"
      intro="One person reads these, so plain email rather than a ticket system."
      path="/contact"
    >
      <div className="rounded-2xl border border-slate-200 bg-brand-50/60 p-6">
        <p className="text-[0.8125rem] font-semibold uppercase tracking-wider text-brand-700">
          Email
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-2 block text-[1.25rem] font-semibold text-brand-800 underline"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <section className="mt-10">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
          If the extension stopped working
        </h2>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
          This usually means ChatGPT changed its interface, which happens without warning and breaks
          the parts of the extension that find the message box and the send button. It is worth
          reporting, because we cannot tell it has happened until someone says so.
        </p>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">Include if you can:</p>
        <ul className="mt-3 space-y-2 text-[1rem] leading-relaxed text-ink-soft">
          <li>Your browser and version, for example Chrome 141 on Windows.</li>
          <li>What you were uploading, meaning the file type and rough size, not the file itself.</li>
          <li>What happened instead of what you expected.</li>
          <li>
            Anything red in the browser console, which you can open with F12 or Cmd, Option and I.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
          If something here is wrong
        </h2>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
          Corrections are genuinely welcome. ChatGPT&apos;s limits change, sometimes quietly, and
          this site quotes a lot of them. If a figure no longer matches what you see in OpenAI&apos;s
          documentation, tell us which page and which number and it gets fixed everywhere at once,
          since they are all stored in one place.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">Before you write</h2>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
          Most questions that arrive are already answered. The{' '}
          <Link href="/faq" className="font-medium text-brand-700 underline">
            FAQ
          </Link>{' '}
          covers limits, privacy and the mobile question, and{' '}
          <Link
            href="/blog/chatgpt-file-upload-troubleshooting"
            className="font-medium text-brand-700 underline"
          >
            the troubleshooting guide
          </Link>{' '}
          covers every upload error message and what causes it.
        </p>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
          Reviews go on the{' '}
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener"
            className="font-medium text-brand-700 underline"
          >
            Chrome Web Store listing
          </a>
          , which is also where other people looking at the extension will read them.
        </p>
      </section>
    </PageShell>
  );
}
