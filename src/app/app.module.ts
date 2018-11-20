import { MainPageComponent } from './components/main-page/main-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { LoaderService } from './services/loader.service';
import { ResultsPageComponent } from './components/results-page/results-page.component';
import { GraphService } from './services/graph.service';
import { GraphComponent } from './components/graph/graph.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { BubbleChartComponent } from './components/bubble-chart/bubble-chart.component';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'graph', component: ResultsPageComponent}
  // { path: 'search', component: SearchComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    MainPageComponent,
    StatisticsComponent,
    BubbleChartComponent,
    ResultsPageComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [LoaderService, GraphService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
