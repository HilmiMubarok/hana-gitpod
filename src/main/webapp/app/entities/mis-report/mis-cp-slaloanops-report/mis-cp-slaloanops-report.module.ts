import { NgModule } from '@angular/core';
import { MisCpSlaloanopsReportComponent } from './mis-cp-slaloanops-report.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MisLoanOpsReportComponent } from './report/mis-loan-ops-report.component';
import { MisDashboardModule } from '../mis-dashboard/mis-dashboard.module';
import { MisCpSlaLoanOpsDashboardComponent } from './mis-cp-slaloanops-dashboard.component';
import { MisCpSlaloanopsDashboardProductivityComponent } from './mis-cp-slaloanops-dashboard-productivity.component';

const routes: Routes = [
  {
    path: '',
    component: MisCpSlaloanopsReportComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.slaReviewer.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, MisDashboardModule, RouterModule.forChild(routes)],
  declarations: [
    MisCpSlaloanopsReportComponent,
    MisLoanOpsReportComponent,
    MisCpSlaLoanOpsDashboardComponent,
    MisCpSlaloanopsDashboardProductivityComponent
  ],
})
export class MisCpSlaloanopsReportModule { }
