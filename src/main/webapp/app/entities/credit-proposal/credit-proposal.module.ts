import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { creditProposalRoute } from './credit-proposal.route';
import { CreditProposalUpdateCustomComponent } from './credit-proposal-update-custom.component';
import { CreditProposalComponent } from './credit-proposal.component';

import { PageService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';
import { SharedLibsModule } from 'app/shared/shared-libs.module';

import { CreditProposalAnchorComponent } from './credit-proposal-anchor.component';
import { CreditProposalListComponent } from './credit-proposal-list.component';
import { CreditProposalTabCollateralInfoListComponent } from './collateral/credit-proposal-tab-collateral-info-list.component';
import { CreditProposalFinancialStatementComponent } from './financial-statement/credit-proposal-financial-statement.component';
import { ProposalBasicInformationComponent } from './proposal-basic-information.component';
import { CreditProposalBankAccountAnalystComponent } from './bank-account-analyst/bank-account-analyst.component';
import { CreditProposalBankAccountAnalystDialogComponent } from './bank-account-analyst/bank-account-analyst-dialog.component';
import { SlikSummaryComponent } from './slik-summary/slik-summary.component';
import { SlikSummaryDebiturComponent } from './slik-summary/debitur/slik-summary-debitur.component';
import { SlikSummaryDebiturDialogComponent } from './slik-summary/debitur/slik-summary-debitur-dialog.component';
import { SlikSummaryShareHolderComponent } from './slik-summary/share-holder/slik-summary-share-holder.component';
import { SlikSummaryShareHolderDialogComponent } from './slik-summary/share-holder/slik-summary-share-holder-dialog.component';
import { SlikSummaryBusinessGroupDialogComponent } from './slik-summary/business-group/slik-summary-business-group-dialog.component';
import { SlikSummaryBusinessGroupComponent } from './slik-summary/business-group/slik-summary-business-group.component';
import { CreditProposalCollateralInfoComponent } from './collateral-info/credit-proposal-collateral-info.component';
import { CreditProposalCollateralInfoDialogComponent } from './collateral-info/dialog/credit-proposal-collateral-info-dialog.component';

import { CreditProposalTabCustomerProfitabilityComponent } from './tab-customer-profitability/credit-proposal-tab-customer-profitability.component';
import { CreditProposalDocumentChecklistComponent } from './document-checklist/credit-proposal-document-checklist.component';
import { DocumentChecklistDialogComponent } from './document-checklist/document-checklist-dialog.component';
import { CreditProposalRepaymentCapabilityComponent } from './repayment-capability/credit-proposal-repayment-capability.component';
import { RepaymentSpreadsheetComponent } from './repayment-spreadsheet/repayment-spreadsheet.component';

import { CreditProposalLoanFacilityDetailComponent } from './credit-proposal-loan-facility-detail.component';
import { CreditProposalApprovalTabSummaryComponent } from './credit-proposal-approval-tab-summary.component';
import { CreditProposalListSlikSummaryListComponent } from './credit-proposal-slik-summary-list.component';
import { CreditProposalSlikSummaryDetailComponent } from './credit-proposal-slik-summary-detail.component';
import { CreditProposalTabLoanFacilityDetailComponent } from './credit-proposal-tab-loan-facility-detail.component';
import { CreditProposalBankAccountAnalysisComponent } from './credit-proposal-bank-account-analysis';
import { CreditProposalTabLoanFacilityDetailGridComponent } from './credit-proposal-tab-loan-facility-detail.grid.component';
import { CreditProposalTabSummaryComponent } from './credit-proposal-tab-summary.component';
import { CreditProposalTabRepaymentCapabilityComponent } from './credit-proposal-tab-repayment-capability.component';
import { CreditProposalRiskAcceptanceCriteriaComponent } from './risk-criteria/credit-proposal-risk-acceptance-criteria-component';
import { CreditProposalTabBusinessActivityComponent } from './busines-activity/credit-proposal-tab-business-activity.component';
import { CreditProposaTabManagementInfoComponent } from './credit-proposal-tab-management-info.component';
import { CreditProposalTabExposureComponent } from './credit-proposal-tab-exposure.component';
import { CreditProposalApprovalListComponent } from './credit-proposal-approval-list.component';
import { CreditProposalGroupGuarantorAnalysisComponent } from './guarantour/credit-proposal-group-guarantor-analysis.component';
import { CreditProposalTabCovenantComponent } from './convenant/credit-proposal-tab-covenant.component';
import { CreditProposalPersonalInfoComponent } from './basic-information/personal-info.component';
import { ProposalBasicInformationViewComponent } from './basic-information/basic-information-view.component';
import { CreditProposalPersonComponent } from './credit-proposal-person.component';
import { CreditProposalProposePricingComponent } from './propose-pricing/credit-proposal-propose-pricing.component';
import { CreditProposalNewComponent } from './credit-proposal-new.component';
import { CreditProposalTradeCheckingComponent } from './credit-proposal-trade-checking.component';
import { CreditProposalNewDialogComponent } from './credit-proposal-new-dialog.component';
import { CreditProposalListMaterialComponent } from './credit-proposal-list-material.component';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(creditProposalRoute)],
  declarations: [
    CreditProposalComponent,
    CreditProposalUpdateCustomComponent,
    CreditProposalAnchorComponent,
    CreditProposalListComponent,
    CreditProposalTabCollateralInfoListComponent,
    CreditProposalFinancialStatementComponent,
    CreditProposalBankAccountAnalystComponent,
    ProposalBasicInformationComponent,
    CreditProposalBankAccountAnalystDialogComponent,
    SlikSummaryComponent,
    SlikSummaryDebiturComponent,
    SlikSummaryDebiturDialogComponent,
    SlikSummaryShareHolderComponent,
    SlikSummaryShareHolderDialogComponent,
    SlikSummaryBusinessGroupComponent,
    SlikSummaryBusinessGroupDialogComponent,
    CreditProposalCollateralInfoComponent,
    CreditProposalCollateralInfoDialogComponent,
    CreditProposalTabCustomerProfitabilityComponent,
    CreditProposalDocumentChecklistComponent,
    DocumentChecklistDialogComponent,
    CreditProposalRepaymentCapabilityComponent,
    RepaymentSpreadsheetComponent,
    CreditProposalLoanFacilityDetailComponent,
    CreditProposalApprovalTabSummaryComponent,
    CreditProposalListSlikSummaryListComponent,
    CreditProposalSlikSummaryDetailComponent,
    CreditProposalTabLoanFacilityDetailComponent,
    CreditProposalBankAccountAnalysisComponent,
    CreditProposalTabLoanFacilityDetailGridComponent,
    CreditProposalTabSummaryComponent,
    CreditProposalTabRepaymentCapabilityComponent,
    CreditProposalRiskAcceptanceCriteriaComponent,
    CreditProposalTabBusinessActivityComponent,
    CreditProposaTabManagementInfoComponent,
    CreditProposalTabExposureComponent,
    CreditProposalApprovalListComponent,
    CreditProposalGroupGuarantorAnalysisComponent,
    CreditProposalTradeCheckingComponent,
    CreditProposalTabCovenantComponent,
    CreditProposalPersonalInfoComponent,
    ProposalBasicInformationViewComponent,
    CreditProposalPersonComponent,
    CreditProposalProposePricingComponent,
    CreditProposalNewComponent,
    CreditProposalNewDialogComponent,
    CreditProposalListMaterialComponent,
  ],
  entryComponents: [CreditProposalNewDialogComponent],
  providers: [PageService, ToolbarService, EditService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditProposalModule {}
