type ResultTableProps = {
  columns: string[];
  rows: Record<string, unknown>[];
};

export default function ResultTable({ columns, rows }: ResultTableProps) {
  if (columns.length === 0) {
    return (
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 12,
          background: 'white',
        }}
      >
        No rows returned.
      </div>
    );
  }

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        overflow: 'auto',
        background: 'white',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 14,
        }}
      >
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderBottom: '1px solid #ddd',
                  background: '#f7f7f7',
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column}`}
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {String(row[column] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}