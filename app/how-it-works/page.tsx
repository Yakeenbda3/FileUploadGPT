import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { InstallButtonRow } from '@/components/cta/InstallButtonRow';

export const metadata: Metadata = {
  title: 'How FileUploadGPT works',
  description:
    'What happens between picking a file and ChatGPT having read it, including the instruction that stops it answering before every part arrives.',
  alternates: { canonical: '/how-it-works' },
};

const STAGES = [
  {
    title: 'It reads the file in your browser',
    body: 'PDF, Word, text, markdown or HTML. The text is extracted locally using the same open source libraries a browser would use. Nothing is transmitted anywhere at this stage, because there is nowhere for it to go.',
  },
  {
    title: 'It splits the text into pieces ChatGPT will accept',
    body: 'The document is cut into chunks small enough to go through without being truncated. Each chunk is labelled with a shared identifier and its position, so ChatGPT can tell they belong to one document and what order they came in.',
  },
  {
    title: 'It sends the instruction first',
    body: 'Before any content, ChatGPT is told how many parts are coming and asked not to answer until the last one lands. This is the step people skip when doing it by hand, and skipping it is why manual splitting produces a summary of part one.',
  },
  {
    title: 'It sends the parts in order',
    body: 'Each chunk goes into the message box and gets sent, one after another, at a normal pace. It is doing what you would do, without losing its place.',
  },
  {
    title: 'ChatGPT confirms and waits',
    body: 'After the last part it acknowledges the whole document and waits for your actual question. From there it is an ordinary conversation, except it has read all of your file rather than the beginning of it.',
  },
];

export default function HowItWorksPage() {
  return (
    <PageShell
      title="How it works"
      intro="Nothing clever is happening. It is the manual workaround, done properly, without you having to do it."
      path="/how-it-works"
    >
      <ol className="space-y-0">
        {STAGES.map((stage, index) => (
          <li key={stage.title} className="group relative flex gap-5 pb-8 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute left-[1.1875rem] top-10 h-[calc(100%-2.5rem)] w-px bg-brand-200 group-last:hidden"
            />
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[0.9375rem] font-bold text-white">
              {index + 1}
            </span>
            <div className="min-w-0 pt-1.5">
              <h2 className="text-[1.125rem] font-semibold text-ink">{stage.title}</h2>
              <p className="mt-1.5 text-[1rem] leading-relaxed text-ink-soft">{stage.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-12">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
          What it does not do
        </h2>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
          Worth being clear, because plenty of tools in this space imply otherwise.
        </p>
        <ul className="mt-4 space-y-3 text-[1rem] leading-relaxed text-ink-soft">
          <li>
            <strong className="font-semibold text-ink">It does not raise any limit.</strong> Those
            are enforced by OpenAI. Nothing running in a browser can change them.
          </li>
          <li>
            <strong className="font-semibold text-ink">It does not use the API.</strong> No key, no
            account of ours, no separate billing. It works through the ordinary web interface.
          </li>
          <li>
            <strong className="font-semibold text-ink">
              It does not help with video, audio, or scans.
            </strong>{' '}
            There is no text in those to send. A scan needs OCR first, and then it works normally.
          </li>
          <li>
            <strong className="font-semibold text-ink">It does not store anything.</strong> There is
            no server. Close the tab and nothing of your document remains anywhere but in your
            ChatGPT conversation.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
          Doing it yourself instead
        </h2>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
          The method is not secret and there is no reason to hide it. Convert your document to plain
          text, cut it into pieces, tell ChatGPT that several parts are coming and to hold its
          answer, then paste them in order. It works.{' '}
          <Link
            href="/blog/chatgpt-file-upload-limit-workaround"
            className="font-medium text-brand-700 underline"
          >
            The full method is written up here.
          </Link>{' '}
          The extension exists because doing that for a forty-part document is where mistakes creep
          in, not because the technique is complicated.
        </p>
      </section>

      <div className="mt-12">
        <InstallButtonRow />
      </div>
    </PageShell>
  );
}
