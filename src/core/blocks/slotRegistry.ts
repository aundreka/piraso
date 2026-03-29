import type { FlowNodeType } from '../../types/flow';

export type SlotBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SlotDefinition = {
  id: string;
  label: string;
  allowed: FlowNodeType[];
  bounds: SlotBounds;
  stackSpacing?: number;
  single?: boolean;
};

export type SlotRegistry = Record<FlowNodeType, SlotDefinition[]>;

export const slotRegistry: SlotRegistry = {
  queryNode: [
    {
      id: 'source',
      label: 'Source',
      allowed: ['tableNode', 'joinNode'],
      bounds: { x: 24, y: 40, width: 312, height: 110 },
      stackSpacing: 120,
    },
    {
      id: 'select',
      label: 'Select',
      allowed: ['selectNode'],
      bounds: { x: 24, y: 170, width: 312, height: 90 },
      stackSpacing: 130,
    },
    {
      id: 'where',
      label: 'Where',
      allowed: ['whereNode'],
      bounds: { x: 24, y: 280, width: 312, height: 100 },
      single: true,
    },
    {
      id: 'groupBy',
      label: 'Group By',
      allowed: ['groupByNode'],
      bounds: { x: 24, y: 390, width: 312, height: 90 },
      stackSpacing: 90,
    },
    {
      id: 'orderBy',
      label: 'Order By',
      allowed: ['orderByNode'],
      bounds: { x: 24, y: 500, width: 312, height: 90 },
      stackSpacing: 90,
    },
    {
      id: 'limit',
      label: 'Limit',
      allowed: ['limitNode'],
      bounds: { x: 24, y: 610, width: 312, height: 70 },
      single: true,
    },
  ],
  selectNode: [
    {
      id: 'projection',
      label: 'Projection',
      allowed: ['columnNode', 'aggregateNode'],
      bounds: { x: 18, y: 70, width: 204, height: 90 },
      stackSpacing: 70,
    },
  ],
  whereNode: [
    {
      id: 'condition',
      label: 'Condition',
      allowed: ['conditionNode'],
      bounds: { x: 18, y: 70, width: 204, height: 90 },
    },
  ],
  conditionNode: [
    {
      id: 'left',
      label: 'Left',
      allowed: ['columnNode', 'valueNode', 'aggregateNode'],
      bounds: { x: 10, y: 18, width: 70, height: 44 },
      single: true,
    },
    {
      id: 'right',
      label: 'Right',
      allowed: ['columnNode', 'valueNode', 'aggregateNode'],
      bounds: { x: 130, y: 18, width: 70, height: 44 },
      single: true,
    },
  ],
  joinNode: [
    {
      id: 'condition',
      label: 'Join Condition',
      allowed: ['conditionNode'],
      bounds: { x: 18, y: 90, width: 204, height: 80 },
      single: true,
    },
  ],
  groupByNode: [
    {
      id: 'field',
      label: 'Group Field',
      allowed: ['columnNode'],
      bounds: { x: 14, y: 48, width: 172, height: 50 },
      single: true,
    },
  ],
  orderByNode: [
    {
      id: 'field',
      label: 'Order Field',
      allowed: ['columnNode'],
      bounds: { x: 14, y: 48, width: 172, height: 50 },
      single: true,
    },
  ],
  limitNode: [
    {
      id: 'value',
      label: 'Limit Value',
      allowed: ['valueNode'],
      bounds: { x: 14, y: 38, width: 172, height: 40 },
      single: true,
    },
  ],
  tableNode: [],
  valueNode: [],
  columnNode: [],
  aggregateNode: [],
};
