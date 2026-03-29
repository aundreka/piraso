type SqlPreviewProps = {
  sql: string;
};

export default function SqlPreview({ sql }: SqlPreviewProps) {
  return (
    <div
      style={{
        width: 360,
        height: '100vh',
        borderLeft: '1px solid #ddd',
        background: '#fafafa',
        padding: 16,
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
        SQL Preview
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
        }}
      >
        {sql}
      </pre>
    </div>
  );
}