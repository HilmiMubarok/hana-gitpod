import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MisDashboardBarChartComponent } from './mis-dashboard-bar-chart.component';
import { MisDashboardCardStatisticComponent } from './mis-dashboard-card-statistic.component';
import { MisDashboardCardComponent } from './mis-dashboard-card.component';
import { MisDashboardProductivityComponent } from './mis-dashboard-productivity.component';

@NgModule({
  imports: [SharedModule],
  declarations: [MisDashboardBarChartComponent, MisDashboardCardStatisticComponent, MisDashboardCardComponent, MisDashboardProductivityComponent],
  exports: [MisDashboardBarChartComponent, MisDashboardCardStatisticComponent, MisDashboardCardComponent, MisDashboardProductivityComponent],
})
export class MisDashboardModule { }
