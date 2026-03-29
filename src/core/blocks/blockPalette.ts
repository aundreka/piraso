import type { FlowNodeType } from '../../types/flow';
import type { BlockShape } from '../../types/blockShapes';

export type BlockPaletteEntry = {
  nodeType: FlowNodeType;
  title: string;
  subtitle: string;
  accentColor: string;
  shape: BlockShape;
  payload?: Record<string, unknown>;
};

export const PALETTE_TABS = [
  { id: 'query', label: 'Query' },
  { id: 'source', label: 'Source' },
  { id: 'logic', label: 'Filter & Logic' },
  { id: 'operators', label: 'Operators & Values' },
  { id: 'projection', label: 'Projection' },
  { id: 'grouping', label: 'Grouping & Sorting' },
] as const;

export const BLOCK_PALETTE: Record<
  typeof PALETTE_TABS[number]['id'],
  BlockPaletteEntry[]
> = {
  query: [
    {
      nodeType: 'queryNode',
      title: 'Query',
      subtitle: 'Root container for the SQL tree',
      accentColor: '#0b3c82',
      shape: 'cblock',
    },
  ],
  source: [
    {
      nodeType: 'tableNode',
      title: 'Table',
      subtitle: 'Choose a base data source',
      accentColor: '#e94f37',
      shape: 'stack',
      payload: { tableName: '' },
    },
    {
      nodeType: 'joinNode',
      title: 'Join',
      subtitle: 'Connect an additional table',
      accentColor: '#d14218',
      shape: 'stack',
      payload: { joinType: 'INNER', tableName: '', leftField: '', rightField: '' },
    },
  ],
  logic: [
    {
      nodeType: 'whereNode',
      title: 'Where',
      subtitle: 'Filters and logic slots',
      accentColor: '#facc4f',
      shape: 'cblock',
    },
    {
      nodeType: 'conditionNode',
      title: 'Condition',
      subtitle: 'Boolean comparison container',
      accentColor: '#16a34a',
      shape: 'hexagon',
      payload: { operator: '=' },
    },
  ],
  operators: [
    {
      nodeType: 'columnNode',
      title: 'Column',
      subtitle: 'Reference a schema field',
      accentColor: '#0f5a44',
      shape: 'oval',
    },
    {
      nodeType: 'valueNode',
      title: 'Value',
      subtitle: 'Literal or constant',
      accentColor: '#16a34a',
      shape: 'oval',
      payload: { value: '' },
    },
    {
      nodeType: 'aggregateNode',
      title: 'Aggregate',
      subtitle: 'COUNT / SUM / AVG variants',
      accentColor: '#163d7d',
      shape: 'stack',
      payload: { func: 'COUNT', field: '' },
    },
  ],
  projection: [
    {
      nodeType: 'selectNode',
      title: 'Select',
      subtitle: 'Pick the columns to return',
      accentColor: '#8b5cf6',
      shape: 'stack',
      payload: { columns: [] },
    },
  ],
  grouping: [
    {
      nodeType: 'groupByNode',
      title: 'Group By',
      subtitle: 'Bucket rows together',
      accentColor: '#f97316',
      shape: 'cblock',
    },
    {
      nodeType: 'orderByNode',
      title: 'Order By',
      subtitle: 'Set the row ordering',
      accentColor: '#d97706',
      shape: 'stack',
    },
    {
      nodeType: 'limitNode',
      title: 'Limit',
      subtitle: 'Control the result size',
      accentColor: '#ea580c',
      shape: 'stack',
      payload: { value: '10' },
    },
  ],
};
