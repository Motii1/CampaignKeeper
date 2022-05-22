import { EventNode } from './eventNodes';

const getParents = (node: EventNode, allNodes: EventNode[]): EventNode[] =>
  allNodes.filter(element => node.parentIDs.includes(element.id));

const checkAllParents = (node: EventNode, nodes: EventNode[]) =>
  nodes.map(element => element.id).some(element => node.parentIDs.includes(element));

const getHighestY = (nodes: EventNode[]) => Math.max(...nodes.map(node => node.y));

export const setYPositions = (eventNodes: EventNode[]): EventNode[] => {
  // deep copy of eventNodes
  const oldNodes = JSON.parse(JSON.stringify(eventNodes));
  const newNodes: EventNode[] = [];

  while (oldNodes.length > 0) {
    const node = oldNodes.shift();
    if (node) {
      if (node.parentIDs.length === 0) {
        node.y = 0;
        newNodes.push(node);
      } else {
        if (!checkAllParents(node, oldNodes)) {
          const nodeParents = getParents(node, newNodes);
          node.y = getHighestY(nodeParents) + 1;
          newNodes.push(node);
        } else oldNodes.push(node);
      }
    }
  }

  return newNodes;
};
