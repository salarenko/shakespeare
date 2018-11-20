import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { GraphService } from '../../services/graph.service';
import * as Sigma from 'sigma';
import { IGraph } from '../../models/graph.interface';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { sumGraphs } from '../../utils/sum-graphs';
import { IDataset } from '../../models/dataset.interface';
import { parseToGraph } from '../../utils/parse-to-graph';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, AfterViewInit {


  @Input() datasetTitle: string;
  @Input() index: number;

  @Input('dataset') set setGraphs(value: IDataset) {
    this.graphsCollection = parseToGraph(value);
  }

  sigma;
  graph;
  graphsCollection: { TITLE: string, GRAPH: IGraph }[] = [];
  datasetsForm: FormGroup;

  constructor(private graphService: GraphService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }

  ngAfterViewInit() {
    this.initializeSigma();
    this.combineGraphs(this.datasetsForm.getRawValue());
    this.onDatasetChange();
  }

  buildForm() {
    this.datasetsForm = this.fb.group({
      ['allDatasets' + this.index]: [true]
    });
    this.graphsCollection.forEach(dataset => {
      this.datasetsForm.addControl(dataset.TITLE + this.index, new FormControl(true));
    });
  }

  onDatasetChange(): void {
    let oldSelectAll = true;
    this.datasetsForm.valueChanges.subscribe(val => {

      if (val['allDatasets' + this.index] && (val['allDatasets' + this.index] !== oldSelectAll)) {
        Object.keys(this.datasetsForm.controls)
          .forEach(controlName => this.datasetsForm.get(controlName).setValue(true, {emitEvent: false}));
        oldSelectAll = val['allDatasets' + this.index];
      } else {
        oldSelectAll = val['allDatasets' + this.index];
        this.datasetsForm.get('allDatasets' + this.index).setValue(false, {emitEvent: false});
      }
      this.combineGraphs(this.datasetsForm.getRawValue());
    });
  }

  combineGraphs(usedDatasets: { [key: string]: boolean }) {
    const activeDatasets = Object.keys(usedDatasets)
      .filter(dName => usedDatasets[dName]);

    this.graph = this.graphsCollection.reduce(
      (newGraph: IGraph, dataset) => {

        if (activeDatasets.includes(dataset.TITLE + this.index)) {
          return sumGraphs([newGraph, dataset.GRAPH]);
        }
        return newGraph;

      }, {NODES: [], EDGES: []});

    this.updateAndRefreshGraph();
  }

  updateAndRefreshGraph() {
    this.sigma.graph.clear();
    this.sigma.graph.read({
      nodes: this.graph.NODES,
      edges: this.graph.EDGES
    });

    this.sigma.refresh();
  }

  initializeSigma() {
    this.sigma = new Sigma({
      renderer: {
        container: document.getElementById('sigma-container-' + this.index),
        type: 'canvas'
      },
      settings: {
        autoRescale: true,
        mouseEnabled: true,
        touchEnabled: false,
        nodesPowRatio: 1,
        edgesPowRatio: 1,
        defaultEdgeColor: '#eee',
        defaultNodeColor: '#58B8D4',
        defautlEdgeType: 'arrow',
        edgeColor: 'default',
        defaultLabelSize: 12,
        defaultLabelColor: '#000',
        zoomMin: 0.03125,
        labelThreshold: 0
      }
    });
  }
}
