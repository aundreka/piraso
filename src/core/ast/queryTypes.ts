export type AggregateFunction = 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';

export interface SelectedColumn {
  column: string;
}

export interface WhereClause {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE';
  value: string;
}

export interface JoinClause {
  type: 'INNER' | 'LEFT' | 'RIGHT';
  table: string;
  leftField: string;
  rightField: string;
}

export interface AggregateClause {
  func: AggregateFunction;
  field: string;
  alias?: string;
}

export interface QueryAst {
  from?: string;
  select: SelectedColumn[];
  where: WhereClause[];
  joins: JoinClause[];
  aggregates: AggregateClause[];
}