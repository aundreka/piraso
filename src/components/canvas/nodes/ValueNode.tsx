import { Handle, Position } from '@xyflow/react';
import type { FlowNodeDataMap } from '../../../types/flow';
import { puzzleConnector, puzzleSlot } from './puzzleStyles';

type ValueNodeProps = {
  id: string;
  data: FlowNodeDataMap['valueNode'];
};

export default function ValueNode({ id, data }: ValueNodeProps) {
  const handleChange = (value: string) => {
    data.onChange(id, { value });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'visible',
      }}
    >
      <div style={puzzleConnector('#22c55e', 'top', 170, 42)} />
      <div style={puzzleSlot('top')} />
      <Handle
        id="value-target"
        type="target"
        position={Position.Top}
        style={{
          background: '#16a34a',
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
          background: '#16a34a',
          borderRadius: 28,
          padding: '14px 16px 20px',
          minHeight: 140,
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            width: 50,
            height: 10,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.6)',
            margin: '0 auto',
          }}
        />
        <div style={{ fontWeight: 700, fontSize: 14 }}>Value</div>
        <input
          value={data.value}
          onChange={(event) => handleChange(event.target.value)}
          placeholder="literal"
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
      <div style={puzzleConnector('#22c55e', 'bottom', 170, 42)} />
      <div style={puzzleSlot('bottom')} />
      <Handle
        id="value-source"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#16a34a',
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
