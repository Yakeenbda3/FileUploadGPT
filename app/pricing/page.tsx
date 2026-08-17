import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { InstallButtonRow } from '@/components/cta/InstallButtonRow';

export const metadata: Metadata = {
  title: 'FileUploadGPT Pricing: Free, With No Account',
  description:
    'FileUploadGPT is free with no paid tier and no account. Here is why, and what that means for how long it will stay around.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  return (
    <PageShell
      title="It is free"
      intro="No paid tier, no trial, no account, no card. This page exists because people reasonably assume there is a catch."
      path="/pricing"
    >
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-6 sm:p-8">
        <p className="text-[3rem] font-bold leading-none text-ink">£0</p>
        <p className="mt-2 text-[1.0625rem] text-ink-soft">Everything it does, for everyone.</p>
        <ul className="mt-6 space-y-2.5">
          {[
            'No account to create',
            'No payment details, ever',
            'No usage caps of our own',
            'No feature held back for a paid version',
            'No adverts and no sponsored content in the tool',
          ].map((item) => (
            <li key={item} className="flex gap-2.5 text-[0.9375rem] text-ink-soft">
              <svg
                className="mt-1 h-4 w-4 shrink-0 text-brand-600"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3.5 8.5 6.5 11.5 12.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <section className="mt-12">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
          So what is the catch
        </h2>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
          There is no server, so there is nothing to run. The extension does its work inside your
          browser, which means it costs us nothing per person to keep going. A tool that costs
          nothing to operate does not need a subscription attached to it.
        </p>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
          It is also a small tool that does one thing. There is not enough here to build a business
          on, and pretending otherwise would mean adding things nobody asked for.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
          Your data is not the product
        </h2>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
          The usual answer to &quot;why is this free&quot; is that you are paying with data. Not here,
          and it is verifiable rather than a promise: the extension makes no network requests at all
          beyond acting on the ChatGPT page. It asks for permission to reach chatgpt.com and nothing
          else, and Chrome shows you that list before you install. Sending your documents anywhere
          would require a permission it does not have.
        </p>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
          The full detail is in the{' '}
          <Link href="/privacy-policy" className="font-medium text-brand-700 underline">
            privacy policy
          </Link>
          .
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
          What ChatGPT costs is separate
        </h2>
        <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
          You still need ChatGPT, and its own limits still apply. The Free plan allows 3 file uploads
          a day, and paid plans raise several caps but not the length limit that truncates long
          documents. Paying OpenAI does not remove the problem this extension exists for.
        </p>
      </section>

      <div className="mt-12">
        <InstallButtonRow />
      </div>
    </PageShell>
  );
}
