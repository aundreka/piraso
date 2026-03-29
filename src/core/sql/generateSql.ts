import type { QueryAst } from '../ast/queryTypes';

const escapeValue = (value: string) => value.replace(/'/g, "''");

const buildWhereClause = (clauses: QueryAst['where']) => {
  if (clauses.length === 0) {
    return undefined;
  }

  const expressions = clauses.map(({ field, operator, value }) => {
    const trimmedValue = value.trim();
    const needsQuotes =
      trimmedValue === '' || Number.isNaN(Number(trimmedValue));
    const formattedValue = needsQuotes
      ? `'${escapeValue(trimmedValue)}'`
      : trimmedValue;
    return `${field} ${operator} ${formattedValue}`;
  });

  return `WHERE ${expressions.join(' AND ')}`;
};

const buildSelectExpressions = (ast: QueryAst) => {
  const expressions: string[] = [];

  for (const column of ast.select) {
    expressions.push(column.column);
  }

  for (const aggregate of ast.aggregates) {
    const base = `${aggregate.func}(${aggregate.field})`;
    expressions.push(
      aggregate.alias && aggregate.alias.trim()
        ? `${base} AS ${aggregate.alias.trim()}`
        : base
    );
  }

  if (expressions.length === 0) {
    expressions.push('*');
  }

  return expressions;
};

const buildJoinClauses = (joins: QueryAst['joins']) => {
  if (joins.length === 0) {
    return [];
  }

  return joins.map((join) => {
    const type = join.type.toUpperCase();
    return `${type} JOIN ${join.table} ON ${join.leftField} = ${join.rightField}`;
  });
};

export function generateSql(ast: QueryAst): string {
  const selectExpressions = buildSelectExpressions(ast);
  const fragments = [`SELECT ${selectExpressions.join(', ')}`];

  if (ast.from) {
    fragments.push(`FROM ${ast.from}`);
  }

  fragments.push(...buildJoinClauses(ast.joins));

  const whereClause = buildWhereClause(ast.where);
  if (whereClause) {
    fragments.push(whereClause);
  }

  if (fragments.length === 1) {
    return fragments[0];
  }

  return fragments.join(' ');
}
