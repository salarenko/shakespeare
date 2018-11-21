export const uniqueSpeakersInDataset = (dataset): string[] => {
  return dataset.datasets
    .map(act => {
      return act.SCENES.map(scene => {
        return scene.ACTIONS.map(action => {
          return action.SPEAKER;
        });
      });
    })
    .reduce((allActSpeakers, speakerActSet) => [...allActSpeakers, ...speakerActSet], [])
    .reduce((allSpeakers, speakerSet) => [...allSpeakers, ...speakerSet], [])
    .filter((v, i, a) => a.indexOf(v) === i);
};
