import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CreditAgreementComponent } from './credit-agreement.component';
import { creditAgrementReviewRoute } from './credit-agreement.route';
import { CreditAgreementDetailComponent } from './credit-agreementdetail.component';
import { FinalizeCreditAgreementModule } from './finalize-credit-agreement/finalize-credit-agreement.module';
import { LoanFacilityModule } from '../credit-proposal/loan-facility/loan-facility.module';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { MemoBandingModule } from '../credit-proposal/memo-banding/memo-banding.module';
import { CollateralInfoCpModule } from '../credit-proposal/collateral-info/collateral-info-cp.module';
import { CreditProposalSummaryTabModule } from '../credit-proposal/summary/credit-proposal-tab-summary.module';
import { LoanAnalysOpinionModule } from '../loan-analys/opinion/loan-analys-opinion.module';
import { LoanAnalysComplianceModule } from '../loan-analys/compliance/loan-analys-compliance.module';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    FinalizeCreditAgreementModule,
    LoanFacilityModule,
    ExposureModule,
    MemoBandingModule,
    CollateralInfoCpModule,
    CreditProposalSummaryTabModule,
    LoanAnalysOpinionModule,
    LoanAnalysComplianceModule,
    RouterModule.forChild(creditAgrementReviewRoute),
  ],
  declarations: [CreditAgreementComponent, CreditAgreementDetailComponent],
  entryComponents: [CreditAgreementComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditAgreementModule {}
