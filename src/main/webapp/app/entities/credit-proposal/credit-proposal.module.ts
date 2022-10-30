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
import { ProposalBasicInformationComponent } from './proposal-basic-information.component';
import { CreditProposalCollateralInfoDialogComponent } from './collateral-info/dialog/credit-proposal-collateral-info-dialog.component';
import { CreditProposalRepaymentCapabilityComponent } from './repayment-capability/credit-proposal-repayment-capability.component';
import { CreditProposalApprovalTabSummaryComponent } from './credit-proposal-approval-tab-summary.component';
import { CreditProposalListSlikSummaryListComponent } from './credit-proposal-slik-summary-list.component';
import { CreditProposalSlikSummaryDetailComponent } from './credit-proposal-slik-summary-detail.component';
import { CreditProposalTabRepaymentCapabilityComponent } from './credit-proposal-tab-repayment-capability.component';
import { CreditProposalApprovalListComponent } from './credit-proposal-approval-list.component';
import { CreditProposalGroupGuarantorAnalysisComponent } from './guarantour/credit-proposal-group-guarantor-analysis.component';
import { ProposalBasicInformationViewComponent } from './basic-information/basic-information-view.component';
import { CreditProposalNewComponent } from './credit-proposal-new.component';
import { CreditProposalTradeCheckingBuyersComponent } from './trade-checking/buyers/credit-proposal-trade-checking-buyers.component';
import { CreditProposalTradeCheckingBuyersDialogComponent } from './trade-checking/buyers/credit-proposal-trade-checking-buyers-dialog.component';
import { CreditProposalTradeCheckingBuyersDialogEditComponent } from './trade-checking/buyers/edit/credit-proposal-trade-checking-buyers-dialog-edit.component';
import { CreditProposalTradeCheckingSupplierComponent } from './trade-checking/supplier/credit-proposal-trade-checking-supplier.component';
import { CreditProposalTradeCheckingSupplierDialogComponent } from './trade-checking/supplier/credit-proposal-trade-checking-supplier-dialog.component';
import { CreditProposalTradeCheckingSupplierDialogEditComponent } from './trade-checking/supplier/edit/credit-proposal-trade-checking-supplier-dialog-edit.component';
import { CreditProposalNewDialogComponent } from './credit-proposal-new-dialog.component';
import { CreditProposalListMaterialComponent } from './credit-proposal-list-material.component';
import { TradeCheckingComponent } from './trade-checking/credit-proposal-trade-checking.component';
import { CreditProposalLoanFacilityDialogComponent } from './loan-facility/dialog/loan-facility-dialog.component';
import { CreditProposalMappingCollateralComponent } from './loan-facility/mapping/mapping-collateral.component';
import { CreditProposalMappingFacilityComponent } from './loan-facility/mapping/mapping-facility.component';
import { CreditProposalApproveUserComponent } from './approve-user/approve-user.component';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(creditProposalRoute)],
  declarations: [
    CreditProposalComponent,
    CreditProposalUpdateCustomComponent,
    CreditProposalAnchorComponent,
    CreditProposalListComponent,
    CreditProposalTabCollateralInfoListComponent,
    ProposalBasicInformationComponent,
    CreditProposalLoanFacilityDialogComponent,
    CreditProposalCollateralInfoDialogComponent,
    CreditProposalRepaymentCapabilityComponent,
    CreditProposalApprovalTabSummaryComponent,
    CreditProposalListSlikSummaryListComponent,
    CreditProposalSlikSummaryDetailComponent,
    CreditProposalTabRepaymentCapabilityComponent,
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
    CreditProposalNewComponent,
    CreditProposalNewDialogComponent,
    CreditProposalListMaterialComponent,
    CreditProposalMappingCollateralComponent,
	CreditProposalMappingFacilityComponent
    CreditProposalApproveUserComponent
  ],
  entryComponents: [CreditProposalNewDialogComponent],
  providers: [PageService, ToolbarService, EditService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LosgwCreditProposalModule {}