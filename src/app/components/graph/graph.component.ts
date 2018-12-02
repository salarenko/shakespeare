import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { GraphService } from '../../services/graph.service';
import * as Sigma from 'sigma';
import { IGraph } from '../../models/graph.interface';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { sumGraphs } from '../../utils/sum-graphs';
import { IDataset } from '../../models/dataset.interface';
import { parseToGraph } from '../../utils/parse-to-graph';
import { INode } from '../../models/node.interface';

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
  hide = false;
  graphsCollection: { TITLE: string, GRAPH: IGraph }[] = [];
  datasetsForm: FormGroup;

  colors = {
    active: '#F653A6',
    selected: '#A50B5E',
    inactive: '#EEE',
    neutral: '#58B8D4'
  };
  selectedNodeInfo = {
    selNode: null,
    neighbours: [],
  };

  constructor(private graphService: GraphService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }

  ngAfterViewInit() {
    this.initializeSigma();
    this.combineGraphs(this.datasetsForm.getRawValue());
    this.onDatasetChange();

    this.sigma.bind('clickNode', (node) => this.findAllEdges(node.data.node));
    this.sigma.bind('clickStage', () => this.resetColors());
  }

  findAllEdges(node) {

    this.changeAllNodesColor(this.colors.inactive);
    this.changeAllEdgesColor(this.colors.inactive);

    node.color = this.colors.selected;

    this.setSelectedNodeInfo(node)

    // Color nodes
    this.selectedNodeInfo.neighbours
      .map(neighbour => neighbour.name)
      .forEach(neighbour =>
        this.sigma.graph.nodes()
          .find(nod => nod.label === neighbour)
          .color = this.colors.active
      );

    // Color edges
    this.selectedNodeInfo.neighbours
      .map(neighbour => neighbour.name)
      .forEach(neighbour => {
        const edge = this.sigma.graph.edges()
          .find(edg => (edg.target === neighbour && edg.source === node.label) || (edg.target === node.label && edg.source === neighbour));
        if (edge) {
          edge.color = this.colors.active;
        }
      });

    this.sigma.refresh();
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
      this.resetSelectedNodeInfo();
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

  downloadGraph(event) {
    event.stopPropagation();
    const canvasRef = document
      .getElementById('sigma-container-' + this.index)
      .getElementsByClassName('sigma-scene')[0] as any;

    const link = document.getElementById('downloadGraph' + this.index) as any;

    link.href = canvasRef.toDataURL('image/jpg');
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
        defaultEdgeColor: this.colors.inactive,
        defaultNodeColor: this.colors.neutral,
        defautlEdgeType: 'arrow',
        edgeColor: 'default',
        defaultLabelSize: 12,
        defaultLabelColor: '#000',
        zoomMin: 0.03125,
        labelThreshold: 0
      }
    });
  }

  changeAllNodesColor(color: string) {
    this.sigma.graph.nodes().map(node => {
      node.color = color;
      return node;
    });
    this.sigma.refresh();
  }

  changeAllEdgesColor(color: string) {
    this.sigma.graph.edges().map(edge => {
      edge.color = color;
      return edge;
    });
    this.sigma.refresh();
  }

  setSelectedNodeInfo(node: INode) {

    this.selectedNodeInfo.selNode = node;

    this.selectedNodeInfo.neighbours = this.graph.EDGES
      .filter(edge => edge.source === node.label || edge.target === node.label)
      .reduce((nghbCol, nghb) => {
        nghbCol.push(
          {
            name: nghb.source === node.label ? nghb.target : nghb.source,
            weight: nghb.weight
          });
        return nghbCol;
      }, [])
      .sort((a, b) => b.weight - a.weight);
  }

  resetSelectedNodeInfo() {
    this.selectedNodeInfo = {
      selNode: null,
      neighbours: [],
    };
  }

  resetColors() {
    this.changeAllNodesColor(this.colors.neutral);
    this.changeAllEdgesColor(this.colors.inactive);
  }
}
