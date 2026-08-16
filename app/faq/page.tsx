import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Faq } from '@/components/article/Faq';
import { JsonLd } from '@/components/JsonLd';
import { faqSchema } from '@/lib/jsonld';
import { CHATGPT_FACTS, FACTS_VERIFIED_ON } from '@/lib/chatgpt-facts';

export const metadata: Metadata = {
  title: 'FileUploadGPT FAQ',
  description:
    'Answers on ChatGPT upload limits, what the extension does with your files, why it needs a computer, and what it will not help with.',
  alternates: { canonical: '/faq' },
};

// One array feeds both the visible accordion and the FAQPage structured data. Marking up questions
// a reader cannot see is a structured data policy violation, and keeping two lists in sync by hand
// is how that happens by accident.
const ITEMS = [
  {
    q: 'What is ChatGPT\'s file upload limit?',
    a: `There are several. Any single file is capped at ${CHATGPT_FACTS.maxFileSize.value}. Text and document files are additionally capped at ${CHATGPT_FACTS.maxTextTokens.value}, and that is the one that usually stops you, because a long document hits it well before the size limit. Spreadsheets are exempt from the token cap but limited to ${CHATGPT_FACTS.maxSpreadsheetSize.value}. Images are capped at ${CHATGPT_FACTS.maxImageSize.value}.`,
  },
  {
    q: 'How many files can I upload per day?',
    a: `Free accounts get ${CHATGPT_FACTS.freeDailyUploads.value}. Beyond that the general cap is ${CHATGPT_FACTS.rollingUploadRate.value}, which rolls rather than resetting at midnight. OpenAI also says these may be lowered at peak times.`,
  },
  {
    q: 'Why does it say I hit the limit when I have barely uploaded anything?',
    a: 'Two documented reasons. Failed upload attempts count toward the rolling cap, so a file you retried six times spent six slots. And there is a 25 GB storage cap per user, shared across chats, Projects and custom GPT knowledge, which old files keep occupying until you delete the chats holding them.',
  },
  {
    q: 'Does FileUploadGPT raise ChatGPT\'s limits?',
    a: 'No, and nothing running in your browser could. The limits are enforced on OpenAI\'s side. What it changes is how much gets sent at once: it splits your document into pieces ChatGPT will accept and sends them in order, so the whole thing gets read instead of the first part.',
  },
  {
    q: 'Does my file get uploaded to your servers?',
    a: 'No. There are no servers. The extension reads the file inside your browser, splits the text, and types it into ChatGPT the same way you would if you pasted it. The only place your content goes is OpenAI, exactly as it would without the extension.',
  },
  {
    q: 'Does it work on a phone or tablet?',
    a: 'No. Chrome on Android and iOS does not support extensions at all, so no extension works there, not just this one. You need Chrome, Edge, Brave or another Chromium browser on a laptop or desktop.',
  },
  {
    q: 'What file types does it handle?',
    a: 'PDF, DOCX, TXT, MD and HTML, meaning anything that has text underneath. It cannot help with video, audio, or scanned PDFs, because there is no text in those to extract. For a scan, run OCR first and then it works normally.',
  },
  {
    q: 'Why did my scanned PDF produce nothing?',
    a: 'Because every ChatGPT plan except Enterprise extracts digital text from a file and discards the images. A scan is a photograph of a page, so there is no digital text to extract and nothing comes back. Run it through OCR first.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes. No account, no payment, no paid tier, no trial. It is a small tool that does one thing, and there is nothing to buy.',
  },
  {
    q: 'Will using it get my ChatGPT account banned?',
    a: 'We are not aware of it happening. The extension behaves like a person using the interface: it puts text in the box and presses send, at a normal pace. It does not use the API, hold credentials, or bypass anything. That said, automating any interface is a grey area, so read OpenAI\'s terms and make your own decision.',
  },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd schemas={[faqSchema(ITEMS)]} />
      <PageShell
        title="Questions people actually ask"
        intro="On ChatGPT's limits and on what this extension does. Anything about ChatGPT itself is checked against OpenAI's own documentation."
        path="/faq"
      >
        {/* The visible provenance line. Every number below comes from OpenAI's File Uploads FAQ and
            these change without notice, so the date the site last checked belongs next to them. */}
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[0.875rem] text-ink-muted">
          Figures below were last checked against OpenAI&apos;s documentation on{' '}
          <time dateTime={FACTS_VERIFIED_ON}>16 August 2026</time>.
        </p>

        <div className="-mt-6">
          <Faq items={ITEMS} />
        </div>

        <p className="mt-10 text-[0.9375rem] text-ink-soft">
          Not covered here? The{' '}
          <Link href="/guides" className="font-medium text-brand-700 underline">
            guides
          </Link>{' '}
          go deeper, or{' '}
          <Link href="/contact" className="font-medium text-brand-700 underline">
            get in touch
          </Link>
          .
        </p>
      </PageShell>
    </>
  );
}
