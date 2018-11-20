import {IEdge} from '../models/edge.interface';

export const uniqueEdge = (edges: IEdge[], target: string, source: string) => {
  return !edges.find(edge => (edge.source === source && edge.target === target) || (edge.source === target && edge.target === source));
};
