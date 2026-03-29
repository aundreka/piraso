import type { Node } from '@xyflow/react';
import type { QueryAst } from '../ast/queryTypes';
import type { DatabaseSchema } from '../../types/schema';
import type { ValidationIssue } from '../../types/validation';

const makeIssueId = (prefix: string, nodeId?: string, context?: string) => {
  const trimmedContext = context ? context.replace(/\s+/g, '_') : 'general';
  return `${prefix}-${nodeId ?? 'global'}-${trimmedContext}`;
};

const parseFieldReference = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { table: '', column: '' };
  }

  const parts = trimmed.split('.');
  if (parts.length === 2) {
    return { table: parts[0], column: parts[1] };
  }

  return { table: '', column: trimmed };
};

type TableRecord = {
  name: string;
  columns: Set<string>;
};

const buildSchemaLookup = (schema: DatabaseSchema | null) => {
  const lookup = new Map<string, TableRecord>();
  if (!schema) {
    return lookup;
  }

  for (const table of schema.tables) {
    const key = table.name.toLowerCase();
    const normalized = table.columns.map((column) => column.toLowerCase());
    lookup.set(key, {
      name: table.name,
      columns: new Set(normalized),
    });
  }

  return lookup;
};

type ValidateContext = {
  lookup: Map<string, TableRecord>;
  defaultTable: string;
};

const isColumnPresent = (
  context: ValidateContext,
  reference: string
): { table: string; column: string; exists: boolean; tableExists: boolean } => {
  const { table, column } = parseFieldReference(reference);
  const targetTable = (table || context.defaultTable).trim();
  if (!targetTable || !column) {
    return { table: targetTable, column, exists: false, tableExists: false };
  }

  const record = context.lookup.get(targetTable.toLowerCase());
  if (!record) {
    return { table: targetTable, column, exists: false, tableExists: false };
  }

  return {
    table: record.name,
    column,
    exists: record.columns.has(column.toLowerCase()),
    tableExists: true,
  };
};

const getNodeField = (node: Node, key: string): string => {
  const data = node.data as Record<string, unknown> | undefined;
  const value = data?.[key];
  return typeof value === 'string' ? value : '';
};

const getNodeStringArray = (node: Node, key: string): string[] => {
  const data = node.data as Record<string, unknown> | undefined;
  const target = data?.[key];
  if (!Array.isArray(target)) {
    return [];
  }

  return target.filter((value): value is string => typeof value === 'string');
};

export function validateQuery({
  ast,
  schema,
  nodes,
}: {
  ast: QueryAst;
  schema: DatabaseSchema | null;
  nodes: Node[];
}): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const lookup = buildSchemaLookup(schema);
  const defaultTable = ast.from?.trim() ?? '';
  const hasSchema = Boolean(schema && schema.tables.length);

  const context: ValidateContext = {
    lookup,
    defaultTable,
  };

  const tableNode = nodes.find((node) => node.type === 'tableNode');
  const selectNodes = nodes.filter((node) => node.type === 'selectNode');
  const whereNodes = nodes.filter((node) => node.type === 'whereNode');
  const joinNodes = nodes.filter((node) => node.type === 'joinNode');
  const aggregateNodes = nodes.filter((node) => node.type === 'aggregateNode');

  if (!defaultTable) {
    issues.push({
      id: makeIssueId('missing-table', tableNode?.id),
      level: 'error',
      message: 'A FROM table is required before running the query.',
      nodeId: tableNode?.id,
    });
  } else if (hasSchema && !lookup.has(defaultTable.toLowerCase())) {
    issues.push({
      id: makeIssueId('unknown-table', tableNode?.id, defaultTable),
      level: 'error',
      message: `Table "${defaultTable}" does not exist in the schema.`,
      nodeId: tableNode?.id,
    });
  }

  if (ast.select.length === 0 && ast.aggregates.length === 0 && defaultTable) {
    issues.push({
      id: makeIssueId('empty-select', selectNodes[0]?.id),
      level: 'warning',
      message: 'No columns or aggregates selected; the query will default to SELECT *.',
      nodeId: selectNodes[0]?.id,
    });
  }

  if (ast.aggregates.length > 0 && ast.select.length > 0) {
    issues.push({
      id: makeIssueId('aggregate-mix', aggregateNodes[0]?.id),
      level: 'warning',
      message:
        'Mixing aggregates with raw columns requires a GROUP BY; this query may fail in strict SQL modes.',
      nodeId: aggregateNodes[0]?.id,
    });
  }

  if (!hasSchema) {
    return issues;
  }

  for (const node of selectNodes) {
    const columns = getNodeStringArray(node, 'columns')
      .map((column) => column.trim())
      .filter(Boolean);

    for (const column of columns) {
      const presence = isColumnPresent(context, column);
      if (!presence.tableExists) {
        issues.push({
          id: makeIssueId('select-table-missing', node.id, column),
          level: 'error',
          message: `The selected table "${presence.table || column}" is not in the schema.`,
          nodeId: node.id,
        });
        continue;
      }

      if (!presence.exists) {
        issues.push({
          id: makeIssueId('select-column-missing', node.id, column),
          level: 'warning',
          message: `Column "${column}" could not be found in table "${presence.table}".`,
          nodeId: node.id,
        });
      }
    }
  }

  for (const node of whereNodes) {
    const field = getNodeField(node, 'field').trim();
    if (!field) {
      continue;
    }

    const presence = isColumnPresent(context, field);
    if (!presence.tableExists) {
      issues.push({
        id: makeIssueId('where-table-missing', node.id, field),
        level: 'error',
        message: `The referenced table "${presence.table || field}" is not in the schema.`,
        nodeId: node.id,
      });
      continue;
    }

    if (!presence.exists) {
      issues.push({
        id: makeIssueId('where-column-missing', node.id, field),
        level: 'warning',
        message: `Column "${field}" does not exist on table "${presence.table}".`,
        nodeId: node.id,
      });
    }
  }

  for (const node of joinNodes) {
    const tableName = getNodeField(node, 'tableName').trim();
    const leftField = getNodeField(node, 'leftField').trim();
    const rightField = getNodeField(node, 'rightField').trim();

    if (!tableName) {
      issues.push({
        id: makeIssueId('join-table-missing', node.id),
        level: 'error',
        message: 'Join nodes must reference a target table.',
        nodeId: node.id,
      });
      continue;
    }

    if (!leftField || !rightField) {
      issues.push({
        id: makeIssueId('join-fields-incomplete', node.id),
        level: 'error',
        message: 'Both sides of the join must reference a column.',
        nodeId: node.id,
      });
      continue;
    }

    const leftPresence = isColumnPresent(context, leftField);
    if (!leftPresence.tableExists) {
      issues.push({
        id: makeIssueId('join-left-table-missing', node.id, leftField),
        level: 'error',
        message: `Join left table "${leftPresence.table || leftField}" is not available in the schema.`,
        nodeId: node.id,
      });
    } else if (!leftPresence.exists) {
      issues.push({
        id: makeIssueId('join-left-column-missing', node.id, leftField),
        level: 'warning',
        message: `Column "${leftField}" does not exist on table "${leftPresence.table}".`,
        nodeId: node.id,
      });
    }

    const rightPresence = isColumnPresent(
      {
        lookup: context.lookup,
        defaultTable: tableName,
      },
      rightField
    );

    if (!rightPresence.tableExists) {
      issues.push({
        id: makeIssueId('join-right-table-missing', node.id, rightField),
        level: 'error',
        message: `Join table "${rightPresence.table || rightField}" is not available in the schema.`,
        nodeId: node.id,
      });
    } else if (!rightPresence.exists) {
      issues.push({
        id: makeIssueId('join-right-column-missing', node.id, rightField),
        level: 'warning',
        message: `Column "${rightField}" does not exist on table "${rightPresence.table}".`,
        nodeId: node.id,
      });
    }
  }

  for (const node of aggregateNodes) {
    const field = getNodeField(node, 'field').trim();
    if (!field) {
      issues.push({
        id: makeIssueId('aggregate-field-empty', node.id),
        level: 'warning',
        message: 'Aggregates should target a column.',
        nodeId: node.id,
      });
      continue;
    }

    const presence = isColumnPresent(context, field);
    if (!presence.tableExists) {
      issues.push({
        id: makeIssueId('aggregate-table-missing', node.id, field),
        level: 'error',
        message: `Aggregate refers to table "${presence.table || field}", which is not in the schema.`,
        nodeId: node.id,
      });
      continue;
    }

    if (!presence.exists) {
      issues.push({
        id: makeIssueId('aggregate-column-missing', node.id, field),
        level: 'warning',
        message: `Column "${field}" does not exist on table "${presence.table}".`,
        nodeId: node.id,
      });
    }
  }

  return issues;
}
