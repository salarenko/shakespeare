import { IGraph } from '../models/graph.interface';
import { uniqueEdge } from './unique-edge';

export const sumGraphs = (graphs: IGraph[]): IGraph => {
  const usedNodes: string[] = [];

  const newGraph: IGraph = {
    NODES: [],
    EDGES: []
  };

  graphs.forEach(graph => {

    graph.NODES.forEach(node => {

      if (!usedNodes.includes(node.id)) {
        newGraph.NODES.push({...node});
        usedNodes.push(node.id);
      } else {
        const existingNode = newGraph.NODES.find(el => el.id === node.id);
        existingNode.size += node.size;
      }

    });

    graph.EDGES.forEach(edge => {
      const existingEdge = uniqueEdge(newGraph.EDGES, edge.target, edge.source);

      if (!existingEdge) {
        newGraph.EDGES.push({...edge});
      } else {
        existingEdge.weight += edge.weight;
      }
    });

  });

  return newGraph;

};

