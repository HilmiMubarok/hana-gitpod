import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { DASHBOARD_ROUTE } from './dashboard.route';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import {
  CategoryService,
  DateTimeService,
  ScrollBarService,
  ColumnSeriesService,
  LineSeriesService,
  ChartAnnotationService,
  RangeColumnSeriesService,
  StackingColumnSeriesService,
  LegendService,
  TooltipService,
} from '@syncfusion/ej2-angular-charts';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([DASHBOARD_ROUTE]),
    // angular material
    MatCardModule,
    MatDividerModule,

    // syncfusion
    ChartModule,
  ],
  declarations: [DashboardComponent],
  providers: [
    CategoryService,
    DateTimeService,
    ScrollBarService,
    LineSeriesService,
    ColumnSeriesService,
    ChartAnnotationService,
    RangeColumnSeriesService,
    StackingColumnSeriesService,
    LegendService,
    TooltipService,
  ],
})
export class DashboardModule {}
