import { openDB } from 'idb';
import type { Edge, Node } from '@xyflow/react';

const GRAPH_DB_NAME = 'visual-sql-builder-graph';
const GRAPH_STORE_NAME = 'graph-state';
const GRAPH_KEY = 'nodes-edges';

async function openGraphDb() {
  return openDB(GRAPH_DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(GRAPH_STORE_NAME)) {
        db.createObjectStore(GRAPH_STORE_NAME);
      }
    },
  });
}

export type GraphState = {
  nodes: Node[];
  edges: Edge[];
};

export async function saveGraphState(state: GraphState): Promise<void> {
  const db = await openGraphDb();
  await db.put(GRAPH_STORE_NAME, state, GRAPH_KEY);
}

export async function loadGraphState(): Promise<GraphState | null> {
  const db = await openGraphDb();
  const stored = await db.get(GRAPH_STORE_NAME, GRAPH_KEY);
  return stored ?? null;
}
