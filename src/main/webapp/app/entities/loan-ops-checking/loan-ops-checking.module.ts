import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from '../shared-entity.module';
import { RouterModule } from '@angular/router';
import { LoanOpsCheckingRoute } from './loan-ops-checking.router';
import { LoanOpsCheckingDetailComponent } from './loan-ops-checking-detail.component';
import { LoanOpsCheckingComponent } from './loan-ops-checking.component';
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
    FinalizeCreditAgreementModule,
    CreditProposalTabSummaryModule,
    CompareDataModule,
    CreditProposalMemoBandingModule,
    LoanAnalysComplianceModule,
    LoanAnalysOpinionCompliancePartModule,
    CollateralInfoLoanOpsModule,
    LoanOperationLoanFacilityDetailModule,
    RouterModule.forChild(LoanOpsCheckingRoute),
  ],
  declarations: [LoanOpsCheckingComponent, LoanOpsCheckingDetailComponent],
  entryComponents: [LoanOpsCheckingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanOpsCheckingModule {}
