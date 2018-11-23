import {IEdge} from '../models/edge.interface';
import {uniqueEdge} from './unique-edge';

export const connectAllNodes = (nodes: string[]): IEdge[] => {
  const edges = [];

  nodes.forEach(node1 =>
    nodes.forEach(node2 => {

      if (node1 !== node2 && uniqueEdge(edges, node1, node2)) {
        edges.push({
          id: node1 + node2,
          source: node1,
          target: node2,
          label: ':)'
        });
      }

    })
  );

  return edges;
};
