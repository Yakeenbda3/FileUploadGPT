import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';

export const metadata: Metadata = {
  title: 'About FileUploadGPT: Who Builds It and Why',
  description:
    'Why this extension exists, what it deliberately does not try to be, and how the facts on this site are checked.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <PageShell
      title="About"
      intro="A small tool that does one thing, and a set of guides about the problem it solves."
      path="/about"
    >
      <div className="article">
        <h2>Why it exists</h2>
        <p>
          ChatGPT is genuinely useful for documents right up until the document is long, at which
          point it either refuses the file or, worse, accepts it and reads part of it without saying
          so. The second case is the one that catches people, because a summary of the first third of
          a report looks exactly like a summary of the report.
        </p>
        <p>
          The manual fix has always been known: convert the document to text, cut it into pieces,
          tell ChatGPT that more parts are coming, and paste them in order. It works. It is also
          tedious enough on a long document that people either skip a step or give up, and the step
          they skip is usually the instruction, which is the one that matters.
        </p>
        <p>The extension does that reliably. That is the whole idea.</p>

        <h2>What it deliberately is not</h2>
        <p>
          It is not a ChatGPT client, a prompt library, a workspace, or a productivity suite. It does
          one job and stops. There is no account, no sync, no dashboard, and no roadmap toward any of
          those.
        </p>
        <p>
          It is also not a way around OpenAI&apos;s limits, and we try not to imply otherwise
          anywhere on this site. The limits are enforced on their side. What changes is how much gets
          sent at a time.
        </p>

        <h2>How the facts here are checked</h2>
        <p>
          Most of what is written about ChatGPT&apos;s upload limits online is wrong, usually because
          one article copied another and the original was a guess. So every number on this site,
          every size cap, every daily allowance, comes from OpenAI&apos;s own documentation, and each
          one is recorded with the date it was last checked.
        </p>
        <p>
          They are stored in a single place in the site&apos;s source rather than typed into
          individual articles, which means two things. When OpenAI changes a limit, one edit corrects
          every page at once. And a page that tries to state a figure nobody has verified fails to
          build rather than publishing a plausible guess.
        </p>
        <p>
          Where something genuinely is not known, the guides say so. There is more of that than you
          might expect: OpenAI publishes no list of supported file extensions, for example, only four
          broad categories. Articles claiming to have the definitive list have invented it.
        </p>

        <h2>Privacy, briefly</h2>
        <p>
          The extension makes no network requests beyond acting on the ChatGPT page. There is no
          server of ours for a document to reach. You can confirm this from the permissions Chrome
          shows before you install: access to chatgpt.com, and nothing else. The{' '}
          <Link href="/privacy-policy">privacy policy</Link> has the detail.
        </p>

        <h2>Not affiliated with OpenAI</h2>
        <p>
          This is an independent tool. It is not affiliated with, endorsed by, or sponsored by
          OpenAI, and ChatGPT is their trademark. We use the name only to say what the extension
          works with.
        </p>

        <h2>Getting in touch</h2>
        <p>
          Something wrong on a page, or something the guides do not cover, is worth telling us about.
          Corrections in particular: if a number here is out of date, we would rather hear it from
          you than leave it wrong. <Link href="/contact">Contact details are here.</Link>
        </p>
      </div>
    </PageShell>
  );
}
