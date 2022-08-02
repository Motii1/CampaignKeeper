import { SessionEventWithPos } from './eventsSlice';

type NodePositionInfo = {
  id: string;
  parentIds: string[];
  childrenIds: string[];
  isShown: boolean;
  x: number;
  y: number;
};

const compareNodesInRow = (e1: NodePositionInfo, e2: NodePositionInfo): number => {
  if (e1.x < e2.x) return -1;
  if (e1.x > e2.x) return 1;
  if (e1.id < e2.id) return -1;
  if (e1.id > e2.id) return 1;
  return 0;
};

const compareNodesById = (e1: NodePositionInfo, e2: NodePositionInfo): number => {
  if (e1.id < e2.id) return -1;
  if (e1.id > e2.id) return 1;
  return 0;
};

const getParents = (node: NodePositionInfo, allNodes: NodePositionInfo[]): NodePositionInfo[] =>
  allNodes.filter(element => node.parentIds.includes(element.id));

const checkAllParents = (node: NodePositionInfo, nodes: NodePositionInfo[]) =>
  nodes.map(element => element.id).some(id => node.parentIds.includes(id));

const getHighestY = (nodes: NodePositionInfo[]) => Math.max(...nodes.map(node => node.y));

// also removing unimportant information and events which aren't shown
const convertEventsToNodes = (events: SessionEventWithPos[]): NodePositionInfo[] => {
  const eventsAsNodes = events.map((event: SessionEventWithPos) => ({
    id: event.id,
    parentIds: event.parentIds,
    childrenIds: event.childrenIds,
    isShown: event.displayStatus === 'shown',
    x: event.x,
    y: event.y,
  }));

  const queue: NodePositionInfo[] = eventsAsNodes.filter(event => event.parentIds.length === 0);
  const nodesInGraph: Set<NodePositionInfo> = new Set(queue);
  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (currentNode) {
      nodesInGraph.add(currentNode);
      if (currentNode && currentNode?.isShown) {
        queue.push(...eventsAsNodes.filter(node => currentNode.childrenIds.includes(node.id)));
      }
    }
  }

  return Array.from(nodesInGraph);
};

const setYPos = (nodes: NodePositionInfo[]): NodePositionInfo[] => {
  const oldNodes: NodePositionInfo[] = JSON.parse(JSON.stringify(nodes));
  const newNodes: NodePositionInfo[] = [];

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

  return newNodes;
};

const setXPos = (nodes: NodePositionInfo[]): NodePositionInfo[] => {
  const maxY = Math.max(...nodes.map(node => node.y));
  const rows: { [row: string]: NodePositionInfo[] } = {};
  for (let index = 0; index <= maxY; index++) rows[index] = nodes.filter(node => node.y === index);

  rows[0].sort(compareNodesById);
  let indexAtFirstRow = 0;
  rows[0].forEach(node => {
    node.x = indexAtFirstRow;
    indexAtFirstRow++;
  });

  for (let index = 1; index <= maxY; index++) {
    // finding avg x for each node in row
    rows[index].forEach(node => {
      const nodeParentsX = getParents(node, nodes).map(node => node.x);
      node.x = nodeParentsX.reduce((a, b) => a + b, 0) / nodeParentsX.length;
    });
    rows[index].sort(compareNodesInRow);

    // normalizing avg for each node in row
    let newX = 0;
    rows[index].forEach(node => {
      node.x = newX;
      newX++;
    });
  }

  return Object.keys(rows)
    .map(index => rows[index])
    .flat();
};

/**
 * Function responsible for determining position of events in graph (their XY coordinates)
 * and attaching them to events, called every time graph structure may change
 * (e.g. new event is added, exisiting event is removed or edited)
 * @param events
 * @returns
 */
export const setPositions = (events: SessionEventWithPos[]): SessionEventWithPos[] => {
  if (events.length === 0) return [];

  const eventsAsNodes: NodePositionInfo[] = convertEventsToNodes(events);
  const nodesWithYPos = setYPos(eventsAsNodes);
  const nodesWithBothPos = setXPos(nodesWithYPos);

  return events.map(event => {
    const eventAsNode = nodesWithBothPos.find(node => node.id === event.id);
    return {
      ...event,
      x: eventAsNode ? eventAsNode.x : -1,
      y: eventAsNode ? eventAsNode.y : -1,
    };
  });
};
