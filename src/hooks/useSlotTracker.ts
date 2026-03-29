import { useCallback, useMemo } from 'react';
import type { Node } from '@xyflow/react';
import { slotRegistry } from '../core/blocks/slotRegistry';
import type { SlotDefinition } from '../core/blocks/slotRegistry';
import type { FlowNodeType } from '../types/flow';

export type SlotInstance = {
  nodeId: string;
  slot: SlotDefinition;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

const pointInside = (x: number, y: number, rect: SlotInstance['rect']) =>
  x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;

export function useSlotTracker(nodes: Node[]) {
  const instances = useMemo<SlotInstance[]>(() => {
    return nodes.flatMap((node) => {
      const definitions = slotRegistry[node.type as FlowNodeType];
      if (!definitions || definitions.length === 0) {
        return [];
      }

      return definitions.map((slot) => ({
        nodeId: node.id,
        slot,
        rect: {
          x: node.position.x + slot.bounds.x,
          y: node.position.y + slot.bounds.y,
          width: slot.bounds.width,
          height: slot.bounds.height,
        },
      }));
    });
  }, [nodes]);

  const findSlot = useCallback(
    (position: { x: number; y: number }) =>
      instances.find((instance) => pointInside(position.x, position.y, instance.rect)) ??
      null,
    [instances]
  );

  const isCompatible = useCallback(
    (slot: SlotDefinition, nodeType: FlowNodeType) =>
      slot.allowed.includes(nodeType),
    []
  );

  const getChildrenForSlot = useCallback(
    (parentId: string, slotId: string) =>
      nodes.filter(
        (node) =>
          node.parentId === parentId &&
          typeof node.data?.slotId === 'string' &&
          node.data.slotId === slotId
      ),
    [nodes]
  );

  return {
    slots: instances,
    findSlot,
    isCompatible,
    getChildrenForSlot,
  };
}
