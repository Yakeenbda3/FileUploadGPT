import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { USE_CASES, getUseCase } from '@/lib/use-cases';
import { PageShell } from '@/components/layout/PageShell';
import { InstallCard } from '@/components/cta/InstallCard';
import { getAllArticles } from '@/lib/articles';

export const dynamicParams = false;

export function generateStaticParams() {
  return USE_CASES.map((useCase) => ({ slug: useCase.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) return {};

  return {
    title: useCase.title,
    description: useCase.description,
    alternates: { canonical: `/use-cases/${useCase.slug}` },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) notFound();

  const guides = getAllArticles().slice(0, 3);

  return (
    <PageShell
      title={useCase.heading}
      intro={useCase.description}
      path={`/use-cases/${useCase.slug}`}
      wide
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0">
          <section>
            <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
              The situation
            </h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">{useCase.problem}</p>
          </section>

          <section className="mt-10">
            <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">
              What people use it for
            </h2>
            <ul className="mt-4 space-y-3">
              {useCase.jobs.map((job) => (
                <li key={job} className="flex gap-3 text-[1rem] leading-relaxed text-ink-soft">
                  <svg
                    className="mt-1.5 h-4 w-4 shrink-0 text-brand-600"
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
                  {job}
                </li>
              ))}
            </ul>
          </section>

          {/* Every audience page names something the product will not do. A page that only lists
              wins reads like a brochure and converts worse than one that sounds like it has met
              the problem before. */}
          <section className="mt-10 rounded-2xl border border-accent-200 border-l-4 border-l-accent-500 bg-accent-50 p-5 sm:p-6">
            <h2 className="text-[1.0625rem] font-bold text-accent-700">Worth knowing first</h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
              {useCase.limitation}
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-[1.5rem] font-bold tracking-[-0.01em] text-ink">Related guides</h2>
            <ul className="mt-4 space-y-2">
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={`/blog/${guide.slug}`}
                    className="text-[0.9375rem] font-medium text-brand-700 hover:underline"
                  >
                    {guide.heading}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:pt-2">
          <div className="lg:sticky lg:top-24">
            <InstallCard />
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
