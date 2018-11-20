import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';
import { xml2js } from 'xml-js';
import { GraphService } from '../../services/graph.service';
import { restructurizeData } from '../../utils/restructurize-data';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  fileNames: any[] = [];
  filesAsJsObj: any[] = [];

  constructor(private fb: FormBuilder,
              private loaderService: LoaderService,
              private graphService: GraphService,
              private router: Router) {
  }


  ngOnInit() {
  }

  loadFile(file) {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      const jsObject = xml2js(fileReader.result);
      this.filesAsJsObj.push(jsObject);
      this.fileNames.push(file.name);
    };
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const files = event.target.files;


      // parseXMLToObject
      for (let i = 0; i < files.length; i++) {
        this.loadFile(files[i]);
      }
    }
  }

  removeFile(index: number) {
    this.fileNames.splice(index, 1);
    this.filesAsJsObj.splice(index, 1);
  }

  generateGraph() {
    this.loaderService.displayLoader = true;
    setTimeout(() => {
      this.filesAsJsObj.forEach(file => {
        const structurizedData = restructurizeData(file);
        this.graphService.datasets.push(structurizedData);
      });
      this.router.navigate(['/graph']);
      this.loaderService.displayLoader = false;
    }, 2000);
  }
}
