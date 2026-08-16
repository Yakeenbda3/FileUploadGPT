import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { InstallButtonRow } from '@/components/cta/InstallButtonRow';
import { JsonLd } from '@/components/JsonLd';
import { softwareApplicationSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Install FileUploadGPT for Chrome',
  description:
    'How to install FileUploadGPT in about twenty seconds, what it needs access to, and why it cannot run on a phone or tablet.',
  alternates: { canonical: '/install' },
};

const STEPS = [
  {
    title: 'Open the Chrome Web Store listing',
    body: 'The button above takes you there. It is the official listing, run by Google, not a download from us.',
  },
  {
    title: 'Click Add to Chrome, then Add extension',
    body: 'Chrome shows you what the extension can access before you confirm. Read it. Ours asks for ChatGPT and nothing else.',
  },
  {
    title: 'Open ChatGPT',
    body: 'Go to chatgpt.com as normal. The extension is now available from your toolbar whenever you are on that site.',
  },
  {
    title: 'Pick a file',
    body: 'Choose your document. It gets read in your browser, split into pieces ChatGPT will accept, and sent in order.',
  },
];

export default function InstallPage() {
  return (
    <>
      <JsonLd schemas={[softwareApplicationSchema()]} />
      <PageShell
        title="Install FileUploadGPT"
        intro="Free, no account, no payment, and about twenty seconds. It runs on a computer, not a phone."
        path="/install"
      >
        <InstallButtonRow />

        <section className="mt-12">
          <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
            What happens when you install it
          </h2>
          <ol className="mt-6 space-y-0">
            {STEPS.map((step, index) => (
              <li key={step.title} className="group relative flex gap-4 pb-6 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute left-[0.9375rem] top-8 h-[calc(100%-2rem)] w-px bg-brand-200 group-last:hidden"
                />
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[0.8125rem] font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 pt-1">
                  <p className="font-semibold text-ink">{step.title}</p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
            What it can access
          </h2>
          <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
            An extension can read the pages it has permission for, so this is worth checking on any
            extension, not just ours. Here is the whole list for this one.
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-[0.9375rem]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-semibold text-ink">Permission</th>
                  <th className="px-4 py-3 font-semibold text-ink">Why</th>
                </tr>
              </thead>
              <tbody className="text-ink-soft">
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 font-mono text-[0.8125rem]">chatgpt.com</td>
                  <td className="px-4 py-3">
                    To put text into the message box and press send. Without this it can do nothing.
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 font-mono text-[0.8125rem]">chat.openai.com</td>
                  <td className="px-4 py-3">The older ChatGPT address, still in use.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-[0.8125rem]">activeTab</td>
                  <td className="px-4 py-3">
                    To act on the tab you are looking at when you click the extension.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
            No access to other websites, no browsing history, and no server of ours for your file to
            go to. The document is read inside your browser and the text goes to ChatGPT, the same
            way it would if you pasted it yourself.
          </p>
        </section>

        <section className="mt-12 rounded-2xl border border-accent-200 border-l-4 border-l-accent-500 bg-accent-50 p-5 sm:p-6">
          <h2 className="text-[1.0625rem] font-bold text-accent-700">
            It will not work on a phone or tablet
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
            Chrome on Android and iOS does not support extensions at all. That is a limitation of
            mobile Chrome rather than of this extension, and nothing can work around it. You need
            Chrome, Edge, Brave, or another Chromium browser on a laptop or desktop. If you are on a
            phone right now, send yourself this page and it will be waiting when you get to a
            computer.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
            If it does not appear after installing
          </h2>
          <ul className="mt-4 space-y-2 text-[1rem] leading-relaxed text-ink-soft">
            <li>
              Reload the ChatGPT tab. Extensions do not attach to pages that were already open.
            </li>
            <li>
              Click the puzzle-piece icon in your toolbar and pin FileUploadGPT so it stays visible.
            </li>
            <li>
              Check you are on chatgpt.com or chat.openai.com. It does nothing anywhere else, by
              design.
            </li>
          </ul>
        </section>
      </PageShell>
    </>
  );
}
