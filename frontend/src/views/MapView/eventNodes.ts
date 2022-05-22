export type EventNode = {
  id: string;
  title: string;
  parentIDs: string[];
  x: number;
  y: number;
};

export const eventNodes: EventNode[] = [
  {
    id: '1',
    title: '1',
    parentIDs: [],
    x: -1,
    y: -1,
  },
  {
    id: '2',
    title: '2',
    parentIDs: ['1'],
    x: -1,
    y: -1,
  },
  {
    id: '3',
    title: '3',
    parentIDs: ['2'],
    x: -1,
    y: -1,
  },
  {
    id: '4',
    title: '4',
    parentIDs: ['2'],
    x: -1,
    y: -1,
  },
  {
    id: '5',
    title: '5',
    parentIDs: ['3'],
    x: -1,
    y: -1,
  },
  {
    id: '6',
    title: '6',
    parentIDs: ['3'],
    x: -1,
    y: -1,
  },
  {
    id: '7',
    title: '7',
    parentIDs: ['3', '4'],
    x: -1,
    y: -1,
  },
  {
    id: '8',
    title: '8',
    parentIDs: ['4'],
    x: -1,
    y: -1,
  },
  {
    id: '9',
    title: '9',
    parentIDs: ['4'],
    x: -1,
    y: -1,
  },
  {
    id: '10',
    title: '10',
    parentIDs: ['5'],
    x: -1,
    y: -1,
  },
  {
    id: '11',
    title: '11',
    parentIDs: ['6'],
    x: -1,
    y: -1,
  },
  {
    id: '12',
    title: '12',
    parentIDs: ['7'],
    x: -1,
    y: -1,
  },
  {
    id: '13',
    title: '13',
    parentIDs: ['7'],
    x: -1,
    y: -1,
  },
  {
    id: '14',
    title: '14',
    parentIDs: ['9'],
    x: -1,
    y: -1,
  },
  {
    id: '15',
    title: '15',
    parentIDs: ['10', '11'],
    x: -1,
    y: -1,
  },
  {
    id: '16',
    title: '16',
    parentIDs: ['11', '12'],
    x: -1,
    y: -1,
  },
  {
    id: '17',
    title: '17',
    parentIDs: ['12', '13', '14'],
    x: -1,
    y: -1,
  },
  {
    id: '18',
    title: '18',
    parentIDs: ['14'],
    x: -1,
    y: -1,
  },
  {
    id: '19',
    title: '19',
    parentIDs: ['16'],
    x: -1,
    y: -1,
  },
  {
    id: '20',
    title: '20',
    parentIDs: ['19'],
    x: -1,
    y: -1,
  },
  {
    id: '21',
    title: '21',
    parentIDs: ['19', '17'],
    x: -1,
    y: -1,
  },
  {
    id: '22',
    title: '22',
    parentIDs: ['15', '20'],
    x: -1,
    y: -1,
  },
];
