import { openDB } from 'idb';

const DB_NAME = 'visual-sql-builder';
const STORE_NAME = 'app-state';
const KEY = 'sqlite-db';

async function getStorageDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveDatabaseBytes(bytes: Uint8Array): Promise<void> {
  const db = await getStorageDb();
  await db.put(STORE_NAME, bytes, KEY);
}

export async function loadDatabaseBytes(): Promise<Uint8Array | null> {
  const db = await getStorageDb();
  const value = await db.get(STORE_NAME, KEY);

  if (!value) {
    return null;
  }

  return value as Uint8Array;
}