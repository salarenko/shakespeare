import { IDataset } from '../models/dataset.interface';
import { connectAllNodes } from './connect-all-nodes';
import { randNum } from './random-number';
import { sumGraphs } from './sum-graphs';
import { IGraph } from '../models/graph.interface';

export const parseToGraph = (dataset: IDataset): {TITLE: string, GRAPH: IGraph}[] => {

  // CREATE GRAPHS (EDGES AND NODES) ON SCENE LEVEL
  const sceneLevelGraphs = dataset.datasets.map(
    act => {
      return {
        ...act,
        SCENES: act.SCENES.map(scene => {

          const uniqueSpeakers: any[] = [...Array.from(new Set(scene.ACTIONS.map(action => action.SPEAKER)))];

          return {
            ...scene,
            GRAPH: {
              NODES: uniqueSpeakers.map(speaker => {
                return {
                  id: speaker as string,
                  label: speaker as string,
                  size: 1,
                  x: Math.cos(randNum() / randNum() * Math.PI * 2) * Math.sqrt(randNum() / 2 + 1) * randNum(),
                  y: Math.sin(randNum() / randNum() * Math.PI * 2) * Math.sqrt(randNum() / 10 + 1) * randNum(),
                };
              }),
              EDGES: connectAllNodes(uniqueSpeakers)
            }
          };
        })
      };
    }
  );

  // CREATE GRAPHS (EDGES AND NODES) ON ACT LEVEL
  const actLevelGraphs = sceneLevelGraphs.map(act => {
    return {
      TITLE: act.TITLE,
      GRAPH: act.SCENES.reduce((graph: IGraph, scene) => {
        return graph
          ? sumGraphs([graph, scene.GRAPH])
          : scene.GRAPH;
      }, null)
    };
  });

  return actLevelGraphs;
};
