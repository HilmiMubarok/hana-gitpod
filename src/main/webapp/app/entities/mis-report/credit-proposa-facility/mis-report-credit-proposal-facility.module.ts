import { Component, NgModule } from '@angular/core';
import { MisReportCreditProposalFacilityComponent } from './mis-report-credit-proposal-facility.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RouterModule, Routes } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';

const cpfRoute: Routes = [
  {
    path: '',
    component: MisReportCreditProposalFacilityComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];
@NgModule({
  imports: [SharedModule, RouterModule.forChild(cpfRoute)],
  declarations: [MisReportCreditProposalFacilityComponent],
  providers: [],
  exports: [],
})
export class MisReportCreditProposalFacilityModule {}
