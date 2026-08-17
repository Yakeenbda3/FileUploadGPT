import { ImageResponse } from 'next/og';
import { CATEGORIES, getAllArticleSlugs, getArticle } from '@/lib/articles';

// A social card per article, carrying that article's own headline.
//
// Generated at build rather than designed by hand, which is the only version of this that survives
// 56 articles and counting. A shared link now shows what the page is actually about instead of one
// generic image, and the alternative, a hand-made image per article, would be abandoned by article
// twelve and then quietly wrong for the rest.

export const alt = 'FileUploadGPT guide';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export default async function ArticleOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  const heading = article?.meta.heading ?? 'FileUploadGPT';
  const category = article ? CATEGORIES[article.meta.category].label : '';

  // Long headings need a smaller size or they overflow the card. Three bands rather than a formula,
  // because the formula would need tuning against a font metric we do not have here.
  const fontSize = heading.length > 62 ? 52 : heading.length > 44 ? 60 : 68;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0A2A36 0%, #155E75 100%)',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '11px',
              background: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
            }}
          >
            ↑
          </div>
          <div style={{ fontSize: '26px', color: '#B3DCE8', fontWeight: 600 }}>FileUploadGPT</div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: `${fontSize}px`,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            maxWidth: '1000px',
          }}
        >
          {heading}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              fontSize: '22px',
              color: '#0A2A36',
              background: '#7FC2D6',
              padding: '9px 20px',
              borderRadius: '999px',
              fontWeight: 600,
            }}
          >
            {category}
          </div>
          <div style={{ fontSize: '22px', color: '#7FC2D6' }}>fileuploadgpt.com</div>
        </div>
      </div>
    ),
    size
  );
}
