import ResultTable from './ResultTable';
import ValidationPanel from './ValidationPanel';
import CsvImportButton from '../import/CsvImportButton';
import type { ValidationIssue } from '../../types/validation';

type QueryPanelProps = {
  sql: string;
  onRun: () => void;
  isReady: boolean;
  result:
    | {
        ok: true;
        columns: string[];
        rows: Record<string, unknown>[];
      }
    | {
        ok: false;
        error: string;
      }
    | null;
  validationIssues: ValidationIssue[];
  onCsvImport: (file: File) => void;
};

export default function QueryPanel({
  sql,
  onRun,
  isReady,
  result,
  validationIssues,
  onCsvImport,
}: QueryPanelProps) {
  return (
    <div
      style={{
        width: 420,
        height: '100vh',
        borderLeft: '1px solid #ddd',
        background: '#fafafa',
        padding: 16,
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18 }}>SQL Preview</div>
        <CsvImportButton onFile={onCsvImport} disabled={!isReady} />
      </div>

      <pre
        style={{
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: 14,
          lineHeight: 1.5,
          background: 'white',
          padding: 12,
          borderRadius: 8,
          border: '1px solid #ddd',
          marginBottom: 12,
        }}
      >
        {sql}
      </pre>

      <button
        onClick={onRun}
        disabled={!isReady}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid #ccc',
          background: isReady ? 'white' : '#f0f0f0',
          cursor: isReady ? 'pointer' : 'not-allowed',
          marginBottom: 16,
        }}
      >
        Run Query
      </button>

      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
        Results
      </div>

      {!result ? (
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 12,
            background: 'white',
          }}
        >
          Run the query to see results.
        </div>
      ) : result.ok ? (
        <ResultTable columns={result.columns} rows={result.rows} />
      ) : (
        <div
          style={{
            border: '1px solid #f0c2c2',
            background: '#fff5f5',
            color: '#a33',
            borderRadius: 8,
            padding: 12,
          }}
        >
          {result.error}
        </div>
      )}
      <ValidationPanel issues={validationIssues} />
    </div>
  );
}
