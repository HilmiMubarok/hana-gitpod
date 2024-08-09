import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LoanOpsReviewComponent } from './laon-operation-review.component';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from '../shared-entity.module';
import { RouterModule } from '@angular/router';
import { LoanOpsReviewRoute } from './laon-operation-review.router';
import { LoanOpsReviewDetailComponent } from './laon-operation-review-detail.component';
import { FormsModule } from '@angular/forms';
import { FinalizeCreditAgreementModule } from '../credit-agreement/finalize-credit-agreement/finalize-credit-agreement.module';
import { CreditProposalTabSummaryModule } from '../credit-proposal/credit-proposal-tab-summary.module';
import { CompareDataModule } from '../compare-data/compare-data.module';
import { CreditProposalMemoBandingModule } from '../credit-proposal/memo-banding/credit-proposal-memo-banding.module';
import { LoanAnalysComplianceModule } from '../loan-analys/compliance/loan-analys-compliance.module';
import { LoanAnalysOpinionCompliancePartModule } from '../loan-analys/opinion/loan-analys-opinion-compliance-part.module';
import { CollateralInfoLoanOpsModule } from '../loan-operation/collateral-info/collateral-info-loan-ops.module';
import { LoanOperationLoanFacilityDetailModule } from '../loan-operation/loan-facility-detail/loan-operation-loan-facility-detail.module';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    FormsModule,
    FinalizeCreditAgreementModule,
    CreditProposalTabSummaryModule,
    CompareDataModule,
    CreditProposalMemoBandingModule,
    LoanAnalysComplianceModule,
    LoanAnalysOpinionCompliancePartModule,
    CollateralInfoLoanOpsModule,
    LoanOperationLoanFacilityDetailModule,
    RouterModule.forChild(LoanOpsReviewRoute),
  ],
  declarations: [LoanOpsReviewComponent, LoanOpsReviewDetailComponent],
  entryComponents: [LoanOpsReviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanOpsReviewModule {}
