import { Handle, Position } from '@xyflow/react';
import type { FlowNodeDataMap } from '../../../types/flow';
import { useFlowMetadata } from '../FlowMetadataContext';
import { baseHighlight, puzzleConnector, puzzleSlot } from './puzzleStyles';

type SelectNodeProps = {
  id: string;
  data: FlowNodeDataMap['selectNode'];
};

export default function SelectNode({ id, data }: SelectNodeProps) {
  const { fieldOptions } = useFlowMetadata();
  const displayedColumns = fieldOptions.slice(0, 6);

  const toggleColumn = (value: string) => {
    const hasColumn = data.columns.includes(value);
    const nextColumns = hasColumn
      ? data.columns.filter((column) => column !== value)
      : [...data.columns, value];

    data.onChange(id, { columns: nextColumns });
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
      <div style={puzzleConnector('#f5c24f', 'top', 190, 46)} />
      <div style={puzzleSlot('top')} />
      <Handle
        id="select-target"
        type="target"
        position={Position.Top}
        style={{
          background: '#f8f5ef',
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
          background: '#f5c24f',
          borderRadius: 30,
          padding: '14px 18px 28px',
          minHeight: 230,
          boxShadow: '0 22px 45px rgba(0,0,0,0.28)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          color: '#2f2000',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <div style={baseHighlight} />
        <div
          style={{
            width: 52,
            height: 14,
            borderRadius: 999,
            background: '#fff',
            opacity: 0.6,
            margin: '0 auto',
          }}
        />
        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>
          Column Picker
        </div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Pick the columns you want to surface
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {displayedColumns.map((field) => (
            <label
              key={field.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
              }}
            >
              <input
                type="checkbox"
                checked={data.columns.includes(field.value)}
                onChange={() => toggleColumn(field.value)}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  accentColor: '#d94f1b',
                }}
              />
              <span style={{ flex: 1 }}>{field.label}</span>
            </label>
          ))}
          {displayedColumns.length === 0 && (
            <span style={{ fontSize: 12, opacity: 0.6 }}>
              Active tables have no columns yet.
            </span>
          )}
        </div>
      </div>
      <div style={puzzleConnector('#f5c24f', 'bottom', 190, 46)} />
      <div style={puzzleSlot('bottom')} />
      <Handle
        id="select-source"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#f5c24f',
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
