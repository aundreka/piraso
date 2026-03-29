import type { ReactNode } from 'react';

type AppLayoutProps = {
  leftPanel: ReactNode;
  canvas: ReactNode;
  rightPanel: ReactNode;
  bottomPanel: ReactNode;
  onExecute: () => void;
  isExecuting?: boolean;
  canExecute?: boolean;
  canvasTitle?: string;
};

export default function AppLayout({
  leftPanel,
  canvas,
  rightPanel,
  bottomPanel,
  onExecute,
  isExecuting = false,
  canExecute = true,
  canvasTitle,
}: AppLayoutProps) {
  const isButtonDisabled = isExecuting || !canExecute;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f5ef', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: '#e94f37',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                width: 18,
                height: 18,
                borderRadius: 6,
                background: '#fff',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 6,
                right: 10,
                width: 10,
                height: 10,
                borderRadius: 999,
                background: '#f4b041',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>piraso</span>
            <span style={{ fontSize: 12, color: '#888' }}>visual sql</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, transform: 'scale(0.8)' }}>
            <span style={{ width: 24, height: 2, background: '#111', borderRadius: 1 }} />
            <span style={{ width: 18, height: 2, background: '#111', borderRadius: 1 }} />
            <span style={{ width: 14, height: 2, background: '#111', borderRadius: 1 }} />
          </div>
          <button
            type="button"
            onClick={onExecute}
            disabled={isButtonDisabled}
            style={{
              padding: '10px 20px',
              borderRadius: 999,
              border: 'none',
              background: isButtonDisabled ? '#96cf99' : '#0d6a4e',
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 6px 16px rgba(13,106,78,0.35)',
              cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            Execute
          </button>
        </div>
      </header>
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <aside
          style={{
            width: 220,
            borderRight: '1px solid rgba(0,0,0,0.08)',
            background: '#fff',
            padding: 18,
          }}
        >
          {leftPanel}
        </aside>
        <section
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: '12px 10px 10px',
            minHeight: 0,
          }}
        >
          <div style={{ padding: '0 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{canvasTitle ?? 'Builder'}</h1>
          </div>
          <div
            style={{
              flex: 1,
              borderRadius: 28,
              background: '#fff',
              margin: '0 12px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(15,15,15,0.05)',
            }}
          >
            {canvas}
          </div>
        </section>
        <aside
          style={{
            width: 320,
            borderLeft: '1px solid rgba(0,0,0,0.08)',
            background: '#fff',
            padding: 18,
            overflow: 'hidden',
          }}
        >
          {rightPanel}
        </aside>
      </div>
      <div
        style={{
          borderTop: '1px solid rgba(0,0,0,0.08)',
          background: '#fff',
          padding: '10px 24px',
        }}
      >
        {bottomPanel}
      </div>
    </div>
  );
}
