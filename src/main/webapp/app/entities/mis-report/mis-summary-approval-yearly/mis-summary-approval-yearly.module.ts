import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SharedModule } from 'app/shared/shared.module';
import { MisSummaryApprovalYearlyComponent } from './mis-summary-approval-yearly.component';

const route: Routes = [
  {
    path: '',
    component: MisSummaryApprovalYearlyComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(route)],
  declarations: [MisSummaryApprovalYearlyComponent],
  providers: [],
  exports: [],
})
export class MisSummaryApprovalYearlyModule {}
