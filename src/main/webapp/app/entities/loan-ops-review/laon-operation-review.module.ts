import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LoanOpsReviewComponent } from './laon-operation-review.component';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from '../shared-entity.module';
import { RouterModule } from '@angular/router';
import { LoanOpsReviewRoute } from './laon-operation-review.router';
import { LoanOpsReviewDetailComponent } from './laon-operation-review-detail.component';
import { FormsModule } from '@angular/forms';
import { FinalizeCreditAgreementModule } from '../credit-agreement/finalize-credit-agreement/finalize-credit-agreement.module';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { MemoBandingModule } from '../credit-proposal/memo-banding/memo-banding.module';
import { InsuranceInformationModule } from '../insurance-information/insurance-information.module';
import { CreditProposalSummaryTabModule } from '../credit-proposal/summary/credit-proposal-tab-summary.module';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    FormsModule,
    FinalizeCreditAgreementModule,
    ExposureModule,
    MemoBandingModule,
    InsuranceInformationModule,
    CreditProposalSummaryTabModule,
    RouterModule.forChild(LoanOpsReviewRoute),
  ],
  declarations: [LoanOpsReviewComponent, LoanOpsReviewDetailComponent],
  entryComponents: [LoanOpsReviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanOpsReviewModule {}
