import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { OfferingLetterComponent } from './offering-letter.component';
import { OfferingLetterMainComponent } from './offering-letter-main.component';
import { OfferingLetterRoute } from './offering-letter.route';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreditProposalResolve } from '../credit-proposal/credit-proposal.route';

import { OfferingLetterOfferingPageComponent } from './offering-page/offering-page.component';
import { OfferingLetterTabCovenantComponent } from './covenant-document/offering-letter-tab-covenant.component';
import { OfferingLetterTabCovenantDeviationComponent } from './covenant-deviation/offering-letter-tab-covenant-deviation.component';
import { CompareApprovalReportComponent } from './compare-approval-report/compare-approval-report.component';
import { CertificateInfoDialogComponent } from './certificate-info/certificate-info-dialog.component';
import { RepaymentSpreadsheetModule } from '../credit-proposal/repayment-spreadsheet/repayment-spreadsheet.module';
import { CreditProposalProposePricingModule } from '../credit-proposal/propose-pricing/credit-proposal-propose-pricing.module';
import { CreditProposalTabManagementInfoModule } from '../credit-proposal/credit-proposal-tab-management-info.module';
import { CreditProposalTabSummaryModule } from '../credit-proposal/credit-proposal-tab-summary.module';
import { BasicInformationViewMoodule } from '../credit-proposal/basic-information/basic-information-view.module';
import { CreditProposalTabBusinessActivityModule } from '../credit-proposal/busines-activity/credit-proposal-tab-business-activity.module';
import { CreditProposalCollateralInfoModule } from '../credit-proposal/collateral-info/credit-proposal-collateral-info.module';
import { CollateralInfoHistoryModule } from '../credit-proposal/collateral-info-history/collateral-info-history.module';
import { CreditProposalTabLoanFacilityDetailModule } from '../credit-proposal/loan-facility/credit-proposal-tab-loan-facility-detail.module';
import { LoanFacilityDetailHistoryModule } from '../credit-proposal/loan-facility-history/loan-facility-detail-history.module';
import { CreditProposalMemoBandingModule } from '../credit-proposal/memo-banding/credit-proposal-memo-banding.module';
import { LoanAnalysComplianceModule } from '../loan-analys/compliance/loan-analys-compliance.module';
import { LoanAnalysOpinionCompliancePartModule } from '../loan-analys/opinion/loan-analys-opinion-compliance-part.module';

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
    CollateralInfoHistoryModule,
    CreditProposalCollateralInfoModule,
    CreditProposalTabLoanFacilityDetailModule,
    LoanFacilityDetailHistoryModule,
    CreditProposalMemoBandingModule,
    LoanAnalysComplianceModule,
    LoanAnalysOpinionCompliancePartModule,
    RouterModule.forChild(OfferingLetterRoute),
  ],
  declarations: [
    OfferingLetterComponent,
    OfferingLetterMainComponent,
    OfferingLetterOfferingPageComponent,
    OfferingLetterTabCovenantComponent,
    OfferingLetterTabCovenantDeviationComponent,
    CompareApprovalReportComponent,
    CertificateInfoDialogComponent,
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwOfferingLetterModule {}
