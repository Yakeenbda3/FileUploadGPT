import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy | FileUploadGPT',
  description:
    'What FileUploadGPT collects, which is nothing in the extension itself, and what the website collects, which is anonymous analytics.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <PageShell
      title="Privacy policy"
      intro="Last updated 16 August 2026. Short version: the extension collects nothing, because it has no server to send anything to. The website uses Google Analytics."
      path="/privacy-policy"
    >
      <div className="article">
        <h2>The extension collects nothing</h2>
        <p>
          This is worth stating precisely, because an earlier version of this policy said otherwise.
          The FileUploadGPT extension makes <strong>no network requests of any kind</strong> other
          than acting on the ChatGPT page in your browser. It has no analytics, no telemetry, no
          error reporting, and no server belonging to us for data to reach.
        </p>
        <p>Concretely, we do not receive:</p>
        <ul>
          <li>
            <strong>Your files or their contents.</strong> The document is read inside your browser
            and the text goes into ChatGPT. It does not pass through us on the way.
          </li>
          <li>
            <strong>Your ChatGPT conversations,</strong> account, or OpenAI credentials. The
            extension never sees your login.
          </li>
          <li>
            <strong>Any personal information.</strong> There is no account to create, so there is
            nothing to give us.
          </li>
          <li>
            <strong>Usage data.</strong> We do not know how often you use it, or whether you still
            have it installed.
          </li>
        </ul>
        <p>
          You can verify this rather than take our word for it. The extension asks for permission to
          access chatgpt.com and chat.openai.com only. If it were sending your documents somewhere,
          it would need permission to reach that somewhere, and Chrome would show it to you on the
          store listing before you installed.
        </p>

        <h2>What happens to your file</h2>
        <p>
          The file is read in your browser using standard document-parsing libraries running locally.
          The extracted text is split into pieces and typed into the ChatGPT message box, exactly as
          if you had pasted it yourself.
        </p>
        <p>
          The content therefore goes to <strong>OpenAI</strong>, and only to OpenAI. That is the point
          of the tool. Once it arrives there, OpenAI&apos;s privacy policy and your own ChatGPT data
          settings govern what happens to it. On consumer plans, content may be used to improve model
          performance unless you turn that off in ChatGPT&apos;s data controls. That is a setting in
          your ChatGPT account, not something we can change for you.
        </p>

        <h2>What the website collects</h2>
        <p>
          This website, fileuploadgpt.com, uses Google Analytics to understand which pages people
          find useful. That covers pages visited, approximate location at country or city level,
          device and browser type, and where you arrived from.
        </p>
        <p>
          This is separate from the extension and applies only to browsing this site. It is handled
          by Google and subject to Google&apos;s own privacy policy. Any browser setting or extension
          that blocks analytics will block it here, and the site works exactly the same either way.
        </p>

        <h2>If you contact us</h2>
        <p>
          When you email us we keep what you sent so we can reply. We do not add you to a mailing
          list, because we do not run one, and we do not pass it to anyone else.
        </p>

        <h2>Children</h2>
        <p>
          The extension is not directed at children under 13, and we do not knowingly collect
          anything from them. Since the extension collects nothing from anyone, this is mostly a
          formality.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes, the date at the top changes with it. If a change ever meant we
          started collecting something we do not collect today, we would say so plainly rather than
          amending a sentence quietly.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about any of this: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </PageShell>
  );
}
