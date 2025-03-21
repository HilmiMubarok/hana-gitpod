import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MisDashboardBarChartComponent } from './mis-dashboard-bar-chart.component';
import { MisDashboardCardStatisticComponent } from './mis-dashboard-card-statistic.component';
import { MisDashboardCardComponent } from './mis-dashboard-card.component';

@NgModule({
  imports: [SharedModule],
  declarations: [MisDashboardBarChartComponent, MisDashboardCardStatisticComponent, MisDashboardCardComponent],
  exports: [MisDashboardBarChartComponent, MisDashboardCardStatisticComponent, MisDashboardCardComponent],
})
export class MisDashboardModule { }
