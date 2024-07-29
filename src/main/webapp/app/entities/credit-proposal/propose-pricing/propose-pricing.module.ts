import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProposePricingLoanFacilityDetailComponent } from './propose-pricing-loan-facility-detail.component';
import { CreditProposalProposePricingComponent } from './credit-proposal-propose-pricing.component';
import { ProposePricingLoanFacilityDetailDialogComponent } from './propose-pricing-loan-facility-detail-dialog.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    CreditProposalProposePricingComponent,
    ProposePricingLoanFacilityDetailComponent,
    ProposePricingLoanFacilityDetailDialogComponent,
  ],
  exports: [
    CreditProposalProposePricingComponent,
    ProposePricingLoanFacilityDetailComponent,
    ProposePricingLoanFacilityDetailDialogComponent,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProposePricingModule {}
