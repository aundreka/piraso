import { Handle, Position } from '@xyflow/react';
import type { FlowNodeDataMap } from '../../../types/flow';
import { useFlowMetadata } from '../FlowMetadataContext';
import { baseHighlight, puzzleConnector, puzzleSlot } from './puzzleStyles';

type ColumnNodeProps = {
  id: string;
  data: FlowNodeDataMap['columnNode'];
};

export default function ColumnNode({ id, data }: ColumnNodeProps) {
  const { tableOptions, columnsByTable } = useFlowMetadata();
  const availableColumns = data.table ? columnsByTable[data.table] ?? [] : [];

  const handleTableChange = (value: string) => {
    data.onChange(id, { table: value, column: '' });
  };

  const handleColumnChange = (value: string) => {
    data.onChange(id, { column: value });
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
      <div style={puzzleConnector('#15847d', 'top', 210, 50)} />
      <div style={puzzleSlot('top')} />
      <Handle
        id="column-target"
        type="target"
        position={Position.Top}
        style={{
          background: '#0f5a44',
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
          background: '#0f5a44',
          borderRadius: 30,
          padding: '16px 18px 26px',
          minHeight: 190,
          boxShadow: '0 26px 50px rgba(0,0,0,0.25)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <div style={baseHighlight} />
        <div style={{ fontWeight: 700, fontSize: 15 }}>Column</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Select which table column this block represents.
        </div>
        <select
          value={data.table ?? ''}
          onChange={(event) => handleTableChange(event.target.value)}
          style={{
            borderRadius: 12,
            padding: '6px 10px',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#fff',
          }}
        >
          <option value="">Table</option>
          {tableOptions.map((tableName) => (
            <option key={tableName} value={tableName}>
              {tableName}
            </option>
          ))}
        </select>
        <select
          value={data.column ?? ''}
          onChange={(event) => handleColumnChange(event.target.value)}
          style={{
            borderRadius: 12,
            padding: '6px 10px',
            fontWeight: 600,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#fff',
          }}
        >
          <option value="">Column</option>
          {availableColumns.map((column) => (
            <option key={column.value} value={column.value}>
              {column.label}
            </option>
          ))}
        </select>
      </div>
      <div style={puzzleConnector('#15847d', 'bottom', 210, 50)} />
      <div style={puzzleSlot('bottom')} />
      <Handle
        id="column-source"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#15847d',
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
