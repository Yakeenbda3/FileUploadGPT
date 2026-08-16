// Every factual claim about ChatGPT that appears anywhere on this site lives here, once.
//
// WHY THIS FILE EXISTS
//
// 1. Maintenance. Over a hundred articles quote ChatGPT's upload limits, and OpenAI changes them.
//    The source page below was itself last updated two days before we read it. Without a single
//    source, a change means hunting through every article that mentions a number, and the ones that
//    get missed become quietly wrong. Here it is one edit.
//
// 2. Honesty under uncertainty. help.openai.com sits behind a challenge that blocks automated
//    fetching (HTTP 403, confirmed 2026-08-16), so these cannot be re-checked by a script. Every
//    fact therefore carries a `status`, anything not `verified` renders with a visible hedge, and
//    `assertVerified()` fails the build rather than let a page state a guess as established.
//
// VERIFICATION EVENT, 2026-08-16
//    The full text of OpenAI's File Uploads FAQ was read directly from help.openai.com in a browser
//    and every value below transcribed from it. The page's own header read "Updated: 2 days ago",
//    so the source was current as of roughly 2026-08-14.
//
// HOW TO UPDATE
//    Open `source` in a real browser, read the value, set `value`, `status: 'verified'` and
//    `verifiedOn`. Never mark something verified because secondary sources agree: blogs copy each
//    other, and several of them state limits this page contradicts.

export type FactStatus =
  /** Read from the primary source by a human on `verifiedOn`. Safe to state flatly. */
  | 'verified'
  /** Seen in credible secondary sources but NOT confirmed against OpenAI. Must be hedged. */
  | 'unverified'
  /** Known to have changed or been withdrawn. Never render. */
  | 'stale';

export interface Fact<T = string> {
  value: T;
  status: FactStatus;
  /** ISO date the value was last checked against `source`. */
  verifiedOn: string;
  source: string;
  /** Anything a writer needs before quoting this, especially the caveats the FAQ attaches. */
  note?: string;
}

const UPLOADS_FAQ = 'https://help.openai.com/en/articles/8555545-file-uploads-faq';
const VERIFIED_ON = '2026-08-16';

function verified<T>(value: T, note?: string): Fact<T> {
  return { value, status: 'verified', verifiedOn: VERIFIED_ON, source: UPLOADS_FAQ, note };
}

export const CHATGPT_FACTS = {
  // ── Size ceilings ──────────────────────────────────────────────────────────────────────────
  maxFileSize: verified(
    '512 MB',
    'The hard per-file ceiling, for any file in a conversation or a GPT. Note this is almost never the limit that actually bites: a long text document hits the 2M token cap first, at a fraction of this size.'
  ),

  maxTextTokens: verified(
    '2 million tokens',
    'Per text or document file. THIS is the limit that matters for long documents. The FAQ states explicitly that it does not apply to spreadsheets.'
  ),

  maxSpreadsheetSize: verified(
    'about 50 MB',
    'CSV and spreadsheets. The FAQ hedges with "approximately" and says it depends on the size of each row, so quote it as approximate. Spreadsheets are exempt from the 2M token cap.'
  ),

  maxImageSize: verified('20 MB', 'Per image.'),

  // ── Rate and count caps. The most searched facts on this site, and the ones competitors get
  //    wrong most often. ──────────────────────────────────────────────────────────────────────
  freeDailyUploads: verified(
    '3 file uploads per day',
    'Free plan. Stated plainly in the FAQ and widely misreported elsewhere. The FAQ also warns these limits may be lowered during peak hours, so never present it as a floor.'
  ),

  rollingUploadRate: verified(
    '80 files every 3 hours',
    'Applies to users generally, alongside the Free daily cap. Rolling, not a daily reset. Crucially, the FAQ says FAILED upload attempts can count toward it, which is why people hit it having uploaded almost nothing.'
  ),

  filesPerGpt: verified(
    '10 files per GPT',
    'For the LIFETIME of that GPT, not per conversation. A frequent misunderstanding.'
  ),

  projectFilesPlus: verified('20 files per project', 'Plus plan.'),

  projectFilesPro: verified(
    '40 files per project',
    'Pro, Team, Education and Business plans share this figure.'
  ),

  // ── Storage caps. The explanation for "upload limit reached" when the user has barely
  //    uploaded anything. ─────────────────────────────────────────────────────────────────────
  userStorageCap: verified(
    '25 GB',
    'Per end user, shared across chats, Projects and custom GPT knowledge. Visible in ChatGPT under Settings then Storage.'
  ),

  orgStorageCap: verified('100 GB', 'Per organisation.'),

  quotaVisibility: verified(
    'storage only',
    'ChatGPT shows Library storage usage under Settings then Storage, but does NOT show how much of the rolling upload-rate quota is left. Worth telling readers, because they go looking for it.'
  ),

  // ── What is accepted ───────────────────────────────────────────────────────────────────────
  supportedTypesStatement: verified(
    'All common file extensions for text files, spreadsheets, presentations, and documents.',
    'OpenAI\'s exact wording. They publish no explicit extension whitelist. Quote it verbatim rather than paraphrasing into a list we invented.'
  ),

  // Deliberately phrased as "not listed" rather than "not supported". The FAQ names four families
  // and video is not among them, which is a fact about the document. Whether some other part of
  // ChatGPT can handle video is a separate question this page does not answer, and claiming
  // otherwise from silence is exactly the sort of confident guess this file exists to prevent.
  videoInSupportedTypes: verified(
    false,
    'The FAQ lists text files, spreadsheets, presentations and documents. Video is not among them. Write "not listed among the supported types", never "ChatGPT cannot process video", which the source does not say.'
  ) as Fact<boolean>,

  audioInSupportedTypes: verified(
    false,
    'Same as video. Also do not conflate file upload with voice mode, which is a different feature entirely.'
  ) as Fact<boolean>,

  // ── The scanned-PDF explanation, and one of the most useful facts on the whole page ────────
  imagesInDocuments: verified(
    'text only, except Enterprise',
    'The FAQ: ChatGPT Enterprise supports Visual Retrieval for PDFs. "All other plans and document files only support text-based retrieval. This means that ChatGPT will extract digital text from the file and discard any images." This is the real reason a scanned PDF produces nothing on Free or Plus, and almost nobody explains it correctly.'
  ),

  // ── Availability and retention ─────────────────────────────────────────────────────────────
  availability: verified(
    'Free and paid plans, web and supported mobile apps',
    'Subject to plan-specific usage limits and account settings. Also available through the API with separate limits.'
  ),

  fileRetention: verified(
    '30 days after deletion',
    'Files live as long as the chat that holds them. Delete the chat, the account, or the custom GPT, and the file goes within 30 days, unless already de-identified or held for security or legal reasons.'
  ),
} as const;

export type FactKey = keyof typeof CHATGPT_FACTS;

function render(value: string | boolean): string {
  return typeof value === 'boolean' ? (value ? 'yes' : 'no') : value;
}

/**
 * The value ready to drop into a sentence, hedged when it has not been verified.
 *
 * Prefer this over reading `.value` directly, which prints an unconfirmed number as though it were
 * established.
 */
export function stateFact(key: FactKey): string {
  const fact = CHATGPT_FACTS[key] as Fact<string | boolean>;
  return fact.status === 'verified'
    ? render(fact.value)
    : `around ${render(fact.value)} (unconfirmed)`;
}

/**
 * Throws at BUILD time if a page states a fact nobody has verified.
 *
 * For pages whose headline claim IS the fact, where a hedge would not be honest enough. A page
 * titled "ChatGPT's maximum file size" cannot ship with "(unconfirmed)" in its opening line.
 */
export function assertVerified(key: FactKey): string {
  const fact = CHATGPT_FACTS[key] as Fact<string | boolean>;
  if (fact.status !== 'verified') {
    throw new Error(
      `[chatgpt-facts] "${key}" is ${fact.status} and a page tried to state it as established fact.\n` +
        `Confirm it at ${fact.source}, then set status: 'verified' in lib/chatgpt-facts.ts.`
    );
  }
  return render(fact.value);
}

/** Every fact still awaiting confirmation. Empty is the healthy state. */
export function unverifiedFacts(): Array<{ key: FactKey; fact: Fact<string | boolean> }> {
  return (Object.keys(CHATGPT_FACTS) as FactKey[])
    .map((key) => ({ key, fact: CHATGPT_FACTS[key] as Fact<string | boolean> }))
    .filter(({ fact }) => fact.status !== 'verified');
}

/** The date the facts were last confirmed, for the "last checked" line on fact-heavy pages. */
export const FACTS_VERIFIED_ON = VERIFIED_ON;
