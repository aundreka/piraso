import { Handle, Position } from '@xyflow/react';
import type { FlowNodeDataMap } from '../../../types/flow';
import { baseHighlight, puzzleConnector, puzzleSlot } from './puzzleStyles';

type ConditionNodeProps = {
  id: string;
  data: FlowNodeDataMap['conditionNode'];
};

const operatorOptions: FlowNodeDataMap['conditionNode']['operator'][] = [
  '=',
  '!=',
  '>',
  '<',
  '>=',
  '<=',
  'LIKE',
];

export default function ConditionNode({ id, data }: ConditionNodeProps) {
  const handleOperatorChange = (value: string) => {
    data.onChange(id, { operator: value });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'visible',
      }}
    >
      <div style={puzzleConnector('#38a169', 'top', 210, 44)} />
      <div style={puzzleSlot('top')} />
      <Handle
        id="condition-target"
        type="target"
        position={Position.Top}
        style={{
          background: '#fff',
          width: 28,
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
          background: '#38a169',
          borderRadius: 32,
          padding: '16px 18px 24px',
          minHeight: 200,
          boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <div style={baseHighlight} />
        <div style={{ fontWeight: 700, fontSize: 15 }}>Condition</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Drop value or column blocks into the left and right slots.
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            width: '100%',
          }}
        >
          {['left', 'right'].map((label) => (
            <div
              key={label}
              style={{
                flex: 1,
                borderRadius: 12,
                border: '1px dashed rgba(255,255,255,0.6)',
                padding: '8px 10px',
                textAlign: 'center',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}
            >
              {label} slot
            </div>
          ))}
        </div>
        <select
          value={data.operator}
          onChange={(event) => handleOperatorChange(event.target.value)}
          style={{
            borderRadius: 12,
            padding: '6px 10px',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#fff',
          }}
        >
          {operatorOptions.map((operator) => (
            <option key={operator} value={operator}>
              {operator}
            </option>
          ))}
        </select>
      </div>
      <div style={puzzleConnector('#38a169', 'bottom', 210, 44)} />
      <div style={puzzleSlot('bottom')} />
      <Handle
        id="condition-source"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#38a169',
          width: 28,
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
