import { extractBaseData } from './extract-base-data';
import { findAllNodes } from './find-all-post-xml-nodes';
import { reduceData } from './reduce-data';
import { IDataset } from '../models/dataset.interface';

export const restructurizeData = (data): IDataset => {

  const baseData: { [key: string]: any } = extractBaseData(data, ['TITLE', 'PLAYSUBT']);

  // console.log(baseData);
  // debugger;

  const actsNodes: any[] = findAllNodes(data, 'ACT')[0];

  // console.log(actsNodes);
  // debugger;

  // GROUP ON ACT LEVEL
  const structure1 = reduceData(actsNodes, 'TITLE', 'SCENES');

  // console.log(structure1);
  // debugger;

  // GROUP ON SCENE LEVEL
  const structure2 = structure1.map(act => {
      return {...act, SCENES: reduceData(act.SCENES, 'TITLE', 'ACTIONS')};
    }
  );

  // console.log(structure2);
  // debugger;

  // GROUP ON ACTIONS LEVEL
  const structure3 = structure2.map(
    act => {
      return {
        ...act,
        SCENES: act.SCENES.map(scene => {
          return {...scene, ACTIONS: reduceData(scene.ACTIONS, 'SPEAKER', 'SPEECH')};
        })
      };
    }
  );

  // console.log(structure3);
  // debugger;

  // GROUP ON SPEECH LEVEL
  const structurizedData = structure3.map(
    act => {
      return {
        ...act,
        SCENES: act.SCENES.map(scene => {
          return {
            ...scene, ACTIONS: scene.ACTIONS.map(action => {
              return {
                ...action, SPEECH: action.SPEECH.reduce((speech, line) =>
                  speech + (line[0].text || '')
                  , '')
              };
            })
          };
        })
      };
    }
  );

  // console.log(structure4);
  // debugger;

  // CREATE GRAPHS (EDGES AND NODES) ON SCENE LEVEL
  // const sceneLevelGraphs = structure4.map(
  //   act => {
  //     return {
  //       ...act,
  //       SCENES: act.SCENES.map(scene => {
  //
  //         const uniqueSpeakers: any[] = [...Array.from(new Set(scene.ACTIONS.map(action => action.SPEAKER)))];
  //
  //         return {
  //           ...scene,
  //           GRAPH: {
  //             NODES: uniqueSpeakers.map(speaker => {
  //               return {
  //                 id: speaker,
  //                 label: speaker,
  //                 size: 1,
  //                 x: Math.cos(randNum() / randNum() * Math.PI * 2) * Math.sqrt(randNum() / 2 + 1) * randNum(),
  //                 y: Math.sin(randNum() / randNum() * Math.PI * 2) * Math.sqrt(randNum() / 10 + 1) * randNum(),
  //               };
  //             }),
  //             EDGES: connectAllNodes(uniqueSpeakers)
  //           }
  //         };
  //       })
  //     };
  //   }
  // );

  // CREATE GRAPHS (EDGES AND NODES) ON ACT LEVEL
  // const actLevelGraphs = sceneLevelGraphs.map(act => {
  //   return {
  //     TITLE: act.TITLE,
  //     GRAPH: act.SCENES.reduce((graph, scene) => {
  //       return graph
  //         ? sumGraphs([graph, scene.GRAPH])
  //         : scene.GRAPH;
  //     }, null)
  //   };
  // });

  return {
    datasetTitle: baseData.TITLE as string,
    datasets: structurizedData
  };
};
