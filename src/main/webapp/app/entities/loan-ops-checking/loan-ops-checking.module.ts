import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from '../shared-entity.module';
import { RouterModule } from '@angular/router';
import { LoanOpsCheckingRoute } from './loan-ops-checking.router';
import { LoanOpsCheckingDetailComponent } from './loan-ops-checking-detail.component';
import { LoanOpsCheckingComponent } from './loan-ops-checking.component';
import { FinalizeCreditAgreementModule } from '../credit-agreement/finalize-credit-agreement/finalize-credit-agreement.module';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { MemoBandingModule } from '../credit-proposal/memo-banding/memo-banding.module';
import { InsuranceInformationModule } from '../insurance-information/insurance-information.module';
import { CreditProposalSummaryTabModule } from '../credit-proposal/summary/credit-proposal-tab-summary.module';
import { CollateralInfoLoanOpsModule } from '../loan-operation/collateral-info/collateral-info-loan-ops.module';
import { LoanAnalysOpinionModule } from '../loan-analys/opinion/loan-analys-opinion.module';
import { LoanAnalysComplianceModule } from '../loan-analys/compliance/loan-analys-compliance.module';
import { LoanOperationLoanFacilityDetailModule } from '../loan-operation/loan-facility-detail/loan-operation-loan-facility-detail.module';
import { CollateralInfoCpModule } from '../credit-proposal/collateral-info/collateral-info-cp.module';
import { ProposalBasicInformationViewModule } from '../credit-proposal/basic-information/basic-information-view.module';
@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    FinalizeCreditAgreementModule,
    ExposureModule,
    MemoBandingModule,
    InsuranceInformationModule,
    CreditProposalSummaryTabModule,
    CollateralInfoLoanOpsModule,
    LoanAnalysOpinionModule,
    LoanAnalysComplianceModule,
    LoanOperationLoanFacilityDetailModule,
    CollateralInfoCpModule,
    ProposalBasicInformationViewModule,
    RouterModule.forChild(LoanOpsCheckingRoute),
  ],
  declarations: [LoanOpsCheckingComponent, LoanOpsCheckingDetailComponent],
  entryComponents: [LoanOpsCheckingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanOpsCheckingModule {}
