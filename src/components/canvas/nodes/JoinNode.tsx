import { Handle, Position } from '@xyflow/react';
import type { FlowNodeDataMap } from '../../../types/flow';
import { useFlowMetadata } from '../FlowMetadataContext';
import { baseHighlight, puzzleConnector, puzzleSlot } from './puzzleStyles';

type JoinNodeProps = {
  id: string;
  data: FlowNodeDataMap['joinNode'];
};

const JOIN_TYPES: JoinNodeProps['data']['joinType'][] = ['INNER', 'LEFT', 'RIGHT'];

export default function JoinNode({ id, data }: JoinNodeProps) {
  const { tableOptions, fieldOptions } = useFlowMetadata();
  const handleChange = (updates: Record<string, unknown>) => {
    data.onChange(id, updates);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: 240,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'visible',
      }}
    >
      <div style={puzzleConnector('#f9cc4f', 'top', 220, 48)} />
      <div style={puzzleSlot('top')} />
      <Handle
        id="join-target"
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
          background: '#f9cc4f',
          borderRadius: 32,
          padding: '18px 22px 24px',
          minHeight: 250,
          boxShadow: '0 28px 52px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <div style={baseHighlight} />
        <div style={{ fontWeight: 700, fontSize: 15 }}>Join</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Connect another table
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={data.joinType}
            onChange={(event) => handleChange({ joinType: event.target.value })}
            style={{ flex: 1, borderRadius: 12, padding: '6px 10px', fontWeight: 600 }}
          >
            {JOIN_TYPES.map((joinType) => (
              <option key={joinType} value={joinType}>
                {joinType}
              </option>
            ))}
          </select>
          <select
            value={data.tableName}
            onChange={(event) => handleChange({ tableName: event.target.value })}
            style={{ flex: 1, borderRadius: 12, padding: '6px 10px', fontWeight: 600 }}
          >
            <option value="">Table</option>
            {tableOptions.map((tableName) => (
              <option key={tableName} value={tableName}>
                {tableName}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={data.leftField}
            onChange={(event) => handleChange({ leftField: event.target.value })}
            style={{ flex: 1, borderRadius: 12, padding: '6px 10px', fontWeight: 600 }}
          >
            <option value="">Left field</option>
            {fieldOptions.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
          <select
            value={data.rightField}
            onChange={(event) => handleChange({ rightField: event.target.value })}
            style={{ flex: 1, borderRadius: 12, padding: '6px 10px', fontWeight: 600 }}
          >
            <option value="">Right field</option>
            {fieldOptions.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={puzzleConnector('#f9cc4f', 'bottom', 220, 48)} />
      <div style={puzzleSlot('bottom')} />
      <Handle
        id="join-source"
        type="source"
        position={Position.Bottom}
        style={{
          background: '#f9cc4f',
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
