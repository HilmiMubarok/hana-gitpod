import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { LoanAnalysComponent } from './loan-analys.component';
import { LoanAnalysMainComponent } from './loan-analys-main.component';
import { LoanAnalysBatchBulkAssignComponent } from './loan-analys-batch-bulk-assign.component';
// import { LoanAnalysRoute } from './loan-analys.route';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreditProposalResolve } from '../credit-proposal/credit-proposal.route';

export const LoanAnalysRoute: Routes = [
  {
    path: '',
    component: LoanAnalysComponent,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/assign',
    component: LoanAnalysMainComponent,
    resolve: {
      loanAnalys: CreditProposalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'batch-bulk-assign',
    component: LoanAnalysBatchBulkAssignComponent,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(LoanAnalysRoute)],
  declarations: [LoanAnalysComponent, LoanAnalysMainComponent, LoanAnalysBatchBulkAssignComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CreditProposalResolve],
})
export class LosgwLoanAnalysModule {}
