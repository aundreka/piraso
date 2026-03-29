import { Handle, Position } from '@xyflow/react';
import type { FlowNodeDataMap } from '../../../types/flow';
import { useFlowMetadata } from '../FlowMetadataContext';
import { baseHighlight, puzzleConnector, puzzleSlot } from './puzzleStyles';

type WhereNodeProps = {
  id: string;
  data: FlowNodeDataMap['whereNode'];
};

const operatorOptions = ['=', '!=', '>', '<', '>=', '<=', 'LIKE'] as const;

export default function WhereNode({ id, data }: WhereNodeProps) {
  const { fieldOptions } = useFlowMetadata();
  const handleFieldChange = (value: string) => {
    data.onChange(id, { field: value });
  };

  const handleOperatorChange = (value: string) => {
    data.onChange(id, { operator: value });
  };

  const handleValueChange = (value: string) => {
    data.onChange(id, { value });
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
      <div style={puzzleConnector('#facc4f', 'top', 200, 48)} />
      <div style={puzzleSlot('top')} />
      <Handle
        id="where-target"
        type="target"
        position={Position.Top}
        style={{
          background: '#fff',
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
          background: '#ffcf4b',
          borderRadius: 30,
          padding: '16px 18px 26px',
          minHeight: 240,
          boxShadow: '0 26px 50px rgba(0,0,0,0.28)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <div style={baseHighlight} />
        <div style={{ fontWeight: 700, fontSize: 15 }}>Where</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Filter the dataset with conditions
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={data.field}
            onChange={(event) => handleFieldChange(event.target.value)}
            style={{
              flex: 1,
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.15)',
              padding: '6px 10px',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <option value="">Field</option>
            {fieldOptions.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
          <select
            value={data.operator}
            onChange={(event) => handleOperatorChange(event.target.value)}
            style={{
              flex: 0.8,
              borderRadius: 12,
              border: '1px solid rgba(0,0,0,0.15)',
              padding: '6px 10px',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {operatorOptions.map((operator) => (
              <option key={operator} value={operator}>
                {operator}
              </option>
            ))}
          </select>
        </div>
        <input
          placeholder="value"
          value={data.value}
          onChange={(event) => handleValueChange(event.target.value)}
          style={{
            borderRadius: 14,
            border: '1px solid rgba(0,0,0,0.2)',
            padding: '8px 12px',
            fontWeight: 600,
          }}
        />
      </div>
      <div style={puzzleConnector('#facc4f', 'bottom', 200, 48)} />
      <div style={puzzleSlot('bottom')} />
      <Handle
        id="where-source"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#facc4f',
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
