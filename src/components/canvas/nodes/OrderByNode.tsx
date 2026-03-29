import { Handle, Position } from '@xyflow/react';
import type { FlowNodeDataMap } from '../../../types/flow';
import { useFlowMetadata } from '../FlowMetadataContext';
import { baseHighlight, puzzleConnector, puzzleSlot } from './puzzleStyles';

type OrderByNodeProps = {
  id: string;
  data: FlowNodeDataMap['orderByNode'];
};

const directionOptions: FlowNodeDataMap['orderByNode']['direction'][] = ['ASC', 'DESC'];

export default function OrderByNode({ id, data }: OrderByNodeProps) {
  const { fieldOptions } = useFlowMetadata();
  const handleFieldChange = (value: string) => {
    data.onChange(id, { field: value });
  };

  const handleDirectionChange = (value: string) => {
    data.onChange(id, { direction: value });
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
        id="orderby-target"
        type="target"
        position={Position.Top}
        style={{
          background: '#d97706',
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
          background: '#d97706',
          borderRadius: 34,
          padding: '16px 18px 24px',
          minHeight: 200,
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
        <div style={{ fontWeight: 700, fontSize: 15 }}>Order By</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Choose the columns that should determine ordering.
        </div>
        <select
          value={data.field ?? ''}
          onChange={(event) => handleFieldChange(event.target.value)}
          style={{
            borderRadius: 12,
            padding: '6px 10px',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#fff',
          }}
        >
          <option value="">Order field</option>
          {fieldOptions.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
        <select
          value={data.direction}
          onChange={(event) => handleDirectionChange(event.target.value)}
          style={{
            borderRadius: 12,
            padding: '6px 10px',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#fff',
          }}
        >
          {directionOptions.map((direction) => (
            <option key={direction} value={direction}>
              {direction}
            </option>
          ))}
        </select>
      </div>
      <div style={puzzleConnector('#f97316', 'bottom', 210, 48)} />
      <div style={puzzleSlot('bottom')} />
      <Handle
        id="orderby-source"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#d97706',
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
