import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import { InlineInstall } from '@/components/cta/InlineInstall';
import { Callout } from '@/components/article/Callout';
import { AnswerBox } from '@/components/article/AnswerBox';
import { Steps, Step } from '@/components/article/Steps';
import { Fact } from '@/components/article/Fact';

/**
 * How markdown in an article becomes styled HTML, plus the components an author may use directly.
 *
 * Two jobs here beyond styling:
 *
 * 1. HEADING IDS. Every h2 and h3 gets a stable id derived from its text, so the table of contents
 *    can link to it and so a reader can share a link to one section. Derived rather than
 *    hand-written, because a hand-written anchor and the heading beside it drift apart the first
 *    time someone edits the wording.
 *
 * 2. INTERNAL LINKS GO THROUGH next/link. Markdown produces a plain <a>, which triggers a full page
 *    load and loses the client-side transition. Detecting the internal ones here means an author
 *    writes ordinary markdown and still gets the right behaviour.
 */

function slugify(children: React.ReactNode): string {
  const text = extractText(children);
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return '';
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => <h2 id={slugify(children)}>{children}</h2>,
    h3: ({ children }) => <h3 id={slugify(children)}>{children}</h3>,

    a: ({ href = '', children, ...rest }) => {
      const isInternal = href.startsWith('/') || href.startsWith('#');
      if (isInternal) {
        return (
          <Link href={href} {...rest}>
            {children}
          </Link>
        );
      }
      // External links open in a new tab. `noopener` is not optional: without it the opened page
      // gets a handle on ours via window.opener and can navigate it somewhere else.
      return (
        <a href={href} target="_blank" rel="noopener nofollow" {...rest}>
          {children}
        </a>
      );
    },

    // Wide comparison tables scroll inside their own box rather than forcing the page sideways.
    table: ({ children }) => (
      <div className="table-scroll my-6">
        <table>{children}</table>
      </div>
    ),

    // Components an author can use inside an .mdx file without importing anything.
    Callout,
    AnswerBox,
    Steps,
    Step,
    Fact,
    InlineInstall,

    ...components,
  };
}
