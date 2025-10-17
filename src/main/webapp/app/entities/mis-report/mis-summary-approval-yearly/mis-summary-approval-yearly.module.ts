import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SharedModule } from 'app/shared/shared.module';

import { MisMonthlySummaryApprovalComponent } from './mothly/mis-monthly-report.component';
import { MisSummaryApprovalParentComponent } from './mis-summary-approval-parent.component';
import { MisSummaryApprovalYearlyComponent } from './yearly/mis-summary-approval-yearly.component';

const route: Routes = [
  {
    path: '',
    component: MisSummaryApprovalParentComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(route)],
  declarations: [MisSummaryApprovalYearlyComponent, MisMonthlySummaryApprovalComponent, MisSummaryApprovalParentComponent],
  providers: [],
  exports: [],
})
export class MisSummaryApprovalYearlyModule {}
