import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { DASHBOARD_ROUTE } from './dashboard.route';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { StatusSlidesComponent } from './status/status-slides.component';
import { ProgressStatusBarComponent } from './status/progress/progress-status-bar.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartsLayoutComponent } from './charts/charts-layout.component';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DashboardReusableCalendarComponent } from './misc-items/dashboard-reuseable-calendar.component';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([DASHBOARD_ROUTE]),
    // angular material
    MatCardModule,
    MatDividerModule,

    // syncfusion
    DashboardLayoutModule,

    // primeng
    CalendarModule,
    MultiSelectModule,
    CarouselModule,

    // charts
    NgChartsModule,
  ],
  declarations: [
    DashboardComponent,
    ChartsLayoutComponent,
    BarChartComponent,
    LineChartComponent,
    PieChartComponent,
    StatusSlidesComponent,
    ProgressStatusBarComponent,
    DashboardReusableCalendarComponent,
  ],
})
export class DashboardModule {}
