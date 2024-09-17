import { Component, NgModule } from '@angular/core';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RouterModule, Routes } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { MisReportCreditProposalCollateralComponent } from './mis-report-credit-proposal-collateral.component';

const cpfRoute: Routes = [
  {
    path: '',
    component: MisReportCreditProposalCollateralComponent,
    canActivate: [UserRouteAccessService],
    data: {
      pageTitle: 'losgwApp.creditProposal.home.title',
    },
  },
];
@NgModule({
  imports: [SharedModule, RouterModule.forChild(cpfRoute)],
  declarations: [MisReportCreditProposalCollateralComponent],
  providers: [],
  exports: [],
})
export class MisReportCreditProposalCollateralModule {}
