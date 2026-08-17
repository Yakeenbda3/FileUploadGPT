import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service | FileUploadGPT',
  description:
    'The terms for using the FileUploadGPT extension and website, including the parts about OpenAI that are genuinely worth reading.',
  alternates: { canonical: '/terms-of-service' },
};

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of service"
      intro="Last updated 16 August 2026. These cover the FileUploadGPT extension and this website."
      path="/terms-of-service"
    >
      <div className="article">
        <h2>1. Agreeing to these terms</h2>
        <p>
          Installing or using the extension, or using this website, means you accept these terms. If
          you do not, do not use them.
        </p>

        <h2>2. What the service is</h2>
        <p>
          FileUploadGPT is a free Chrome extension. It reads a document in your browser, splits the
          text into pieces ChatGPT will accept, and sends them into the ChatGPT web interface in
          order.
        </p>
        <p>
          It does not raise, remove, or circumvent any limit imposed by OpenAI, and it cannot. It
          changes how much is sent at once. Nothing more than that.
        </p>

        <h2>3. Your use of ChatGPT is between you and OpenAI</h2>
        <p>
          The extension operates the ChatGPT interface on your behalf. Your use of ChatGPT remains
          governed by OpenAI&apos;s own terms, and you are responsible for staying within them.
        </p>
        <p>
          Automating any web interface exists in a grey area. The extension behaves like a person
          using the site, entering text and sending it at a normal pace, and does not use the API or
          hold any credentials. We are not aware of anyone having an account actioned for using it.
          We cannot promise OpenAI will always see it that way, and you should reach your own view
          before using it on an account that matters to you.
        </p>

        <h2>4. Age</h2>
        <p>
          You must be at least 13. Under 18, use it with a parent or guardian involved.
        </p>

        <h2>5. What you agree not to do</h2>
        <ul>
          <li>Use it for anything unlawful.</li>
          <li>
            Upload content you have no right to share, including material covered by someone
            else&apos;s copyright, confidentiality obligations, or privacy rights.
          </li>
          <li>Upload malicious files, or attempt to interfere with the extension or this site.</li>
          <li>Represent the extension as your own work or as something OpenAI endorses.</li>
        </ul>

        <h2>6. Your content stays yours</h2>
        <p>
          We claim no rights over anything you process with the extension. We never receive it. What
          you upload goes to OpenAI, and what happens to it there is covered by their terms and your
          own ChatGPT data settings.
        </p>

        <h2>7. Our content</h2>
        <p>
          The extension, this website, and the writing on it belong to us. You may use the extension
          for personal or commercial work. You may not repackage or redistribute it as your own.
        </p>

        <h2>8. No warranty</h2>
        <p>
          The extension is provided as is. It depends on ChatGPT&apos;s web interface, which OpenAI
          changes without notice, and a change there can break it until we update it. We do not
          guarantee it works at any given moment, and we do not guarantee any particular result from
          ChatGPT.
        </p>
        <p>
          Verify anything that matters. A summary that reads well can still be based on part of a
          document.
        </p>

        <h2>9. Limitation of liability</h2>
        <p>
          To the extent the law allows, we are not liable for indirect or consequential loss arising
          from using the extension or this site, including lost data, lost profits, or decisions
          taken on the strength of something ChatGPT produced. The extension is free, and nothing
          here creates a liability beyond that.
        </p>

        <h2>10. Not affiliated with OpenAI</h2>
        <p>
          FileUploadGPT is an independent tool. It is not affiliated with, endorsed by, or sponsored
          by OpenAI. ChatGPT is a trademark of OpenAI, used here only to say what the extension works
          with.
        </p>

        <h2>11. Changes</h2>
        <p>
          These terms may change, and the date at the top will change with them. Continuing to use
          the extension after a change means accepting it.
        </p>

        <h2>12. Contact</h2>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </PageShell>
  );
}
