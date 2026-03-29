import type { Database } from 'sql.js';
import type { DatabaseSchema, TableSchema } from '../../types/schema';

const quoteIdentifier = (value: string) =>
  `"${value.replace(/"/g, '""')}"`;

export async function getDatabaseSchema(db: Database): Promise<DatabaseSchema> {
  const schemaTables: TableSchema[] = [];

  const tableResults = db.exec(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%';"
  );

  const tableNames =
    tableResults?.[0]?.values
      ?.map((row) => row[0])
      .filter(
        (tableName): tableName is string =>
          typeof tableName === 'string' && tableName.trim().length > 0
      ) ?? [];

  for (const tableName of tableNames) {
    const pragmaResults = db.exec(
      `PRAGMA table_info(${quoteIdentifier(tableName)});`
    );

    const columns =
      pragmaResults?.[0]?.values
        ?.map((columnRow) => columnRow[1])
        .filter(
          (columnName): columnName is string =>
            typeof columnName === 'string' && columnName.trim().length > 0
        ) ?? [];

    schemaTables.push({
      name: tableName,
      columns,
    });
  }

  return {
    tables: schemaTables,
  };
}
