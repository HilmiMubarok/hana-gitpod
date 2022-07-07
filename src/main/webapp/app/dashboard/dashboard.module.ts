import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { DASHBOARD_ROUTE } from './dashboard.route';
import { MatCardModule } from '@angular/material/card';
// import { NgChartsModule } from 'ng2-charts';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([DASHBOARD_ROUTE]),
    // angular material
    MatCardModule,
    MatDividerModule,

    // ng2-charts
    // NgChartsModule,
  ],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
