import {IGraph} from '../models/graph.interface';
import {uniqueEdge} from './unique-edge';

export const sumGraphs = (graphs: IGraph[]): IGraph => {
  const usedNodes: string[] = [];

  const newGraph: IGraph = {
    NODES: [],
    EDGES: []
  };

  graphs.forEach(graph => {

    graph.NODES.forEach(node => {

      if (!usedNodes.includes(node.id)) {
        newGraph.NODES.push(node);
        usedNodes.push(node.id);
      } else {
        const existingNode = newGraph.NODES.find(el => el.id === node.id);
        existingNode.size++;
      }

    });

    graph.EDGES.forEach(edge => {

      if (uniqueEdge(newGraph.EDGES, edge.target, edge.source)) {
        newGraph.EDGES.push({...edge});
      }
    });

  });

  return newGraph;

};

