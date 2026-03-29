import { Handle, Position } from '@xyflow/react';
import type { FlowNodeDataMap } from '../../../types/flow';
import { useFlowMetadata } from '../FlowMetadataContext';
import { baseHighlight, puzzleConnector, puzzleSlot } from './puzzleStyles';

type AggregateNodeProps = {
  id: string;
  data: FlowNodeDataMap['aggregateNode'];
};

const FUNCTIONS: AggregateNodeProps['data']['func'][] = [
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
];

const sideConnector = (position: 'left' | 'right') => ({
  position: 'absolute' as const,
  top: '38%',
  width: 34,
  height: 80,
  borderRadius: 999,
  background: '#163d7d',
  boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
  left: position === 'left' ? -18 : undefined,
  right: position === 'right' ? -18 : undefined,
});

export default function AggregateNode({ id, data }: AggregateNodeProps) {
  const { fieldOptions } = useFlowMetadata();
  const change = (updates: Record<string, unknown>) => {
    data.onChange(id, updates);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: 260,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'visible',
        padding: '0 12px',
      }}
    >
      <div style={puzzleConnector('#163d7d', 'top', 260, 58)} />
      <div style={puzzleSlot('top')} />
      <Handle
        id="aggregate-target"
        type="target"
        position={Position.Top}
        style={{
          background: '#fff',
          width: 30,
          height: 10,
          borderRadius: 4,
          top: -16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
        }}
      />
      <div style={sideConnector('left')} />
      <div style={sideConnector('right')} />
      <div
        style={{
          background: '#163d7d',
          borderRadius: 36,
          padding: '18px 22px',
          minHeight: 280,
          boxShadow: '0 28px 48px rgba(11, 35, 87, 0.55)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <div style={baseHighlight} />
        <div style={{ fontWeight: 700, fontSize: 16 }}>Aggregate Container</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>
          Group your logic inside this container
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={data.func}
            onChange={(event) => change({ func: event.target.value })}
            style={{
              flex: 1,
              borderRadius: 12,
              padding: '6px 10px',
              fontWeight: 600,
            }}
          >
            {FUNCTIONS.map((func) => (
              <option key={func} value={func}>
                {func}
              </option>
            ))}
          </select>
            <select
              value={data.field}
              onChange={(event) => change({ field: event.target.value })}
              style={{
                flex: 1,
                borderRadius: 12,
                padding: '6px 10px',
                fontWeight: 600,
              }}
            >
              <option value="">Field</option>
              {fieldOptions.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
        </div>
        <input
          placeholder="Alias"
          value={data.alias ?? ''}
          onChange={(event) => change({ alias: event.target.value })}
          style={{
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.6)',
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontWeight: 600,
          }}
        />
        <div
          style={{
            borderRadius: 18,
            background: '#1f5da1',
            padding: '10px 12px',
            fontSize: 12,
            opacity: 0.9,
          }}
        >
          Drag this container around the canvas to keep groups tidy.
        </div>
      </div>
      <div style={puzzleConnector('#163d7d', 'bottom', 260, 58)} />
      <div style={puzzleSlot('bottom')} />
      <Handle
        id="aggregate-source"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#163d7d',
          width: 30,
          height: 10,
          borderRadius: 4,
          bottom: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
        }}
      />
    </div>
  );
}
