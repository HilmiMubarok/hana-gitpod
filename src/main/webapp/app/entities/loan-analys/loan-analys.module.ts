import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { LoanAnalysComponent } from './loan-analys.component';
import { LoanAnalysMComponent } from './loan-analys-m.component';
import { LoanAnalysMainComponent } from './loan-analys-main.component';
import { LoanAnalysBatchBulkAssignComponent } from './loan-analys-batch-bulk-assign.component';
import { LoanAnalysRoute } from './loan-analys.route';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreditProposalResolve } from '../credit-proposal/credit-proposal.route';

import { LoanAnalysSlikMainComponent } from './slik/loan-analys-slik-main.component';
import { LoanAnalysOpinionComponent } from './opinion/loan-analys-opinion.component';
import { LoanAnalysDialogOpinionComponent } from './dialogs/loan-analys-dialog-opinion.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(LoanAnalysRoute)],
  declarations: [
    LoanAnalysComponent,
    LoanAnalysMComponent,
    LoanAnalysMainComponent,
    LoanAnalysBatchBulkAssignComponent,
    LoanAnalysSlikMainComponent,
    LoanAnalysOpinionComponent,
    LoanAnalysDialogOpinionComponent
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanAnalysModule {}
