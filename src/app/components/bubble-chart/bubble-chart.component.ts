import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { IDataset } from '../../models/dataset.interface';
import { Chart } from 'chart.js';
import { getRandomColor } from '../../utils/random-color';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './buuble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent implements OnInit, AfterViewInit {


  @Input() index: number;
  @Input() datasetTitle: string;

  @Input('dataset') set prepareGraphData(value: IDataset) {
    this.createXLabel(value);
    this.createYLabel(value);
    this.createChartData(value);
  }

  hide: boolean = true;
  scenesMap: { [key: string]: number };
  speakersMap: { [key: string]: number };

  xLabel: { [key: number]: string };
  yLabel: { [key: number]: string };
  chartData: { label: string, data: any[], borderColor: string, backgroundColor: string }[];
  bubbleChart;
  graphDOMReference;

  constructor() {
  }


  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initGraphDOMReference();
    this.createBubbleChart();
  }

  initGraphDOMReference() {
    this.graphDOMReference = document.getElementById('bubbleChartContainer' + this.index);
  }

  createYLabel(dataset) {
    const uniqueSpeakers = dataset.datasets
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

    this.yLabel = Object.assign({}, uniqueSpeakers);
    this.speakersMap = this.buildMapFromLabels(this.yLabel);
  }

  createXLabel(dataset) {
    const sceneNames = dataset.datasets
      .map(act => {
        return act.SCENES.map(scene => {
          return scene.TITLE;
        }).map(sceneTitle => `${act.TITLE} - ${sceneTitle.split('.')[0]}`);
      })
      .reduce((allScenes, scenesInAct) => [...allScenes, ...scenesInAct], [])
      .filter((v, i, a) => a.indexOf(v) === i);

    this.xLabel = Object.assign({}, sceneNames);
    this.scenesMap = this.buildMapFromLabels(this.xLabel);
  }

  buildMapFromLabels(labels: { [key: number]: string }): { [key: string]: number } {
    return Object.keys(labels)
      .reduce((speakersMap, key) => {
        speakersMap[labels[key]] = Number(key);
        return speakersMap;
      }, {});
  }

  createChartData(dataset) {
    const allPoints = dataset.datasets
      .map(act => {
        return act.SCENES.map(scene => {
          return scene.ACTIONS
            .map(action => action.SPEAKER)
            .filter((v, i, a) => a.indexOf(v) === i);
        });
      })
      .reduce((sceneSpeakersInAct, sceneSpeakerSet) => [...sceneSpeakersInAct, ...sceneSpeakerSet], [])
      .reduce((sceneSpeakersInAct, sceneSpeakerSet, sceneIndex) => {
        const sceneSpeakerPoints = sceneSpeakerSet
          .reduce((pointsCollection, speaker) => [...pointsCollection, {x: sceneIndex, y: this.speakersMap[speaker], r: 10}], []);
        return [...sceneSpeakersInAct, ...sceneSpeakerPoints];
      }, []);

    this.chartData = Object.keys(this.speakersMap)
      .reduce((datasets, speaker) => {
        const datasetColor = getRandomColor();
        return [...datasets,
          {
            label: speaker,
            data: [],
            borderColor: datasetColor,
            backgroundColor: datasetColor,
          }];
      }, []);

    Object.keys(this.yLabel).forEach(speakerIndex =>
      this.chartData[speakerIndex].data = allPoints.filter(point => point.y === Number(speakerIndex))
    );
  }

  createBubbleChart() {
    this.bubbleChart = new Chart(this.graphDOMReference, {
      type: 'bubble',
      data: {
        labels: this.xLabel,
        datasets: this.chartData
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            ticks: {
              stepSize: 1,
              autoSkip: false,
              callback: (value, index, values) => {
                return this.xLabel[value];
              }
            }
          }],
          yAxes: [{
            ticks: {
              stepSize: 1,
              autoSkip: false,
              callback: (value, index, values) => {
                return this.yLabel[value];
              }
            }
          }]
        }
      }
    })
    ;
  }

  downloadChart() {
    const link = document.getElementById('downloadChart' + this.index) as any;
    link.href = this.graphDOMReference.toDataURL('image/jpg');
    console.log(link);
  }
}
