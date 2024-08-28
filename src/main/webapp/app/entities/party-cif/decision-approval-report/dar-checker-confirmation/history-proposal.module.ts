import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';

import { OfferingLetterRoute } from './history-poposal.route';
import { HistoryProposalComponent } from './history-poposal.component';
import { RepaymentSpreadsheetModule } from 'app/entities/credit-proposal/repayment-spreadsheet/repayment-spreadsheet.module';
import { CreditProposalProposePricingModule } from 'app/entities/credit-proposal/propose-pricing/credit-proposal-propose-pricing.module';
import { CreditProposalTabManagementInfoModule } from 'app/entities/credit-proposal/credit-proposal-tab-management-info.module';
import { CreditProposalTabSummaryModule } from 'app/entities/credit-proposal/credit-proposal-tab-summary.module';
import { BasicInformationViewMoodule } from 'app/entities/credit-proposal/basic-information/basic-information-view.module';
import { CreditProposalTabBusinessActivityModule } from 'app/entities/credit-proposal/busines-activity/credit-proposal-tab-business-activity.module';
import { CreditProposalCollateralInfoModule } from 'app/entities/credit-proposal/collateral-info/credit-proposal-collateral-info.module';
import { CreditProposalTabLoanFacilityDetailModule } from 'app/entities/credit-proposal/loan-facility/credit-proposal-tab-loan-facility-detail.module';
import { LoanFacilityDetailHistoryModule } from 'app/entities/credit-proposal/loan-facility-history/loan-facility-detail-history.module';
import { CreditProposalMemoBandingModule } from 'app/entities/credit-proposal/memo-banding/credit-proposal-memo-banding.module';
import { LoanAnalysComplianceModule } from 'app/entities/loan-analys/compliance/loan-analys-compliance.module';
import { LoanAnalysOpinionCompliancePartModule } from 'app/entities/loan-analys/opinion/loan-analys-opinion-compliance-part.module';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    RepaymentSpreadsheetModule,
    CreditProposalProposePricingModule,
    CreditProposalTabManagementInfoModule,
    CreditProposalTabSummaryModule,
    BasicInformationViewMoodule,
    CreditProposalTabBusinessActivityModule,
    CreditProposalCollateralInfoModule,
    CreditProposalTabLoanFacilityDetailModule,
    LoanFacilityDetailHistoryModule,
    CreditProposalMemoBandingModule,
    LoanAnalysComplianceModule,
    LoanAnalysOpinionCompliancePartModule,
    RouterModule.forChild(OfferingLetterRoute),
  ],
  declarations: [HistoryProposalComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwHistoryProposalModule {}
