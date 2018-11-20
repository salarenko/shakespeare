import { Component, Input } from '@angular/core';
import { IGraph } from '../../models/graph.interface';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {

  @Input() dataset: { TITLE: string, GRAPH: IGraph }[] = [];
  @Input() datasetTitle: string;
  @Input() index: number;

  constructor() {
  }
}
