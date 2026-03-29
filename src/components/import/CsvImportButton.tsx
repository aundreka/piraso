import { useRef, type ChangeEvent } from 'react';

type CsvImportButtonProps = {
  onFile: (file: File) => void;
  disabled?: boolean;
};

export default function CsvImportButton({
  onFile,
  disabled = false,
}: CsvImportButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    onFile(file);
    event.target.value = '';
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          background: disabled ? '#f0f0f0' : '#ffffff',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        Import CSV
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
}
