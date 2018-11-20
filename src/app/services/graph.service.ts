import { Injectable } from '@angular/core';
import { IDataset } from '../models/dataset.interface';

@Injectable()

export class GraphService {

  datasets: IDataset[] = [];

  constructor() {
  }

  resetData() {
    this.datasets = null;
  }
}
