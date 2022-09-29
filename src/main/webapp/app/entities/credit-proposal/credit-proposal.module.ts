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
import { CreditProposalCollateralInfoDialogComponent } from './collateral-info/dialog/credit-proposal-collateral-info-dialog.component';

import { CreditProposalTabCustomerProfitabilityComponent } from './tab-customer-profitability/credit-proposal-tab-customer-profitability.component';
import { CreditProposalDocumentChecklistComponent } from './document-checklist/credit-proposal-document-checklist.component';
import { DocumentChecklistDialogComponent } from './document-checklist/document-checklist-dialog.component';
import { CreditProposalRepaymentCapabilityComponent } from './repayment-capability/credit-proposal-repayment-capability.component';
import { RepaymentSpreadsheetComponent } from './repayment-spreadsheet/repayment-spreadsheet.component';

import { CreditProposalApprovalTabSummaryComponent } from './credit-proposal-approval-tab-summary.component';
import { CreditProposalListSlikSummaryListComponent } from './credit-proposal-slik-summary-list.component';
import { CreditProposalSlikSummaryDetailComponent } from './credit-proposal-slik-summary-detail.component';
import { CreditProposalBankAccountAnalysisComponent } from './credit-proposal-bank-account-analysis';
import { CreditProposalTabRepaymentCapabilityComponent } from './credit-proposal-tab-repayment-capability.component';
import { CreditProposalRiskAcceptanceCriteriaComponent } from './risk-criteria/credit-proposal-risk-acceptance-criteria-component';
import { CreditProposalTabBusinessActivityComponent } from './busines-activity/credit-proposal-tab-business-activity.component';
import { CreditProposaTabManagementInfoComponent } from './credit-proposal-tab-management-info.component';
import { CreditProposalTabExposureComponent } from './credit-proposal-tab-exposure.component';
import { CreditProposalApprovalListComponent } from './credit-proposal-approval-list.component';
import { CreditProposalGroupGuarantorAnalysisComponent } from './guarantour/credit-proposal-group-guarantor-analysis.component';
import { ProposalBasicInformationViewComponent } from './basic-information/basic-information-view.component';
import { CreditProposalProposePricingComponent } from './propose-pricing/credit-proposal-propose-pricing.component';
import { CreditProposalNewComponent } from './credit-proposal-new.component';
import { CreditProposalTradeCheckingBuyersComponent } from './trade-checking/buyers/credit-proposal-trade-checking-buyers.component';
import { CreditProposalTradeCheckingBuyersDialogComponent } from './trade-checking/buyers/credit-proposal-trade-checking-buyers-dialog.component';
import { CreditProposalTradeCheckingBuyersDialogEditComponent } from './trade-checking/buyers/edit/credit-proposal-trade-checking-buyers-dialog-edit.component';
import { CreditProposalTradeCheckingSupplierComponent } from './trade-checking/supplier/credit-proposal-trade-checking-supplier.component';
import { CreditProposalTradeCheckingSupplierDialogComponent } from './trade-checking/supplier/credit-proposal-trade-checking-supplier-dialog.component';
import { CreditProposalTradeCheckingSupplierDialogEditComponent } from './trade-checking/supplier/edit/credit-proposal-trade-checking-supplier-dialog-edit.component';
import { CreditProposalNewDialogComponent } from './credit-proposal-new-dialog.component';
import { CreditProposalListMaterialComponent } from './credit-proposal-list-material.component';
import { CreditProposalCollateralInfoChecklistComponent } from './collateral-info/checklist/credit-proposal-collateral-info-checklist.component';
import { ProposePricingLoanFacilityDetailComponent } from './propose-pricing/propose-pricing-loan-facility-detail.component';
import { TradeCheckingComponent } from './trade-checking/credit-proposal-trade-checking.component';
import { CreditProposalOpinionHistoryComponent } from './credit-proposal-opinion-history.component';
import { CreditProposalLoanFacilityDialogComponent } from './loan-facility/dialog/loan-facility-dialog.component';

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
    CreditProposalLoanFacilityDialogComponent,
    CreditProposalCollateralInfoDialogComponent,
    CreditProposalTabCustomerProfitabilityComponent,
    CreditProposalDocumentChecklistComponent,
    DocumentChecklistDialogComponent,
    CreditProposalRepaymentCapabilityComponent,
    RepaymentSpreadsheetComponent,
    CreditProposalApprovalTabSummaryComponent,
    CreditProposalListSlikSummaryListComponent,
    CreditProposalSlikSummaryDetailComponent,
    CreditProposalBankAccountAnalysisComponent,
    CreditProposalTabRepaymentCapabilityComponent,
    CreditProposalRiskAcceptanceCriteriaComponent,
    CreditProposalTabBusinessActivityComponent,
    CreditProposaTabManagementInfoComponent,
    CreditProposalTabExposureComponent,
    CreditProposalApprovalListComponent,
    CreditProposalGroupGuarantorAnalysisComponent,
    TradeCheckingComponent,
    CreditProposalTradeCheckingBuyersComponent,
    CreditProposalTradeCheckingBuyersDialogComponent,
    CreditProposalTradeCheckingBuyersDialogEditComponent,
    CreditProposalTradeCheckingSupplierComponent,
    CreditProposalTradeCheckingSupplierDialogComponent,
    CreditProposalTradeCheckingSupplierDialogEditComponent,
    ProposalBasicInformationViewComponent,
    CreditProposalProposePricingComponent,
    CreditProposalNewComponent,
    CreditProposalNewDialogComponent,
    CreditProposalListMaterialComponent,
    CreditProposalCollateralInfoChecklistComponent,
  ],
  entryComponents: [CreditProposalNewDialogComponent],
  providers: [PageService, ToolbarService, EditService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditProposalModule {}
