import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { DppkFinalizeComponent } from './dppk-finalize.component';
import { DppkFinalizeReviewRoute } from './dppk-finalize.route';
import { DppkFinalizeDetailComponent } from './dppk-finalize-detail.component';
import { FinalizeCreditAgreementModule } from '../credit-agreement/finalize-credit-agreement/finalize-credit-agreement.module';
import { CreditProposalTabSummaryModule } from '../credit-proposal/credit-proposal-tab-summary.module';
import { CompareDataModule } from '../compare-data/compare-data.module';
import { CreditProposalTabLoanFacilityDetailModule } from '../credit-proposal/loan-facility/credit-proposal-tab-loan-facility-detail.module';
import { CreditProposalMemoBandingModule } from '../credit-proposal/memo-banding/credit-proposal-memo-banding.module';
import { LoanAnalysComplianceModule } from '../loan-analys/compliance/loan-analys-compliance.module';
import { LoanAnalysOpinionCompliancePartModule } from '../loan-analys/opinion/loan-analys-opinion-compliance-part.module';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    FinalizeCreditAgreementModule,
    CreditProposalTabSummaryModule,
    CompareDataModule,
    CreditProposalTabLoanFacilityDetailModule,
    CreditProposalMemoBandingModule,
    LoanAnalysComplianceModule,
    LoanAnalysOpinionCompliancePartModule,
    RouterModule.forChild(DppkFinalizeReviewRoute),
  ],
  declarations: [DppkFinalizeComponent, DppkFinalizeDetailComponent],
  entryComponents: [DppkFinalizeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwIDppkFinalizeModule {}
