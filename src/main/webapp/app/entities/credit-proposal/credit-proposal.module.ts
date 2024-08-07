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
import { CreditProposalApprovalTabSummaryComponent } from './credit-proposal-approval-tab-summary.component';
import { CreditProposalListSlikSummaryListComponent } from './credit-proposal-slik-summary-list.component';
import { CreditProposalSlikSummaryDetailComponent } from './credit-proposal-slik-summary-detail.component';
import { CreditProposalTabRepaymentCapabilityComponent } from './credit-proposal-tab-repayment-capability.component';
import { CreditProposalApprovalListComponent } from './credit-proposal-approval-list.component';

import { CreditProposalNewComponent } from './credit-proposal-new.component';
import { CreditProposalNewDialogComponent } from './credit-proposal-new-dialog.component';
import { CreditProposalListMaterialComponent } from './credit-proposal-list-material.component';
import { CreditProposalLoanFacilityDialogComponent } from './loan-facility/dialog/loan-facility-dialog.component';

import { CreditProposalApproveUserComponent } from './approve-user/approve-user.component';
import { ForwardToComponent } from './forward-to/forward-to.component';
import { CreditProposalLoanApplicationComponent } from './credit-proposal-loan-application.component';
import { MainFacilityDialogComponent } from './loan-facility/main-facility/main-facility-dialog.component';

import { CreditProposalOtherCovenantEditComponent } from './convenant/other-covenant/edit/credit-proposal-other-covenant-edit.component';
import { CreditProposalOtherCovenantDialogComponent } from './convenant/other-covenant/add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalRacNilaiPembelianAddComponent } from './risk-criteria/nilai-pembelian/credrit-proposal-risk-acceptance-criteria-add';
import { CreditProposalRacNilaiPembelianEditComponent } from './risk-criteria/nilai-pembelian/credit-proposal-risk-acceptance-criteria-edit';
import { CovenantModule } from './convenant/covenant.module';
import { RiskAcceptanceCriteriaModule } from './risk-criteria/risk-acceptance-criteria.module';
import { LoanFacilityModule } from './loan-facility/loan-facility.module';
import { ExposureModule } from './exposure/exposure.module';
import { ManagementInfoModule } from './management-info/management-info.module';
import { BusinessActivityModule } from './busines-activity/business-activity.module';
import { CreditProposalBankAccountAnalysisComponent } from './credit-proposal-bank-account-analysis';
import { ProposePricingModule } from './propose-pricing/propose-pricing.module';
import { MemoBandingModule } from './memo-banding/memo-banding.module';
import { TradeCheckingModule } from './trade-checking/trade-checking.module';
import { CreditRatingModule } from '../credit-rating/credit-rating.module';
import { CollateralInfoCpModule } from './collateral-info/collateral-info-cp.module';
import { RepaymentSpreadsheetModule } from './repayment-spreadsheet/repayment-spreadsheet.module';
import { CreditProposalSummaryTabModule } from './summary/credit-proposal-tab-summary.module';
import { ProposalBasicInformationViewModule } from './basic-information/basic-information-view.module';
import { CreditProposalGroupGuarantorAnalysisModule } from './guarantour/credit-proposal-group-guarantor-analysis.module';
import { LoanFacilityDetailHistoryModule } from './loan-facility-history/loan-facility-detail-history.module';
import { CreditProposalOpinionHistoryComponent } from './opinion-history/credit-proposal-opinion-history.component';
import { CreditProposalDialogOpinionHistoryComponent } from './opinion-history/dialog-opinion-history/credit-proposal-dialog-opinion-history.component';
import { DocumentEditorAllModule, DocumentEditorContainerModule } from '@syncfusion/ej2-angular-documenteditor';
import {
  EditorService,
  SelectionService,
  SfdtExportService,
  WordExportService,
  PrintService as PrintServiceDocumentEditor,
  TextExportService,
  ImageResizerService,
  EditorHistoryService,
  OptionsPaneService,
  HyperlinkDialogService,
  TableDialogService,
  BookmarkDialogService,
  TableOfContentsDialogService,
  PageSetupDialogService,
  StyleDialogService,
  ListDialogService,
  ParagraphDialogService,
  BulletsAndNumberingDialogService,
  FontDialogService,
  TablePropertiesDialogService,
  BordersAndShadingDialogService,
  TableOptionsDialogService,
  CellOptionsDialogService,
  StylesDialogService,
  ToolbarService as ToolbarServiceDocumentEditor,
} from '@syncfusion/ej2-angular-documenteditor';

@NgModule({
  imports: [
    SharedModule,
    SharedLibsModule,
    SharedEntityModule,
    CovenantModule,
    RiskAcceptanceCriteriaModule,
    LoanFacilityModule,
    ExposureModule,
    ManagementInfoModule,
    BusinessActivityModule,
    ProposePricingModule,
    MemoBandingModule,
    TradeCheckingModule,
    CreditRatingModule,
    CollateralInfoCpModule,
    RepaymentSpreadsheetModule,
    CreditProposalSummaryTabModule,
    ProposalBasicInformationViewModule,
    CreditProposalGroupGuarantorAnalysisModule,
    LoanFacilityDetailHistoryModule,
    DocumentEditorAllModule,
    DocumentEditorContainerModule,
    RouterModule.forChild(creditProposalRoute),
  ],
  declarations: [
    CreditProposalComponent,
    CreditProposalUpdateCustomComponent,
    CreditProposalAnchorComponent,
    CreditProposalListComponent,
    CreditProposalTabCollateralInfoListComponent,
    ProposalBasicInformationComponent,
    CreditProposalLoanFacilityDialogComponent,
    CreditProposalApprovalTabSummaryComponent,
    CreditProposalListSlikSummaryListComponent,
    CreditProposalSlikSummaryDetailComponent,
    CreditProposalTabRepaymentCapabilityComponent,
    CreditProposalApprovalListComponent,

    CreditProposalNewComponent,
    CreditProposalNewDialogComponent,
    CreditProposalListMaterialComponent,

    CreditProposalApproveUserComponent,
    CreditProposalLoanApplicationComponent,
    ForwardToComponent,
    MainFacilityDialogComponent,

    CreditProposalOtherCovenantEditComponent,
    CreditProposalOtherCovenantDialogComponent,
    CreditProposalRacNilaiPembelianAddComponent,
    CreditProposalRacNilaiPembelianEditComponent,
    CreditProposalBankAccountAnalysisComponent,
    CreditProposalOpinionHistoryComponent,
    CreditProposalDialogOpinionHistoryComponent,
  ],
  entryComponents: [CreditProposalNewDialogComponent],
  providers: [
    PageService,
    ToolbarService,
    EditService,
    EditorService,
    SelectionService,
    SfdtExportService,
    WordExportService,
    PrintServiceDocumentEditor,
    TextExportService,
    ImageResizerService,
    EditorHistoryService,
    OptionsPaneService,
    HyperlinkDialogService,
    TableDialogService,
    BookmarkDialogService,
    TableOfContentsDialogService,
    PageSetupDialogService,
    StyleDialogService,
    ListDialogService,
    ParagraphDialogService,
    BulletsAndNumberingDialogService,
    FontDialogService,
    TablePropertiesDialogService,
    BordersAndShadingDialogService,
    TableOptionsDialogService,
    CellOptionsDialogService,
    StylesDialogService,
    ToolbarServiceDocumentEditor,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditProposalModule {}
