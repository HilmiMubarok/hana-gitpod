import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DashboardLegalComponent } from './dashboard-legal.component';
import { YearlyReportComponent } from './yearly-report/yearly-report.component';
import { SharedModule } from 'app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MisDashboardModule } from '../mis-dashboard/mis-dashboard.module';
import { WeeklyReportComponent } from './weekly-report/weekly-report.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLegalComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.slaReviewer.home.title',
    },
  },
];

@NgModule({
  declarations: [DashboardLegalComponent, YearlyReportComponent, WeeklyReportComponent],
  imports: [SharedModule, MisDashboardModule, RouterModule.forChild(routes)],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardLegalModule {}
