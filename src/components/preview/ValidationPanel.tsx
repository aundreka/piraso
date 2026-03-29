import type { ValidationIssue } from '../../types/validation';

type ValidationPanelProps = {
  issues: ValidationIssue[];
};

const levelStyles: Record<'error' | 'warning', { label: string; color: string }> = {
  error: { label: 'Error', color: '#c1272d' },
  warning: { label: 'Warning', color: '#e08f2d' },
};

export default function ValidationPanel({ issues }: ValidationPanelProps) {
  if (issues.length === 0) {
    return null;
  }

  const sortedIssues = [...issues].sort((a, b) => {
    if (a.level === b.level) {
      return 0;
    }
    return a.level === 'error' ? -1 : 1;
  });

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 12,
        background: '#fffefa',
        marginTop: 16,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
        Validation
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sortedIssues.map((issue) => {
          const style = levelStyles[issue.level];
          return (
            <li
              key={issue.id}
              style={{
                borderTop: '1px solid #eee',
                paddingTop: 8,
                marginTop: 8,
                display: 'flex',
                gap: 8,
              }}
            >
              <span
                style={{
                  color: style.color,
                  fontWeight: 700,
                  fontSize: 12,
                  textTransform: 'uppercase',
                }}
              >
                {style.label}
              </span>
              <span style={{ fontSize: 13 }}>{issue.message}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
