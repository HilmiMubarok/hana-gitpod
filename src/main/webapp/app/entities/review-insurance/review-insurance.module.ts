import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ReviewInsuranceComponent } from './review-insurance.component';
import { ReviewInsuranceReviewRoute } from './review-insurance.route';
import { ReviewInsuranceDetailComponent } from './review-insurance-detail.component'; // import { PartyCifCustomerInfoComponent } from './customer-info/party-cif-customer-info.component';
import { LoanFacilityModule } from '../credit-proposal/loan-facility/loan-facility.module';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { InsuranceInformationModule } from '../insurance-information/insurance-information.module';
import { CollateralInfoCpModule } from '../credit-proposal/collateral-info/collateral-info-cp.module';
import { CreditProposalSummaryTabModule } from '../credit-proposal/summary/credit-proposal-tab-summary.module';
@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    LoanFacilityModule,
    ExposureModule,
    InsuranceInformationModule,
    CollateralInfoCpModule,
    CreditProposalSummaryTabModule,
    RouterModule.forChild(ReviewInsuranceReviewRoute),
  ],
  declarations: [ReviewInsuranceComponent, ReviewInsuranceDetailComponent],
  entryComponents: [ReviewInsuranceComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwIReviewInsuranceModule {}
