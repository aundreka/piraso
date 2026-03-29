export type FlowNodeType =
  | 'queryNode'
  | 'tableNode'
  | 'joinNode'
  | 'selectNode'
  | 'whereNode'
  | 'conditionNode'
  | 'valueNode'
  | 'columnNode'
  | 'aggregateNode'
  | 'groupByNode'
  | 'orderByNode'
  | 'limitNode';

export interface QueryNodeData {
  title?: string;
  selectClause?: string;
  fromClause?: string;
  alias?: string;
}

export interface TableNodeData {
  tableName: string;
}

export interface JoinNodeData {
  joinType: 'INNER' | 'LEFT' | 'RIGHT';
  tableName: string;
  leftField: string;
  rightField: string;
}

export interface SelectNodeData {
  columns: string[];
}

export interface WhereNodeData {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE';
  value: string;
}

export interface ConditionNodeData {
  operator: string;
}

export interface ValueNodeData {
  value: string;
}

export interface ColumnNodeData {
  table?: string;
  column?: string;
}

export interface AggregateNodeData {
  func: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
  field: string;
  alias?: string;
}

export interface GroupByNodeData {
  label?: string;
}

export interface OrderByNodeData {
  direction: 'ASC' | 'DESC';
  field?: string;
}

export interface LimitNodeData {
  value: string;
}

export type FlowNodeBaseDataMap = {
  queryNode: QueryNodeData;
  tableNode: TableNodeData;
  joinNode: JoinNodeData;
  selectNode: SelectNodeData;
  whereNode: WhereNodeData;
  conditionNode: ConditionNodeData;
  valueNode: ValueNodeData;
  columnNode: ColumnNodeData;
  aggregateNode: AggregateNodeData;
  groupByNode: GroupByNodeData;
  orderByNode: OrderByNodeData;
  limitNode: LimitNodeData;
};

export type NodeDataChangeHandler = (id: string, updates: Record<string, unknown>) => void;

export type FlowNodeDataMap = {
  [K in FlowNodeType]: FlowNodeBaseDataMap[K] & Record<string, unknown> & {
    slotId?: string;
    onChange: NodeDataChangeHandler;
  };
};

export const flowNodeDimensions: Record<FlowNodeType, { width: number; height: number }> =
  {
    queryNode: { width: 360, height: 620 },
    tableNode: { width: 220, height: 100 },
    joinNode: { width: 240, height: 140 },
    selectNode: { width: 240, height: 160 },
    whereNode: { width: 240, height: 180 },
    conditionNode: { width: 220, height: 80 },
    valueNode: { width: 180, height: 60 },
    columnNode: { width: 200, height: 60 },
    aggregateNode: { width: 210, height: 80 },
    groupByNode: { width: 200, height: 90 },
    orderByNode: { width: 220, height: 100 },
    limitNode: { width: 180, height: 70 },
  };
