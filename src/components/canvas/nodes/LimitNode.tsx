import { Handle, Position } from '@xyflow/react';
import type { FlowNodeDataMap } from '../../../types/flow';
import { baseHighlight, puzzleConnector, puzzleSlot } from './puzzleStyles';

type LimitNodeProps = {
  id: string;
  data: FlowNodeDataMap['limitNode'];
};

export default function LimitNode({ id, data }: LimitNodeProps) {
  const handleChange = (value: string) => {
    data.onChange(id, { value });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'visible',
      }}
    >
      <div style={puzzleConnector('#ea580c', 'top', 190, 46)} />
      <div style={puzzleSlot('top')} />
      <Handle
        id="limit-target"
        type="target"
        position={Position.Top}
        style={{
          background: '#ea580c',
          width: 26,
          height: 10,
          borderRadius: 4,
          top: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
        }}
      />
      <div
        style={{
          background: '#ea580c',
          borderRadius: 32,
          padding: '16px 18px 26px',
          minHeight: 170,
          boxShadow: '0 24px 44px rgba(0,0,0,0.24)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <div style={baseHighlight} />
        <div style={{ fontWeight: 700, fontSize: 15 }}>Limit</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Control how many rows the query returns.
        </div>
        <input
          value={data.value}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="rows"
          type="number"
          min="1"
          style={{
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.6)',
            padding: '8px 10px',
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            fontWeight: 600,
            textAlign: 'center',
          }}
        />
      </div>
      <div style={puzzleConnector('#ea580c', 'bottom', 190, 46)} />
      <div style={puzzleSlot('bottom')} />
      <Handle
        id="limit-source"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#ea580c',
          width: 26,
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
