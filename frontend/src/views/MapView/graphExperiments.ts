/* eslint-disable no-console */
import { SessionEventWithPos } from './sessionSlice';

type EventPositionInfo = {
  id: string;
  parentIds: string[];
  x: number;
  y: number;
};

const getParents = (node: EventPositionInfo, allNodes: EventPositionInfo[]): EventPositionInfo[] =>
  allNodes.filter(element => node.parentIds.includes(element.id));

const checkAllParents = (node: EventPositionInfo, nodes: EventPositionInfo[]) =>
  nodes.map(element => element.id).some(id => node.parentIds.includes(id));

const getHighestY = (nodes: EventPositionInfo[]) => Math.max(...nodes.map(node => node.y));

export const setYPos = (events: SessionEventWithPos[]): SessionEventWithPos[] => {
  // deep copy of eventNodes
  // TO-DO: export trimming to external func
  const trimmedEventNodes: EventPositionInfo[] = events.map((eventNode: SessionEventWithPos) => ({
    id: eventNode.id,
    parentIds: eventNode.parentIds,
    x: eventNode.x,
    y: eventNode.y,
  }));
  const oldNodes: EventPositionInfo[] = JSON.parse(JSON.stringify(trimmedEventNodes));
  const newNodes: EventPositionInfo[] = [];

  while (oldNodes.length > 0) {
    const node = oldNodes.shift();
    if (node) {
      if (node.parentIds.length === 0) {
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

  events.forEach(event => {
    const positionNode = newNodes.find(node => node.id === event.id);
    if (positionNode) event.y = positionNode.y;
  });

  return events;
};

// export const convertEventNodeArrayToRows

// type EventNodesAsRows = { [rowNumber: number]: EventNode[] };

// export const setXPositions = (rows: EventNodesAsRows): EventNodesAsRows => {
//   const newNodes: EventNodesAsRows = {};
//   newNodes[0] = rows[0];
//   const maxRow = parseInt(Object.keys(rows).sort()[-1]);

//   for (let rowIndex = 1; rowIndex <= maxRow; rowIndex++) {
//     const previousRow = rows[rowIndex - 1];
//     const currentRow = rows[rowIndex];
//     const newRow: EventNode[][] = [];
//     previousRow.forEach(() => {
//       newRow.push([]);
//       newRow.push([]);
//     });

//     // handling nodes with only one parent
//     for (let index = 0; index < previousRow.length; index++) {
//       newRow[index * 2] = currentRow.filter(
//         node => node.parentIDs.includes(previousRow[index].id) && node.parentIDs.length === 0
//       );
//     }
//   }

//   return newNodes;
// };
