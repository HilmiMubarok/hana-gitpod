import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { darRevisionCheckerRoute } from './dar-revision-checker.route';
// import { CreditProposalUpdateCustomComponent } from './credit-proposal-update-custom.component';
// import { CreditProposalComponent } from './credit-proposal.component';

import { PageService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { DarRevisionCheckerComponent } from './dar-revision-checker.component';
import { DarRevisionCheckerViewComponent } from './dar-revision-checker-view.component';

// import { CreditProposalAnchorComponent } from './credit-proposal-anchor.component';
// import { CreditProposalListComponent } from './credit-proposal-list.component';
// import { CreditProposalTabCollateralInfoListComponent } from './collateral/credit-proposal-tab-collateral-info-list.component';
// import { ProposalBasicInformationComponent } from './proposal-basic-information.component';
// import { CreditProposalCollateralInfoDialogComponent } from './collateral-info/dialog/credit-proposal-collateral-info-dialog.component';
// import { CreditProposalApprovalTabSummaryComponent } from './credit-proposal-approval-tab-summary.component';
// import { CreditProposalListSlikSummaryListComponent } from './credit-proposal-slik-summary-list.component';
// import { CreditProposalSlikSummaryDetailComponent } from './credit-proposal-slik-summary-detail.component';
// import { CreditProposalTabRepaymentCapabilityComponent } from './credit-proposal-tab-repayment-capability.component';
// import { CreditProposalApprovalListComponent } from './credit-proposal-approval-list.component';
// import { CreditProposalGroupGuarantorAnalysisComponent } from './guarantour/credit-proposal-group-guarantor-analysis.component';
// import { CreditProposalNewComponent } from './credit-proposal-new.component';
// import { CreditProposalNewDialogComponent } from './credit-proposal-new-dialog.component';
// import { CreditProposalListMaterialComponent } from './credit-proposal-list-material.component';
// import { CreditProposalLoanFacilityDialogComponent } from './loan-facility/dialog/loan-facility-dialog.component';

// import { CreditProposalApproveUserComponent } from './approve-user/approve-user.component';
// import { ForwardToComponent } from './forward-to/forward-to.component';
// import { CreditProposalLoanApplicationComponent } from './credit-proposal-loan-application.component';
// import { DialogCreditProposalCollateralInfoDialogBTBComponent } from './collateral-info/backtoback/dialog-credit-proposal-collateral-info-btb.component';
// import { MainFacilityDialogComponent } from './loan-facility/main-facility/main-facility-dialog.component';
// import { MainFacilityDialogHistoryComponent } from './loan-facility-history/main-facility/main-facility-dialog-history.component';
// import { MainFacilityChildHistoryComponent } from './loan-facility-history/main-facility/main-facility-child-history.component';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(darRevisionCheckerRoute)],
  declarations: [
    // CreditProposalComponent,
    // CreditProposalUpdateCustomComponent,
    // CreditProposalAnchorComponent,
    // CreditProposalListComponent,
    // CreditProposalTabCollateralInfoListComponent,
    // ProposalBasicInformationComponent,
    // CreditProposalLoanFacilityDialogComponent,
    // CreditProposalCollateralInfoDialogComponent,
    // CreditProposalApprovalTabSummaryComponent,
    // CreditProposalListSlikSummaryListComponent,
    // CreditProposalSlikSummaryDetailComponent,
    // CreditProposalTabRepaymentCapabilityComponent,
    // CreditProposalApprovalListComponent,
    // CreditProposalGroupGuarantorAnalysisComponent,
    // CreditProposalNewComponent,
    // CreditProposalNewDialogComponent,
    // CreditProposalListMaterialComponent,
    // CreditProposalApproveUserComponent,
    // CreditProposalLoanApplicationComponent,
    // DialogCreditProposalCollateralInfoDialogBTBComponent,
    // ForwardToComponent,
    // MainFacilityDialogComponent,
    // MainFacilityDialogHistoryComponent,
    // DpdlFinalizeModule,
    DarRevisionCheckerComponent,
    DarRevisionCheckerViewComponent,
  ],
  entryComponents: [DarRevisionCheckerComponent],
  providers: [PageService, ToolbarService, EditService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DarRevisionCheckerModule {}
