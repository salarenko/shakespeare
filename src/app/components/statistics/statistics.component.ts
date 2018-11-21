import { Component, Input } from '@angular/core';
import { IDataset } from '../../models/dataset.interface';
import { uniqueSpeakersInDataset } from '../../utils/unique-speakers-in-dataset';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {


  @Input() index: number;
  @Input() datasetTitle: string;

  @Input('dataset') set setGraphs(value: IDataset) {
    this.createActorsDataset(value);
    this.createScenesDataset(value);
    this.createActsDataset(value);

    this.initializeActsTableColumns();
    this.initializeSceneTableColumns();
    this.initializeActorsTableColumns();
  }

  actsTableColumnsNames: any[];
  actorsTableColumnsNames: any[];
  scenesTableColumnsNames: any[];

  actorsTableDataset: {
    actorName: string,
    popularity: number,
    numActedScenes: number,
    speechPercentage: number,
    longestSpeech: number,
    numberOfSpeeches: number
  }[] = [];

  scenesTableDataset: {
    sceneName: string,
    actName: string,
    numOfActors: string,
    numOfTextSaid: string,
    numberOfSpeeches: number,
    mostImportantActor: string
  }[] = [];

  actsTableDataset: {
    actName: string,
    numOfScenes: number
  }[] = [];

  hide = true;

  constructor() {
  }

  initializeActorsTableColumns() {
    const compareActedScenes = (a, b) => Number(a.split('/')[0]) - Number(b.split('/')[0]);
    const compareSpeechPercentage = (a, b) => Number(a.split('%')[0]) - Number(b.split('%')[0]);
    this.actorsTableColumnsNames = [
      {prop: 'actorName', name: 'Actor'},
      {prop: 'popularity', name: 'Popularity'},
      {prop: 'numActedScenes', name: 'Acted scenes', comparator: compareActedScenes},
      {prop: 'numberOfSpeeches', name: 'Speeches'},
      {prop: 'speechPercentage', name: 'Total speech', comparator: compareSpeechPercentage},
      {prop: 'longestSpeech', name: 'Longest speech'},
    ];
  }

  initializeSceneTableColumns() {
    const compareActedScenes = (a, b) => Number(a.split('/')[0]) - Number(b.split('/')[0]);
    const compareSpeechPercentage = (a, b) => Number(a.split('%')[0]) - Number(b.split('%')[0]);

    this.scenesTableColumnsNames = [
      {prop: 'sceneName', name: 'Scene'},
      {prop: 'actName', name: 'Act'},
      {prop: 'numOfActors', name: 'Number of actors', comparator: compareActedScenes},
      {prop: 'numberOfSpeeches', name: 'Number of speeches'},
      {prop: 'numOfTextSaid', name: 'Amount of text said', comparator: compareSpeechPercentage},
      {prop: 'mostImportantActor', name: 'Most important actor'},
    ];
  }

  initializeActsTableColumns() {
    this.actsTableColumnsNames = [
      {prop: 'actName', name: 'Act'},
      {prop: 'numOfScenes', name: 'Number of scenes'},
    ];
  }

  createActorsDataset(dataset: IDataset) {
    let totalNumberOfWords = 0;
    let totalNumberOfScenes = 0;
    const allActors = uniqueSpeakersInDataset(dataset);

    const temporaryStructure = allActors
      .reduce((acc, actor) => {
        acc[actor] = {actorName: actor, popularity: 0, numActedScenes: 0, wordsSaid: 0, longestSpeech: 0, numberOfSpeeches: 0};
        return acc;
      }, {});

    dataset.datasets
      .forEach(act =>
        act.SCENES.forEach(scene => {
          const speakersInScene = [];
          totalNumberOfScenes += 1;
          scene.ACTIONS.forEach(action => {
            const wordNum = action.SPEECH.length;
            totalNumberOfWords += wordNum;
            temporaryStructure[action.SPEAKER].wordsSaid += wordNum;
            temporaryStructure[action.SPEAKER].numberOfSpeeches += 1;
            if (temporaryStructure[action.SPEAKER].longestSpeech < wordNum) {
              temporaryStructure[action.SPEAKER].longestSpeech = wordNum;
            }
            if (speakersInScene.indexOf(action.SPEAKER) === -1) {
              speakersInScene.push(action.SPEAKER);
              temporaryStructure[action.SPEAKER].numActedScenes += 1;
            }
          });
          speakersInScene.forEach(speaker => temporaryStructure[speaker].popularity += (speakersInScene.length - 1));
        })
      );

    this.actorsTableDataset = allActors.reduce((actorsDataset, actorName) => {
      actorsDataset.push({
        actorName,
        popularity: temporaryStructure[actorName].popularity,
        longestSpeech: temporaryStructure[actorName].longestSpeech,
        numberOfSpeeches: temporaryStructure[actorName].numberOfSpeeches,
        numActedScenes: temporaryStructure[actorName].numActedScenes + '/' + totalNumberOfScenes,
        speechPercentage: Math.floor((temporaryStructure[actorName].wordsSaid / totalNumberOfWords) * 10000) / 100 + '%',
      });
      return actorsDataset;
    }, []);


  }


  createScenesDataset(dataset: IDataset) {
    let totalNumberOfWords = 0;

    dataset.datasets
      .forEach(act =>
        act.SCENES.forEach(scene => {

          const sceneSet = {
            sceneName: scene.TITLE.split('.')[0],
            actName: act.TITLE,
            numOfActors: 0,
            numOfTextSaid: 0,
            numberOfSpeeches: 0,
            mostImportantActor: ''
          };

          const speakersInScene = {};

          scene.ACTIONS.forEach(action => {

            const wordNum = action.SPEECH.length;
            totalNumberOfWords += wordNum;
            sceneSet.numberOfSpeeches += 1;
            sceneSet.numOfTextSaid += wordNum;
            speakersInScene[action.SPEAKER] = wordNum + (speakersInScene[action.SPEAKER] || 0);
          });

          sceneSet.numOfActors = Object.keys(speakersInScene).length;

          let longestSpeech = 0;
          Object.keys(speakersInScene).forEach(actor => {
            if (speakersInScene[actor] > longestSpeech) {
              sceneSet.mostImportantActor = actor;
              longestSpeech = speakersInScene[actor];
            }
          });

          this.scenesTableDataset.push(sceneSet as any);
        })
      );

    this.scenesTableDataset.map(sceneSet => {
      sceneSet.numOfActors = sceneSet.numOfActors + '/' + this.actorsTableDataset.length;
      sceneSet.numOfTextSaid = Math.floor((Number(sceneSet.numOfTextSaid) / totalNumberOfWords) * 10000) / 100 + '%';
      return sceneSet;
    });


  }

  createActsDataset(dataset: IDataset) {
    dataset.datasets.forEach(act =>
      this.actsTableDataset.push({
        actName: act.TITLE,
        numOfScenes: act.SCENES.length
      }));
  }
}
