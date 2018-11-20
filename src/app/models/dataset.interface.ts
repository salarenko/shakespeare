import { IGraph } from './graph.interface';

export interface IDataset {
  datasetTitle: string;
  datasets: {
    TITLE: string,
    SCENES: {
      TITLE: string,
      // GRAPH: IGraph
      ACTIONS: {
        SPEAKER: string,
        SPEECH: string
      }[],
    }[]
  }[];
}
