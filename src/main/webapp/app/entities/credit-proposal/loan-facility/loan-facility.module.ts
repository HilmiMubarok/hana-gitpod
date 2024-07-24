import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CreditProposalTabLoanFacilityDetailComponent } from './credit-proposal-tab-loan-facility-detail.component';
import { CreditProposalTabLoanFacilityDetailGridComponent } from './grid/credit-proposal-tab-loan-facility-detail.grid.component';
import { MainFacilityComponent } from './main-facility/main-facility.component';
import { MainFacilityChildComponent } from './main-facility/main-facility-child.component';
import { CreditProposalMappingCollateralComponent } from './mapping/mapping-collateral.component';
import { CreditProposalMappingFacilityComponent } from './mapping/mapping-facility.component';
import { LoanFacilityDetailCalculationComponent } from './summary-loan-facility-detail/loan-facility-detail-calculation.component';
import { SummaryLoanFacilityDetailComponent } from './summary-loan-facility-detail/summary-loan-facility-detail.component';
import { CreditProposalCollateralTabLoanComponent } from './take-over/collateral/credit-proposal-collateral-tab-loan.component';
import { CreditProposalTabLoanFacilityTakeOverComponent } from './take-over/credit-proposal-tab-loan-facility-take-over.component';
import { CreditProposalTabLoanFacilityTakeOverGridComponent } from './take-over/credit-proposal-tab-loan-facility-take-over.grid.component';
import { CreditProposalCollateralTabLoanAfterComponent } from './take-over-after/collateral/credit-proposal-collateral-tab-loan-after.component';
import { CreditProposalTabLoanFacilityTakeOverAfterComponent } from './take-over-after/credit-proposal-tab-loan-facility-take-over-after.component';
import { CreditProposalTabLoanFacilityTakeOverAfterGridComponent } from './take-over-after/credit-proposal-tab-loan-facility-take-over-after.grid.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    CreditProposalTabLoanFacilityDetailComponent,
    CreditProposalTabLoanFacilityDetailGridComponent,
    CreditProposalMappingCollateralComponent,
    MainFacilityComponent,
    MainFacilityChildComponent,
    CreditProposalMappingFacilityComponent,
    LoanFacilityDetailCalculationComponent,
    SummaryLoanFacilityDetailComponent,
    CreditProposalCollateralTabLoanComponent,
    CreditProposalTabLoanFacilityTakeOverComponent,
    CreditProposalTabLoanFacilityTakeOverGridComponent,
    CreditProposalCollateralTabLoanAfterComponent,
    CreditProposalTabLoanFacilityTakeOverAfterComponent,
    CreditProposalTabLoanFacilityTakeOverAfterGridComponent,
  ],
  exports: [
    CreditProposalTabLoanFacilityDetailComponent,
    CreditProposalTabLoanFacilityDetailGridComponent,
    CreditProposalMappingCollateralComponent,
    MainFacilityComponent,
    MainFacilityChildComponent,
    CreditProposalMappingFacilityComponent,
    LoanFacilityDetailCalculationComponent,
    SummaryLoanFacilityDetailComponent,
    CreditProposalCollateralTabLoanComponent,
    CreditProposalTabLoanFacilityTakeOverComponent,
    CreditProposalTabLoanFacilityTakeOverGridComponent,
    CreditProposalCollateralTabLoanAfterComponent,
    CreditProposalTabLoanFacilityTakeOverAfterComponent,
    CreditProposalTabLoanFacilityTakeOverAfterGridComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class LoanFacilityModule {}
