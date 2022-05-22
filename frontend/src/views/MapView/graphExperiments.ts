/* eslint-disable no-console */
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
  console.log(oldNodes);
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
