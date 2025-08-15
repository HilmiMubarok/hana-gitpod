import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SharedModule } from 'app/shared/shared.module';
import { MisCreditProposalTimelineSummaryComponent } from './mis-credit-proposal-timeline-summary.component';

const route: Routes = [
  {
    path: '',
    component: MisCreditProposalTimelineSummaryComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(route)],
  declarations: [MisCreditProposalTimelineSummaryComponent],
  providers: [],
  exports: [],
})
export class MisCreditProposalTimelineSummaryModule {}
