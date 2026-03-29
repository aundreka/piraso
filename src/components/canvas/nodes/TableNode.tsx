import { Handle, Position } from '@xyflow/react';
import type { FlowNodeDataMap } from '../../../types/flow';
import { useFlowMetadata } from '../FlowMetadataContext';
import { baseHighlight, puzzleConnector, puzzleSlot } from './puzzleStyles';

type TableNodeProps = {
  id: string;
  data: FlowNodeDataMap['tableNode'];
};

export default function TableNode({ id, data }: TableNodeProps) {
  const { tableOptions } = useFlowMetadata();
  const handleChange = (value: string) => {
    data.onChange(id, { tableName: value });
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
      <div style={puzzleConnector('#e94f37', 'top', 210, 52)} />
      <div style={puzzleSlot('top')} />
      <Handle
        id="table-target"
        type="target"
        position={Position.Top}
        style={{
          background: '#f8f5ef',
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
        background: '#e94f37',
        borderRadius: 36,
        padding: '18px 22px 28px',
        color: '#fff',
        minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxShadow: '0 28px 55px rgba(233, 79, 55, 0.45)',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <div style={baseHighlight} />
        <div
          style={{
            width: 60,
            height: 16,
            background: '#fff',
            borderRadius: 999,
            opacity: 0.6,
            margin: '0 auto',
          }}
        />
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1.2 }}>
          Source
        </div>
        <div style={{ fontSize: 12, textTransform: 'uppercase', opacity: 0.75 }}>
          Choose the base table
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 14,
            padding: '6px 10px',
            border: '1px solid rgba(255,255,255,0.35)',
          }}
        >
          <select
            value={data.tableName}
            onChange={(event) => handleChange(event.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              color: '#fff',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              outline: 'none',
            }}
          >
            <option value="">Select a table</option>
            {tableOptions.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={puzzleConnector('#e94f37', 'bottom', 210, 52)} />
      <div style={puzzleSlot('bottom')} />
      <Handle
        id="table-source"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#e94f37',
          borderRadius: 4,
          width: 28,
          height: 10,
          bottom: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
        }}
      />
    </div>
  );
}
