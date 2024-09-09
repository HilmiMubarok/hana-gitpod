import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SharedModule } from 'app/shared/shared.module';
import { MisCreditProposalTimelineComponent } from './mis-credit-proposal-timeline.component';

const route: Routes = [
  {
    path: '',
    component: MisCreditProposalTimelineComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(route)],
  declarations: [MisCreditProposalTimelineComponent],
  providers: [],
  exports: [],
})
export class MisCreditProposalTimelineModule {}
