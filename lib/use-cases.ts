// The five audience pages, as data.
//
// One template renders all of them, so a change to the layout or the call to action reaches every
// page. On the old site these were five hand-maintained HTML files that had already drifted apart
// on their canonical tags.

export interface UseCase {
  slug: string;
  title: string;
  heading: string;
  description: string;
  /** The concrete situation, in the reader's own terms. No product talk here. */
  problem: string;
  /** Things this audience actually does, phrased as tasks rather than features. */
  jobs: string[];
  /** An honest boundary. Every page names something the tool will not do for them. */
  limitation: string;
}

export const USE_CASES: UseCase[] = [
  {
    slug: 'students',
    title: 'ChatGPT for coursework and revision',
    heading: 'Getting your reading list into ChatGPT',
    description:
      'Lecture notes, textbook chapters and past papers are usually too long to upload. Here is how to work with them anyway.',
    problem:
      'A textbook chapter runs to tens of thousands of words. ChatGPT takes the file, reads the first part, and gives you a summary of chapter one when you asked about chapter nine.',
    jobs: [
      'Turn a long chapter into questions you can test yourself against',
      'Get an explanation of a concept in the words your course actually uses',
      'Compare your lecture notes against the set reading to find what you missed',
      'Work through a past paper with the marking scheme alongside it',
    ],
    limitation:
      'It will not read a photograph of a page. Scanned handouts and phone pictures of a whiteboard contain no text to extract, so run them through OCR first or type out the part you need.',
  },
  {
    slug: 'developers',
    title: 'ChatGPT for code review and debugging',
    heading: 'Getting a codebase in front of ChatGPT',
    description:
      'How to share code that spans several files, what to leave out, and why sending less usually produces a better review.',
    problem:
      'The bug spans four files and a schema. Pasting them one at a time loses the connection between them, and uploading the whole repository buries the answer in dependency directories.',
    jobs: [
      'Review a module for bugs rather than style opinions',
      'Explain an unfamiliar codebase before you change it',
      'Draft tests against code that has none',
      'Work out why a stack trace points where it does',
    ],
    limitation:
      'Check for secrets before you upload. Environment files, keys in config, and connection strings in fixtures all go to OpenAI along with everything else, and on consumer plans content may be used to improve models unless you have turned that off.',
  },
  {
    slug: 'researchers',
    title: 'ChatGPT for papers and literature reviews',
    heading: 'Working through papers with ChatGPT',
    description:
      'Triaging a reading list, pulling structured summaries out of papers, and the two things you should never trust it on.',
    problem:
      'Twenty papers, and you need to know which three are actually about your question. Reading all of them properly is a week you do not have.',
    jobs: [
      'Triage a reading list down to what is genuinely relevant',
      'Pull the same structured summary out of every paper so they can be compared',
      'Get oriented in a field that is not yours',
      'Draft the peer review comments a hostile referee would return',
    ],
    limitation:
      'It cannot see your figures. Every plan except Enterprise discards images from uploads, so anything that only appears in a chart is invisible to it. And it invents citations, so check every reference against a real database.',
  },
  {
    slug: 'business-professionals',
    title: 'ChatGPT for reports and contracts',
    heading: 'Reading long business documents faster',
    description:
      'Getting a usable read on a contract, a board pack or a vendor proposal, and what to check before acting on it.',
    problem:
      'A ninety-page vendor agreement, a meeting in an hour, and the clause that matters is somewhere in the schedules at the back.',
    jobs: [
      'Get a plain-language read on a contract before it reaches legal',
      'Find what a document is missing compared with a normal agreement of its type',
      'Turn a board pack into the three decisions it actually asks for',
      'Compare vendor proposals on the dimensions you care about',
    ],
    limitation:
      'It does not know what is enforceable where you are, or what is standard in your market. Use it to arrive at your lawyer prepared, not to replace the conversation.',
  },
  {
    slug: 'content-creators',
    title: 'ChatGPT for scripts and content work',
    heading: 'Working with long drafts and transcripts',
    description:
      'Repurposing long-form work, keeping a consistent voice across pieces, and getting transcripts into a usable state.',
    problem:
      'An hour-long transcript or a long draft, and you want it reshaped for three different places without rewriting it three times.',
    jobs: [
      'Turn a long transcript into an article, a newsletter and a set of posts',
      'Get a structural edit on a draft rather than line-level nitpicking',
      'Keep tone consistent by giving it your existing work as a reference',
      'Find the strongest sections of something long before you cut it down',
    ],
    limitation:
      'Video and audio are not among the file types ChatGPT accepts. Get a transcript first, then upload that as text. Transcription tools are cheap and the text file goes through without any trouble.',
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((useCase) => useCase.slug === slug);
}
