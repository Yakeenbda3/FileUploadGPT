import type { Metadata } from 'next';
import Link from 'next/link';
import { USE_CASES } from '@/lib/use-cases';
import { PageShell } from '@/components/layout/PageShell';

export const metadata: Metadata = {
  title: 'Who Uses FileUploadGPT: Students, Devs, Researchers',
  description:
    'How students, developers, researchers, business professionals and content creators work around ChatGPT limits on long documents.',
  alternates: { canonical: '/use-cases' },
};

export default function UseCasesIndexPage() {
  return (
    <PageShell
      title="Who uses this, and for what"
      intro="Five groups run into ChatGPT's document limits constantly. The problem is the same underneath, but what you do about it depends on what you are working with."
      path="/use-cases"
      wide
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {USE_CASES.map((useCase) => (
          <Link
            key={useCase.slug}
            href={`/use-cases/${useCase.slug}`}
            className="group rounded-2xl border border-slate-200 p-6 transition-all hover:border-brand-300 hover:shadow-card"
          >
            <h2 className="text-[1.0625rem] font-semibold leading-snug text-ink group-hover:text-brand-700">
              {useCase.heading}
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              {useCase.description}
            </p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
