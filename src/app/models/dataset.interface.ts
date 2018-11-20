export interface IDataset {
  datasetTitle: string;
  datasets: {
    TITLE: string,
    SCENES: {
      TITLE: string,
      ACTIONS: {
        SPEAKER: string,
        SPEECH: string
      }[],
    }[]
  }[];
}
