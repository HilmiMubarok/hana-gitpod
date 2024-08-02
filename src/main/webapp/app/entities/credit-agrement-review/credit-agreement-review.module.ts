import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CreditAgreementReviewComponent } from './credit-agreement-review.component';
import { CreditAgreementReviewDetailComponent } from './credit-agreement-review-detail.component';
import { creditAgrementReviewRoute } from './credit-agreement-review.route';
import { FinalizeCreditAgreementModule } from '../credit-agreement/finalize-credit-agreement/finalize-credit-agreement.module';
import { LoanFacilityModule } from '../credit-proposal/loan-facility/loan-facility.module';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { MemoBandingModule } from '../credit-proposal/memo-banding/memo-banding.module';
import { CollateralInfoCpModule } from '../credit-proposal/collateral-info/collateral-info-cp.module';
import { CreditProposalGeneratePkReport } from '../credit-proposal/generate-document-pk-report/credit-proposal-generate-pk-report.module';
import { CreditProposalSummaryTabModule } from '../credit-proposal/summary/credit-proposal-tab-summary.module';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    FinalizeCreditAgreementModule,
    LoanFacilityModule,
    CollateralInfoCpModule,
    ExposureModule,
    MemoBandingModule,
    CreditProposalSummaryTabModule,
    CreditProposalGeneratePkReport,
    RouterModule.forChild(creditAgrementReviewRoute),
  ],
  declarations: [CreditAgreementReviewComponent, CreditAgreementReviewDetailComponent],
  entryComponents: [CreditAgreementReviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditAgreementReviewModule {}
