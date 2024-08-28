import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { LoanAnalysComponent } from './loan-analys.component';
import { LoanAnalysMComponent } from './loan-analys-m.component';
import { LoanAnalysMainComponent } from './loan-analys-main.component';
import { LoanAnalysBatchBulkAssignComponent } from './loan-analys-batch-bulk-assign.component';
import { LoanAnalysRoute } from './loan-analys.route';

import { LoanAnalysSlikMainComponent } from './slik/loan-analys-slik-main.component';
import { LoanAnalysSlikSummaryComponent } from './slik-summary/loan-analys-slik-summary.component';
import { LoanAnalysCreditRatingViewComponent } from './credit-rating/loan-analys-credit-rating-view.component';
import { LoanAnalysFacilityDetailGridDarNotifComponent } from './dar-notif/loan-facility/grid/loan-analys-facility-detail-grid-dar-notif.component';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CreditProposalPersonalInfoAnalystComponent } from './personal-info.component';
import { RepaymentSpreadsheetModule } from '../credit-proposal/repayment-spreadsheet/repayment-spreadsheet.module';
import { CreditProposalProposePricingModule } from '../credit-proposal/propose-pricing/credit-proposal-propose-pricing.module';
import { CreditProposalTabManagementInfoModule } from '../credit-proposal/credit-proposal-tab-management-info.module';
import { CreditProposalTabSummaryModule } from '../credit-proposal/credit-proposal-tab-summary.module';
import { BasicInformationViewMoodule } from '../credit-proposal/basic-information/basic-information-view.module';
import { CreditProposalTabBusinessActivityModule } from '../credit-proposal/busines-activity/credit-proposal-tab-business-activity.module';
import { CreditProposalCollateralInfoModule } from '../credit-proposal/collateral-info/credit-proposal-collateral-info.module';
import { LoanAnalysPreviousDarComponent } from './previous/previous-dar/loan-analys-previous-dar.component';
import { LoanAnalysPreviousProposalComponent } from './previous/previous-proposal/loan-analys-previous-proposal.component';
import { CollateralInfoHistoryModule } from '../credit-proposal/collateral-info-history/collateral-info-history.module';
import { CreditProposalGroupGuarantorAnalysisModule } from '../credit-proposal/guarantour/credit-proposal-group-guarantor-analysis.module';
import { CreditProposalTabLoanFacilityDetailModule } from '../credit-proposal/loan-facility/credit-proposal-tab-loan-facility-detail.module';
import { LoanFacilityDetailHistoryModule } from '../credit-proposal/loan-facility-history/loan-facility-detail-history.module';
import { CreditProposalMemoBandingModule } from '../credit-proposal/memo-banding/credit-proposal-memo-banding.module';
import { CreditProposalTradeCheckingRemarksModule } from '../credit-proposal/trade-checking/Remarks/credit-proposal-trade-checking-remarks.module';
import { LoanAnalysComplianceModule } from './compliance/loan-analys-compliance.module';
import { CreditProposalTabLoanFacilityDetaiTemplModule } from './dar-final/loan-facility/credit-proposal-tab-loan-facility-detail.module';
import { LoanAnalysOpinionCompliancePartModule } from './opinion/loan-analys-opinion-compliance-part.module';

@NgModule({
  imports: [
    SharedModule,
    SharedLibsModule,
    SharedEntityModule,
    RepaymentSpreadsheetModule,
    CreditProposalProposePricingModule,
    CreditProposalTabManagementInfoModule,
    CreditProposalTabSummaryModule,
    BasicInformationViewMoodule,
    CreditProposalTabBusinessActivityModule,
    CreditProposalCollateralInfoModule,
    CollateralInfoHistoryModule,
    CreditProposalGroupGuarantorAnalysisModule,
    CreditProposalTabLoanFacilityDetailModule,
    LoanFacilityDetailHistoryModule,
    CreditProposalMemoBandingModule,
    CreditProposalTradeCheckingRemarksModule,
    LoanAnalysComplianceModule,
    CreditProposalTabLoanFacilityDetaiTemplModule,
    LoanAnalysOpinionCompliancePartModule,
    RouterModule.forChild(LoanAnalysRoute),
    MatSlideToggleModule,
  ],
  declarations: [
    LoanAnalysComponent,
    LoanAnalysMComponent,
    LoanAnalysMainComponent,
    CreditProposalPersonalInfoAnalystComponent,
    LoanAnalysBatchBulkAssignComponent,
    LoanAnalysSlikMainComponent,
    LoanAnalysSlikSummaryComponent,
    LoanAnalysCreditRatingViewComponent,
    LoanAnalysFacilityDetailGridDarNotifComponent,
    LoanAnalysPreviousDarComponent,
    LoanAnalysPreviousProposalComponent,
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanAnalysModule {}
