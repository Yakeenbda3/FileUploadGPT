import { ImageResponse } from 'next/og';

// The site-wide social card, used by every page that does not generate its own.
//
// It exists because of a defect rather than for decoration: every page was declaring
// `twitter:card: summary_large_image` with no image behind it, so every share produced an empty
// card. Promising a large image and delivering nothing is worse than declaring a plain summary
// card, and on a site whose growth depends on being linked to, a blank card is a real cost.

export const alt = 'FileUploadGPT: get big files into ChatGPT';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A2A36 0%, #155E75 100%)',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
            }}
          >
            ↑
          </div>
          <div style={{ fontSize: '30px', color: '#B3DCE8', fontWeight: 600 }}>FileUploadGPT</div>
        </div>

        <div
          style={{
            fontSize: '68px',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            maxWidth: '900px',
          }}
        >
          Upload files ChatGPT says are too big
        </div>

        <div style={{ fontSize: '30px', color: '#7FC2D6', marginTop: '32px', maxWidth: '860px' }}>
          A free Chrome extension that splits long documents and feeds them in for you
        </div>
      </div>
    ),
    size
  );
}
