import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';

let SQL: SqlJsStatic | null = null;

export async function getSqlJs(): Promise<SqlJsStatic> {
  if (SQL) {
    return SQL;
  }

  SQL = await initSqlJs({
    locateFile: () => '/sql-wasm.wasm',
  });

  return SQL;
}

export async function createEmptyDatabase(): Promise<Database> {
  const sql = await getSqlJs();
  return new sql.Database();
}

export async function createDatabaseFromBytes(
  bytes: Uint8Array
): Promise<Database> {
  const sql = await getSqlJs();
  return new sql.Database(bytes);
}
