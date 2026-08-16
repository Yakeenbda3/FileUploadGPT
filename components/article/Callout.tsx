import type { ReactNode } from 'react';

type Variant = 'info' | 'warn' | 'tip';

const PRESETS: Record<Variant, { className: string; defaultTitle: string; icon: ReactNode }> = {
  info: {
    className: 'callout-info',
    defaultTitle: 'Worth knowing',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 7.2v4.2M8 4.6v.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  warn: {
    className: 'callout-warn',
    defaultTitle: 'Careful',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 2.4 14.4 13H1.6L8 2.4Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M8 6.6v3M8 11.3v.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  tip: {
    className: 'callout-tip',
    defaultTitle: 'Quicker way',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M6.2 12.5h3.6M6.6 14.2h2.8M8 1.8a4.2 4.2 0 0 1 2.5 7.6c-.4.3-.6.7-.6 1.1H6.1c0-.4-.2-.8-.6-1.1A4.2 4.2 0 0 1 8 1.8Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

/** A boxed aside inside an article. `warn` is for things that lose the reader data or money. */
export function Callout({
  variant = 'info',
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const preset = PRESETS[variant];
  return (
    <div className={`not-prose my-6 callout ${preset.className}`}>
      <p className="callout-title text-[0.875rem]">
        {preset.icon}
        {title ?? preset.defaultTitle}
      </p>
      <div className="text-[0.9375rem] leading-relaxed text-ink-soft [&_a]:font-medium [&_a]:text-brand-700 [&_a]:underline [&>*+*]:mt-2">
        {children}
      </div>
    </div>
  );
}
