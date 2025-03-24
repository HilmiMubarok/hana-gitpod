import { Component, NgModule } from '@angular/core';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RouterModule, Routes } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { MisReportCreditProposalCredamComponent } from './mis-report-credit-proposal-credam.component';
const cpfRoute: Routes = [
  {
    path: '',
    component: MisReportCreditProposalCredamComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];
@NgModule({
  imports: [SharedModule, RouterModule.forChild(cpfRoute)],
  declarations: [],
  providers: [],
  exports: [],
})
export class MisReportCreditProposalCredamModule {}
