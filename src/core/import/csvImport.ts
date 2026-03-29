import type { Database } from 'sql.js';

type ImportCsvParams = {
  db: Database;
  file: File;
  existingTables: string[];
};

const sanitizeIdentifier = (value: string, fallback: string) => {
  const cleaned = value
    .trim()
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (!cleaned) {
    return fallback;
  }

  if (/^\d/.test(cleaned)) {
    return `_${cleaned}`;
  }

  return cleaned;
};

const makeUnique = (base: string, existing: Set<string>) => {
  let candidate = base;
  let counter = 1;

  while (existing.has(candidate.toLowerCase())) {
    candidate = `${base}_${counter}`;
    counter += 1;
  }

  existing.add(candidate.toLowerCase());
  return candidate;
};

const parseCsv = (input: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let cursor = 0; cursor < input.length; cursor += 1) {
    const char = input[cursor];

    if (char === '"') {
      if (inQuotes && input[cursor + 1] === '"') {
        currentField += '"';
        cursor += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && char === ',') {
      currentRow.push(currentField);
      currentField = '';
      continue;
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && input[cursor + 1] === '\n') {
        cursor += 1;
      }

      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = '';
      continue;
    }

    currentField += char;
  }

  if (currentField.length || currentRow.length) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
};

export async function importCsvFile(params: ImportCsvParams) {
  const csvText = await params.file.text();
  const parsed = parseCsv(csvText).filter(
    (row) => row.length > 0 && row.some((cell) => cell.trim().length > 0)
  );

  if (parsed.length === 0) {
    throw new Error('CSV file is empty or formatted incorrectly.');
  }

  const headers = parsed[0];
  if (headers.every((header) => header.trim() === '')) {
    throw new Error('CSV file is missing headers.');
  }

  const dataRows = parsed.slice(1);

  const sanitizedColumns: string[] = [];
  const seenColumns = new Set<string>();

  headers.forEach((header, index) => {
    const fallback = `column_${index + 1}`;
    const candidate = sanitizeIdentifier(header || fallback, fallback);
    sanitizedColumns.push(makeUnique(candidate, seenColumns));
  });

  const baseTableName = sanitizeIdentifier(
    params.file.name.replace(/\.[^/.]+$/, ''),
    'imported_table'
  );
  const normalizedExisting = new Set(
    params.existingTables.map((table) => table.toLowerCase())
  );

  const tableName = makeUnique(baseTableName, normalizedExisting);

  const quotedColumns = sanitizedColumns
    .map((column) => `"${column.replace(/"/g, '""')}"`)
    .join(', ');
  const columnPlaceholders = sanitizedColumns
    .map(() => '?')
    .join(', ');

  params.db.run(
    `CREATE TABLE "${tableName.replace(/"/g, '""')}" (${quotedColumns});`
  );

  if (dataRows.length === 0) {
    return {
      tableName,
      columns: sanitizedColumns,
    };
  }

  const insertSql = `INSERT INTO "${tableName.replace(/"/g, '""')}" (${quotedColumns}) VALUES (${columnPlaceholders});`;
  const stmt = params.db.prepare(insertSql);

  try {
    for (const row of dataRows) {
      const values = sanitizedColumns.map((_, index) => {
        const value = row[index];
        return value ?? '';
      });
      stmt.run(values);
    }
  } finally {
    stmt.free();
  }

  return {
    tableName,
    columns: sanitizedColumns,
  };
}
