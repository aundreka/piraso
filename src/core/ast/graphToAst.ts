import type { Node } from '@xyflow/react';
import type { QueryAst } from './queryTypes';

export type SlotResolver = (parentId: string, slotId: string) => Node[];

export function graphToAst(nodes: Node[], getChildrenForSlot?: SlotResolver): QueryAst {
  const defaultResolver: SlotResolver = (parentId, slotId) =>
    nodes.filter(
      (node) =>
        node.parentId === parentId &&
        typeof node.data?.slotId === 'string' &&
        node.data.slotId === slotId
    );

  const resolver = getChildrenForSlot ?? defaultResolver;
  const ast: QueryAst = {
    from: undefined,
    select: [],
    where: [],
    joins: [],
    aggregates: [],
  };

  const root = nodes.find((node) => node.type === 'queryNode');

  if (!root) {
    return ast;
  }

  const childrenForSlot = (slotId: string) => resolver(root.id, slotId);

  for (const child of childrenForSlot('source')) {
    if (child.type === 'tableNode') {
      const tableName = child.data?.tableName;
      if (typeof tableName === 'string' && tableName.trim()) {
        ast.from = tableName.trim();
      }
    }

    if (child.type === 'joinNode') {
      const joinType = child.data?.joinType;
      const tableName = child.data?.tableName;
      const leftField = child.data?.leftField;
      const rightField = child.data?.rightField;

      if (
        typeof joinType === 'string' &&
        typeof tableName === 'string' &&
        typeof leftField === 'string' &&
        typeof rightField === 'string' &&
        tableName.trim() &&
        leftField.trim() &&
        rightField.trim()
      ) {
        ast.joins.push({
          type: joinType as QueryAst['joins'][number]['type'],
          table: tableName.trim(),
          leftField: leftField.trim(),
          rightField: rightField.trim(),
        });
      }
    }
  }

  for (const child of childrenForSlot('select')) {
    if (child.type === 'selectNode') {
      const columns = child.data?.columns;
      if (Array.isArray(columns)) {
        for (const column of columns) {
          if (typeof column === 'string' && column.trim()) {
            ast.select.push({ column: column.trim() });
          }
        }
      }
    }

    if (child.type === 'aggregateNode') {
      const func = child.data?.func;
      const field = child.data?.field;
      const alias = child.data?.alias;

      if (typeof func === 'string' && typeof field === 'string' && func.trim() && field.trim()) {
        ast.aggregates.push({
          func: func as QueryAst['aggregates'][number]['func'],
          field: field.trim(),
          alias: typeof alias === 'string' ? alias.trim() : undefined,
        });
      }
    }
  }

  for (const child of childrenForSlot('where')) {
    if (child.type === 'whereNode') {
      const field = child.data?.field;
      const operator = child.data?.operator;
      const value = child.data?.value;

      if (
        typeof field === 'string' &&
        typeof operator === 'string' &&
        typeof value === 'string' &&
        field.trim() &&
        operator.trim()
      ) {
        ast.where.push({
          field: field.trim(),
          operator: operator as QueryAst['where'][number]['operator'],
          value: value.trim(),
        });
      }
    }
  }

  return ast;
}
