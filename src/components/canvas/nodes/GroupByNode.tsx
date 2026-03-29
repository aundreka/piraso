import { Handle, Position } from '@xyflow/react';
import type { FlowNodeDataMap } from '../../../types/flow';
import { useFlowMetadata } from '../FlowMetadataContext';
import { baseHighlight, puzzleConnector, puzzleSlot } from './puzzleStyles';

type GroupByNodeProps = {
  id: string;
  data: FlowNodeDataMap['groupByNode'];
};

export default function GroupByNode({ id, data }: GroupByNodeProps) {
  const { fieldOptions } = useFlowMetadata();
  const handleChange = (value: string) => {
    data.onChange(id, { label: value });
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
      <div style={puzzleConnector('#f97316', 'top', 210, 48)} />
      <div style={puzzleSlot('top')} />
      <Handle
        id="groupby-target"
        type="target"
        position={Position.Top}
        style={{
          background: '#f97316',
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
          background: '#f97316',
          borderRadius: 36,
          padding: '16px 18px 26px',
          minHeight: 180,
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
        <div style={{ fontWeight: 700, fontSize: 15 }}>Group By</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Drop the column or pick a field to roll up results.
        </div>
        <select
          value={data.label ?? ''}
          onChange={(event) => handleChange(event.target.value)}
          style={{
            borderRadius: 12,
            padding: '6px 10px',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#fff',
          }}
        >
          <option value="">Group field</option>
          {fieldOptions.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>
      <div style={puzzleConnector('#f97316', 'bottom', 210, 48)} />
      <div style={puzzleSlot('bottom')} />
      <Handle
        id="groupby-source"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#f97316',
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
