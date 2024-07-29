import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { DppkReviewComponent } from './dppk-review.component';
import { DppkReviewRoute } from './dppk-review.route';
import { DppkReviewDetailComponent } from './dppk-review-detail.component';
import { FinalizeCreditAgreementModule } from '../credit-agreement/finalize-credit-agreement/finalize-credit-agreement.module';
import { LoanFacilityModule } from '../credit-proposal/loan-facility/loan-facility.module';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { CollateralInfoCpModule } from '../credit-proposal/collateral-info/collateral-info-cp.module';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    FinalizeCreditAgreementModule,
    LoanFacilityModule,
    ExposureModule,
    CollateralInfoCpModule,
    RouterModule.forChild(DppkReviewRoute),
  ],
  declarations: [DppkReviewComponent, DppkReviewDetailComponent],
  entryComponents: [DppkReviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwIDppkReviewModule {}
