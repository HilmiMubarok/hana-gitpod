import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LoanOperationComponent } from './loan-operation.component';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from '../shared-entity.module';
import { RouterModule } from '@angular/router';
import { LoanOperationRoute } from './loan-operation.router';
import { LoanOperationDetailComponent } from './loan-operation-detail.component';
import { FinalizeCreditAgreementModule } from '../credit-agreement/finalize-credit-agreement/finalize-credit-agreement.module';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { MemoBandingModule } from '../credit-proposal/memo-banding/memo-banding.module';
import { InsuranceInformationModule } from '../insurance-information/insurance-information.module';
import { CreditProposalSummaryTabModule } from '../credit-proposal/summary/credit-proposal-tab-summary.module';
import { CollateralInfoLoanOpsModule } from './collateral-info/collateral-info-loan-ops.module';
import { LoanAnalysOpinionModule } from '../loan-analys/opinion/loan-analys-opinion.module';
import { LoanAnalysComplianceModule } from '../loan-analys/compliance/loan-analys-compliance.module';
import { LoanOperationLoanFacilityDetailModule } from './loan-facility-detail/loan-operation-loan-facility-detail.module';
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
    RouterModule.forChild(LoanOperationRoute),
  ],
  declarations: [LoanOperationComponent, LoanOperationDetailComponent],
  entryComponents: [LoanOperationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanOperationModule {}
