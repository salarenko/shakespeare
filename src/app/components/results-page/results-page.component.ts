import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GraphService } from '../../services/graph.service';
import { IDataset } from '../../models/dataset.interface';

@Component({
  selector: 'app-result-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResultsPageComponent implements OnInit {

  datasetsCollection: IDataset[] = [];

  constructor(private graphService: GraphService) {
  }

  ngOnInit() {
    this.datasetsCollection = this.graphService.datasets;
  }

  updateDataset(i, dataset: IDataset) {
    this.datasetsCollection[i] = dataset;
  }
}
