import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { InstallButtonRow } from '@/components/cta/InstallButtonRow';
import { CHATGPT_FACTS } from '@/lib/chatgpt-facts';

export const metadata: Metadata = {
  title: 'FileUploadGPT Features: What the Extension Does',
  description:
    'Everything the extension does, in plain terms, and an honest list of what it does not do so you can tell whether it fits your problem.',
  alternates: { canonical: '/features' },
};

const DOES = [
  {
    title: 'Splits documents that are too long',
    body: `ChatGPT caps text files at ${CHATGPT_FACTS.maxTextTokens.value}. Past that, a document is truncated with no warning. The extension cuts it into pieces that fit and sends them in order.`,
  },
  {
    title: 'Sends the instruction that stops early answers',
    body: 'Before any content, ChatGPT is told how many parts are coming and asked to hold its answer. Skipping this is why manual splitting produces a summary of part one.',
  },
  {
    title: 'Reads PDF, Word, text, markdown and HTML',
    body: 'Parsing happens in your browser using standard libraries. Text-based PDFs and DOCX both work.',
  },
  {
    title: 'Runs entirely in your browser',
    body: 'There is no server. Your document is read locally and the text goes to ChatGPT, the same as if you had pasted it.',
  },
  {
    title: 'Shows progress and can be stopped',
    body: 'You can see which part it is on and cancel part way through if it is not going the way you wanted.',
  },
  {
    title: 'Includes four prompt shortcuts',
    body: 'One click for a structured summary, a professional rewrite, a code review, or a set of quiz questions on whatever is in the conversation. It puts the prompt in the box and leaves sending to you.',
  },
];

const DOES_NOT = [
  {
    title: 'Raise any of ChatGPT\'s limits',
    body: 'Those are enforced by OpenAI. Nothing running in a browser can change them, and anything claiming otherwise is not telling you the truth.',
  },
  {
    title: 'Work with video or audio',
    body: 'Neither is among the file types OpenAI lists for uploads. Get a transcript and upload that instead.',
  },
  {
    title: 'Read scanned PDFs',
    body: 'A scan is images. Every ChatGPT plan except Enterprise discards images from documents, so there is nothing to extract. Run OCR first and it works normally.',
  },
  {
    title: 'Run on a phone or tablet',
    body: 'Mobile Chrome does not support extensions at all. This is a limitation of mobile Chrome and no extension can work around it.',
  },
  {
    title: 'Cost anything, ever',
    body: 'No paid tier exists. This is on the honest list rather than the features list because "free" is usually the setup for a price.',
  },
];

export default function FeaturesPage() {
  return (
    <PageShell
      title="What it does, and what it does not"
      intro="A small tool that does one thing. Both lists are here so you can work out in thirty seconds whether it solves your problem."
      path="/features"
      wide
    >
      <section>
        <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">What it does</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {DOES.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-[1rem] font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">What it does not do</h2>
        <p className="mt-2 text-[1rem] text-ink-soft">
          Better to find out here than after installing it.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {DOES_NOT.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-[1rem] font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14">
        <InstallButtonRow />
      </div>
    </PageShell>
  );
}
