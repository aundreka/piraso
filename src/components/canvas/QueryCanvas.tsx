import { useCallback, useLayoutEffect, useEffect, useMemo, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { ReactFlow, Background, BackgroundVariant, Controls, useEdgesState, useNodesState } from '@xyflow/react';
import type { Edge, Node, ReactFlowInstance, XYPosition } from '@xyflow/react';
import AppLayout from '../../layout/AppLayout';
import LeftPanel from '../sidebar/LeftPanel';
import BottomPalette from '../sidebar/BottomPalette';
import RightPanel from '../preview/RightPanel';
import { FlowMetadataProvider, type FlowMetadata } from './FlowMetadataContext';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useSlotTracker, type SlotInstance } from '../../hooks/useSlotTracker';
import { getAvailableFields } from '../../core/graph/getAvailableFields';
import { graphToAst } from '../../core/ast/graphToAst';
import { generateSql } from '../../core/sql/generateSql';
import { createDemoDatabase } from '../../core/db/demoDatabase';
import { getDatabaseSchema } from '../../core/db/schema';
import { runQuery } from '../../core/db/runQuery';
import type { QueryResult } from '../../core/db/runQuery';
import type { Database } from 'sql.js';
import type { DatabaseSchema } from '../../types/schema';
import { flowNodeDimensions } from '../../types/flow';
import type { FlowNodeDataMap, FlowNodeType, NodeDataChangeHandler } from '../../types/flow';
import TableNode from './nodes/TableNode';
import SelectNode from './nodes/SelectNode';
import WhereNode from './nodes/WhereNode';
import JoinNode from './nodes/JoinNode';
import AggregateNode from './nodes/AggregateNode';
import QueryNode from './nodes/QueryNode';
import ConditionNode from './nodes/ConditionNode';
import ColumnNode from './nodes/ColumnNode';
import ValueNode from './nodes/ValueNode';
import GroupByNode from './nodes/GroupByNode';
import OrderByNode from './nodes/OrderByNode';
import LimitNode from './nodes/LimitNode';
import { slotRegistry } from '../../core/blocks/slotRegistry';

const nodeTypes = {
  queryNode: QueryNode,
  tableNode: TableNode,
  joinNode: JoinNode,
  selectNode: SelectNode,
  whereNode: WhereNode,
  aggregateNode: AggregateNode,
  conditionNode: ConditionNode,
  columnNode: ColumnNode,
  valueNode: ValueNode,
  groupByNode: GroupByNode,
  orderByNode: OrderByNode,
  limitNode: LimitNode,
};

type NodeDefaults = {
  [K in FlowNodeType]: Omit<FlowNodeDataMap[K], 'slotId' | 'onChange'>;
};

type FlowVisualNode = Node<FlowNodeDataMap[FlowNodeType]>;

const NODE_DEFAULTS: NodeDefaults = {
  queryNode: { title: 'Forecast Demand' },
  tableNode: { tableName: '' },
  joinNode: { joinType: 'INNER', tableName: '', leftField: '', rightField: '' },
  selectNode: { columns: [] },
  whereNode: { field: '', operator: '=', value: '' },
  conditionNode: { operator: '=' },
  valueNode: { value: '' },
  columnNode: { table: '', column: '' },
  aggregateNode: { func: 'COUNT', field: '', alias: '' },
  groupByNode: { label: '' },
  orderByNode: { direction: 'ASC', field: '' },
  limitNode: { value: '10' },
};

export default function QueryCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<FlowVisualNode, Edge> | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowVisualNode>([]);
  const [edges, , onEdgesChange] = useEdgesState<Edge>([]);
  const [database, setDatabase] = useState<Database | null>(null);
  const [schema, setSchema] = useState<DatabaseSchema | null>(null);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const { startDrag, endDrag } = useDragAndDrop();
  const { findSlot, isCompatible, getChildrenForSlot } = useSlotTracker(nodes);

  const handleNodeChange = useCallback<NodeDataChangeHandler>((id, updates) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...updates,
              },
            }
          : node
      )
    );
  }, [setNodes]);

  const createVisualNode = useCallback(
    (nodeType: FlowNodeType, position: XYPosition, parentId?: string, slotId?: string): FlowVisualNode => ({
      id: `${nodeType}-${Math.random().toString(36).slice(2, 9)}`,
      type: nodeType,
      position,
      parentId,
      data: {
        ...NODE_DEFAULTS[nodeType],
        slotId,
        onChange: handleNodeChange,
      } as FlowNodeDataMap[FlowNodeType],
    }),
    [handleNodeChange]
  );

  useLayoutEffect(() => {
    const hasQueryNode = nodes.some((node) => node.type === 'queryNode');
    if (hasQueryNode) {
      return;
    }

      setNodes((current) => {
        const next = [...current, createVisualNode('queryNode', { x: 260, y: 120 })];
        console.log('initializing query node, nodes after insert', next.length);
        return next;
      });
  }, [createVisualNode, nodes, setNodes]);

  const availableFields = useMemo(() => getAvailableFields(schema, nodes), [schema, nodes]);
  const tableOptions = useMemo(() => schema?.tables.map((table) => table.name) ?? [], [schema]);
  const metadata: FlowMetadata = useMemo(
    () => ({
      schema,
      tableOptions,
      fieldOptions: availableFields.fieldOptions,
      columnsByTable: availableFields.columnsByTable,
    }),
    [schema, tableOptions, availableFields]
  );

  const ast = useMemo(() => graphToAst(nodes, getChildrenForSlot), [nodes, getChildrenForSlot]);
  const sql = useMemo(() => generateSql(ast), [ast]);

  const isQueryReady = Boolean(ast.from && (ast.select.length > 0 || ast.aggregates.length > 0));

  useEffect(() => {
    let isMounted = true;
    let dbInstance: Database | null = null;

    (async () => {
      const db = await createDemoDatabase();
      if (!isMounted) {
        db.close();
        return;
      }
      dbInstance = db;
      setDatabase(db);
      const dbSchema = await getDatabaseSchema(db);
      if (isMounted) {
        setSchema(dbSchema);
      }
    })();

    return () => {
      isMounted = false;
      dbInstance?.close();
    };
  }, []);

  useEffect(() => {
    console.log('nodes state', nodes.length);
  }, [nodes]);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      console.log('drop event', {
        clientX: event.clientX,
        clientY: event.clientY,
        dataTransferTypes: event.dataTransfer.types,
      });

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        console.warn('drop missing canvas references');
        endDrag();
        return;
      }

      const rawData = event.dataTransfer.getData('application/reactflow');
      console.log('rawData', rawData);
      if (!rawData) {
        console.warn('no drag payload');
        endDrag();
        return;
      }

      let payload: { nodeType?: FlowNodeType };
      try {
        payload = JSON.parse(rawData);
      } catch (error) {
        void error;
        endDrag();
        return;
      }

      const nodeType = payload.nodeType;
      console.log('parsed payload', payload);
      if (!nodeType) {
        console.warn('missing nodeType in payload');
        endDrag();
        return;
      }

      if (nodeType === 'queryNode' && nodes.some((node) => node.type === 'queryNode')) {
        endDrag();
        return;
      }

      const projected = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const rootNode = nodes.find((node) => node.type === 'queryNode');
      let slot: SlotInstance | null = findSlot(projected);
      if (!slot && nodeType !== 'queryNode' && rootNode) {
        const rootSlots = slotRegistry.queryNode ?? [];
        const candidate = rootSlots.find((slotDef) =>
          slotDef.allowed.includes(nodeType)
        );
        if (candidate) {
          slot = {
            nodeId: rootNode.id,
            slot: candidate,
            rect: {
              x: rootNode.position.x + candidate.bounds.x,
              y: rootNode.position.y + candidate.bounds.y,
              width: candidate.bounds.width,
              height: candidate.bounds.height,
            },
          } as SlotInstance;
        }
      }
      if (!slot && nodeType !== 'queryNode') {
        endDrag();
        return;
      }

      let parentId: string | undefined;
      let slotId: string | undefined;
      let position = projected;

      if (slot && isCompatible(slot.slot, nodeType)) {
        parentId = slot.nodeId;
        slotId = slot.slot.id;
        const children = getChildrenForSlot(parentId, slotId);
        const offset = (slot.slot.stackSpacing ?? 70) * children.length;
        const width = flowNodeDimensions[nodeType]?.width ?? 180;
        position = {
          x: slot.rect.x + slot.slot.bounds.width / 2 - width / 2,
          y: slot.rect.y + slot.slot.bounds.height + offset + 12,
        };
      } else if (nodeType === 'queryNode') {
        position = {
          x: Math.max(40, projected.x),
          y: Math.max(40, projected.y),
        };
      }

      const newNode = createVisualNode(nodeType, position, parentId, slotId);
      console.log('creating node', { nodeType, position, parentId, slotId });
      setNodes((current) => {
        const next = [...current, newNode];
        console.log('nodes after drop', next.length);
        return next;
      });
      endDrag();
    },
    [findSlot, getChildrenForSlot, isCompatible, reactFlowInstance, nodes, createVisualNode, endDrag, setNodes]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleInit = useCallback(
    (instance: ReactFlowInstance<FlowVisualNode, Edge>) => {
      setReactFlowInstance(instance);
    },
    []
  );

  const handlePaletteDragStart = useCallback(
    (nodeType: string, _payload: Record<string, unknown>) => {
      void _payload;
      startDrag(nodeType);
    },
    [startDrag]
  );

  const handlePaletteDragEnd = useCallback(() => {
    endDrag();
  }, [endDrag]);

  const handleExecute = useCallback(() => {
    if (!isQueryReady || !database) {
      return;
    }

    setIsExecuting(true);
    const resultData = runQuery(database, sql);
    setResult(resultData);
    setIsExecuting(false);
  }, [database, isQueryReady, sql]);

  const canvas = (
    <div
      ref={reactFlowWrapper}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 520,
        position: 'relative',
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <FlowMetadataProvider value={metadata}>
          <ReactFlow<FlowVisualNode, Edge>
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onInit={handleInit}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ width: '100%', height: '100%' }}
            fitView
            minZoom={0.5}
            maxZoom={1.5}
            attributionPosition="bottom-left"
          >
          <Background variant={BackgroundVariant.Lines} gap={20} size={1} style={{ background: '#f6f3ed' }} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </FlowMetadataProvider>
      {nodes.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontWeight: 600,
            letterSpacing: 0.8,
            pointerEvents: 'none',
          }}
        >
          Drag blocks from the palette to begin crafting your query.
        </div>
      )}
    </div>
  );

  return (
    <AppLayout
      leftPanel={<LeftPanel />}
      canvas={canvas}
      rightPanel={<RightPanel sql={sql} result={result} isExecuting={isExecuting} />}
      bottomPanel={<BottomPalette onBlockDragStart={handlePaletteDragStart} onBlockDragEnd={handlePaletteDragEnd} />}
      onExecute={handleExecute}
      isExecuting={isExecuting}
      canExecute={isQueryReady}
      canvasTitle="Builder"
    />
  );
}
