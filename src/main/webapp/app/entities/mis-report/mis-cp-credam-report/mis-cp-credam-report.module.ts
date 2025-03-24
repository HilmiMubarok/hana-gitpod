import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardCredamComponent } from './dashboard/credit-admin/mis-dashboard-credit-admin.component';
import { MisDashboardCreditInsuranceComponent } from './dashboard/credit-insurance/mis-dashboard-credit-insurance.component';
import { MisCpCredamReportComponent } from './mis-cp-credam-report.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MisReportCreditProposalCredamComponent } from './report/mis-report-credit-proposal-credam.component';
import { MisDashboardModule } from '../mis-dashboard/mis-dashboard.module';
import { SharedModule } from 'app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MisCpCredamReportComponent,
    canActivate: [UserRouteAccessService],
    children: [
      {
        path: 'dashboard',
        children: [
          { path: 'credit-admin', component: DashboardCredamComponent },
          { path: 'credit-insurance', component: MisDashboardCreditInsuranceComponent },
        ],
      },
      { path: 'report', component: MisReportCreditProposalCredamComponent },
    ],
  },
];

@NgModule({
  imports: [SharedModule, MisDashboardModule, RouterModule.forChild(routes)],
  declarations: [
    MisCpCredamReportComponent,
    MisDashboardCreditInsuranceComponent,
    DashboardCredamComponent,
    MisReportCreditProposalCredamComponent,
  ],
})
export class MisCpCredamReportRoutingModule {}
