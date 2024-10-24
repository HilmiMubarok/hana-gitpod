import { Component, NgModule } from '@angular/core';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RouterModule, Routes } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { MisReportCreditProposalDeviationComponent } from './mis-report-credit-proposal-deviation.component';

const cpfRoute: Routes = [
  {
    path: '',
    component: MisReportCreditProposalDeviationComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];
@NgModule({
  imports: [SharedModule, RouterModule.forChild(cpfRoute)],
  declarations: [MisReportCreditProposalDeviationComponent],
  providers: [],
  exports: [],
})
export class MisReportCreditProposalDeviationModule {}
