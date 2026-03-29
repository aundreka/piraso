import { Handle, Position } from '@xyflow/react';
import type { FlowNodeDataMap } from '../../../types/flow';
import { puzzleConnector, puzzleSlot } from './puzzleStyles';

type QueryNodeProps = {
  id: string;
  data: FlowNodeDataMap['queryNode'];
};

const slotHighlights = ['WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT'] as const;

export default function QueryNode({ data }: QueryNodeProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'visible',
      }}
    >
      <div style={puzzleConnector('#0b3c82', 'top', 360, 64)} />
      <div style={puzzleSlot('top')} />
      <Handle
        id="query-target"
        type="target"
        position={Position.Top}
        style={{
          background: '#0b3c82',
          width: 28,
          height: 10,
          borderRadius: 4,
          top: -14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
        }}
      />
      <div
        style={{
          width: 360,
        minHeight: 580,
          borderRadius: 48,
          background: '#0b3c82',
          boxShadow: '0 30px 60px rgba(11,60,130,0.35)',
          padding: '24px 24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
          <div
            style={{
              width: 46,
              background: '#081f4e',
              borderRadius: '24px 0 0 24px',
            }}
          />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 18,
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontWeight: 700,
                  letterSpacing: 1.4,
                }}
              >
                SELECT
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                {[0, 1].map((index) => (
                  <div
                    key={index}
                    style={{
                      width: index === 0 ? 50 : 34,
                      height: 16,
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.35)',
                    }}
                  />
                ))}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>FROM</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 18,
                background: 'rgba(0,0,0,0.18)',
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontWeight: 600,
                  letterSpacing: 1,
                  fontSize: 12,
                }}
              >
                AS
              </span>
              <div
                style={{
                  width: 72,
                  height: 18,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.45)',
                }}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 26,
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
            {data.title ?? 'Forecast Demand'}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
            This is the root container. Drop other blocks into the highlighted slots to complete the query.
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          {slotHighlights.map((label) => (
            <div
              key={label}
              style={{
                borderRadius: 18,
                padding: '10px 12px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 1,
                textAlign: 'center',
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      <div style={puzzleConnector('#0b3c82', 'bottom', 360, 64)} />
      <div style={puzzleSlot('bottom')} />
      <Handle
        id="query-source"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#0b3c82',
          width: 28,
          height: 10,
          borderRadius: 4,
          bottom: -14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
        }}
      />
    </div>
  );
}
