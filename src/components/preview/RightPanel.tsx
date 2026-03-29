import { useMemo, useState } from 'react';
import ResultTable from './ResultTable';
import type { QueryResult } from '../../core/db/runQuery';

const tabs = [
  { id: 'table', label: 'Table' },
  { id: 'sql', label: 'SQL' },
] as const;

const highlightTiles = [
  { label: 'Sales', color: '#e94f37' },
  { label: 'Sales + Inventory', color: '#d14218' },
  { label: 'Forecast Demand', color: '#0b3c82' },
];

type RightPanelProps = {
  sql: string;
  result: QueryResult | null;
  isExecuting: boolean;
};

export default function RightPanel({ sql, result, isExecuting }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('table');

  const body = useMemo(() => {
    if (activeTab === 'sql') {
      return (
        <pre
          style={{
            margin: 0,
            fontFamily: 'monospace',
            fontSize: 13,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            color: '#1f2b3a',
          }}
        >
          {sql || 'Build your query to reveal the SQL.'}
        </pre>
      );
    }

    if (isExecuting) {
      return (
        <div style={{ fontWeight: 600, color: '#0b3c82' }}>Executing query...</div>
      );
    }

    if (!result) {
      return <div style={{ color: '#6b7280' }}>Execute a query to preview the table output.</div>;
    }

    if (!result.ok) {
      return (
        <div
          style={{
            borderRadius: 14,
            border: '1px solid #f3b5b5',
            background: '#fff5f5',
            padding: 12,
            color: '#c63f3f',
          }}
        >
          {result.error}
        </div>
      );
    }

    return <ResultTable columns={result.columns} rows={result.rows} />;
  }, [activeTab, isExecuting, result, sql]);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 10 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              borderRadius: 999,
              border: 'none',
              padding: '10px 14px',
              fontWeight: 700,
              fontSize: 14,
              background: activeTab === tab.id ? '#111' : '#f2f2f2',
              color: activeTab === tab.id ? '#fff' : '#4a4a4a',
              boxShadow: activeTab === tab.id ? '0 12px 20px rgba(0,0,0,0.15)' : 'none',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          borderRadius: 20,
          border: '1px solid rgba(0,0,0,0.08)',
          background: '#fff',
          padding: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          overflow: 'auto',
        }}
      >
        {body}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 10,
        }}
      >
        {highlightTiles.slice(0, 2).map((tile) => (
          <div
            key={tile.label}
            style={{
              borderRadius: 14,
              padding: '10px 14px',
              color: '#fff',
              fontWeight: 700,
              background: tile.color,
              boxShadow: '0 14px 30px rgba(0,0,0,0.15)',
            }}
          >
            {tile.label}
          </div>
        ))}
      </div>
      <div
        style={{
          borderRadius: 16,
          padding: '12px 16px',
          color: '#fff',
          fontWeight: 700,
          background: highlightTiles[2].color,
          boxShadow: '0 16px 30px rgba(0,0,0,0.15)',
        }}
      >
        {highlightTiles[2].label}
      </div>
    </div>
  );
}
