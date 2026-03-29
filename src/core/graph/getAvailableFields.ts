import type { Node } from '@xyflow/react';
import type { DatabaseSchema } from '../../types/schema';

export type FieldOption = {
  table: string;
  column: string;
  value: string;
  label: string;
};

export type AvailableFieldsResult = {
  fieldOptions: FieldOption[];
  columnsByTable: Record<string, FieldOption[]>;
};

export function getAvailableFields(
  schema: DatabaseSchema | null,
  nodes: Node[]
): AvailableFieldsResult {
  const activeTables = new Set<string>();

  for (const node of nodes) {
    if (node.type === 'tableNode') {
      const tableName = node.data?.tableName;
      if (typeof tableName === 'string' && tableName.trim()) {
        activeTables.add(tableName.trim());
      }
    }

    if (node.type === 'joinNode') {
      const tableName = node.data?.tableName;
      if (typeof tableName === 'string' && tableName.trim()) {
        activeTables.add(tableName.trim());
      }
    }
  }

  const fieldOptions: FieldOption[] = [];
  const columnsByTable: Record<string, FieldOption[]> = {};

  if (!schema) {
    for (const tableName of activeTables) {
      columnsByTable[tableName] = [];
    }

    return { fieldOptions, columnsByTable };
  }

  for (const table of schema.tables) {
    if (!activeTables.has(table.name)) {
      continue;
    }

    const options = table.columns.map((column) => {
      const value = `${table.name}.${column}`;
      return {
        table: table.name,
        column,
        value,
        label: value,
      };
    });

    columnsByTable[table.name] = options;
    fieldOptions.push(...options);
  }

  for (const tableName of activeTables) {
    if (!columnsByTable[tableName]) {
      columnsByTable[tableName] = [];
    }
  }

  return {
    fieldOptions,
    columnsByTable,
  };
}
