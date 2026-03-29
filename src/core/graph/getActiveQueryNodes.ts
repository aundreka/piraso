import type { Edge, Node } from '@xyflow/react';

const getNodeTableName = (node: Node): string => {
  const data = node.data as Record<string, unknown> | undefined;
  const tableName = data?.['tableName'];
  return typeof tableName === 'string' ? tableName : '';
};

export function getActiveQueryNodes(nodes: Node[], edges: Edge[]): Node[] {
  if (nodes.length === 0) {
    return [];
  }

  if (edges.length === 0) {
    return nodes;
  }

  const adjacency = new Map<string, Set<string>>();
  const incomingCounts = new Map<string, number>();

  const connect = (from: string, to: string) => {
    if (!adjacency.has(from)) {
      adjacency.set(from, new Set());
    }
    adjacency.get(from)?.add(to);
  };

  for (const edge of edges) {
    connect(edge.source, edge.target);
    connect(edge.target, edge.source);
    incomingCounts.set(
      edge.target,
      (incomingCounts.get(edge.target) ?? 0) + 1
    );
  }

  const tableNodes = nodes.filter((node) => node.type === 'tableNode');
  let root: Node | undefined = tableNodes.find((node) =>
    !incomingCounts.has(node.id) && Boolean(getNodeTableName(node).trim())
  );

  if (!root) {
    root =
      tableNodes.find((node) => Boolean(getNodeTableName(node).trim())) ??
      tableNodes[0];
  }

  if (!root) {
    return [];
  }

  const activeIds = new Set<string>();
  const queue = [root.id];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId || activeIds.has(currentId)) {
      continue;
    }

    activeIds.add(currentId);

    const neighbors = adjacency.get(currentId);
    if (!neighbors) {
      continue;
    }

    for (const neighbor of neighbors) {
      if (!activeIds.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return nodes.filter((node) => activeIds.has(node.id));
}
