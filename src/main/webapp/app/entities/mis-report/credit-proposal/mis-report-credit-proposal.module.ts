import { NgModule } from '@angular/core';
import { MisReportCreditProposalComponent } from './mis-report-credit-proposal.component';
import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const route: Routes = [
  {
    path: '',
    component: MisReportCreditProposalComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: [MisReportCreditProposalComponent],
  providers: [],
  exports: [],
})
export class MisReportCreditProposalModule {}
