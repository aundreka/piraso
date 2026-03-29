import type { Database, QueryExecResult } from 'sql.js';

export type QueryRows = Record<string, unknown>[];

export type QueryResult =
  | {
      ok: true;
      columns: string[];
      rows: QueryRows;
    }
  | {
      ok: false;
      error: string;
    };

export function runQuery(db: Database, sql: string): QueryResult {
  try {
    const results: QueryExecResult[] = db.exec(sql);

    if (results.length === 0) {
      return {
        ok: true,
        columns: [],
        rows: [],
      };
    }

    const first = results[0];
    const columns = first.columns;
    const rows = first.values.map((row) => {
      const obj: Record<string, unknown> = {};

      columns.forEach((col, index) => {
        obj[col] = row[index];
      });

      return obj;
    });

    return {
      ok: true,
      columns,
      rows,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown SQL error',
    };
  }
}