import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { InsuranceCheckingComponent } from './insurance-checking.component';
import { InsuranceCheckingRoute } from './insurance-checking.route';
import { InsuranceCheckingDetailComponent } from './insurance-checking-detail.component'; // import { PartyCifCustomerInfoComponent } from './customer-info/party-cif-customer-info.component';
import { CreditProposalTabSummaryModule } from '../credit-proposal/credit-proposal-tab-summary.module';
import { CreditProposalCollateralInfoModule } from '../credit-proposal/collateral-info/credit-proposal-collateral-info.module';
import { CreditProposalTabLoanFacilityDetailModule } from '../credit-proposal/loan-facility/credit-proposal-tab-loan-facility-detail.module';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    CreditProposalTabSummaryModule,
    CreditProposalCollateralInfoModule,
    CreditProposalTabLoanFacilityDetailModule,
    RouterModule.forChild(InsuranceCheckingRoute),
  ],
  declarations: [InsuranceCheckingComponent, InsuranceCheckingDetailComponent],
  entryComponents: [InsuranceCheckingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwInsuranceCheckingModule {}
