import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { LoanFacilityDetailHistoryComponent } from './loan-facility-detail-history.component';
import { CreditProposalLoanFacilityDialogHistoryComponent } from './dialog/loan-facility-dialog.component';
import { LoanFacilityDetailGridHistoryComponent } from './grid/credit-proposal-tab-loan-facility-detail.grid.component';
import { MainFacilityChildHistoryComponent } from './main-facility/main-facility-child-history.component';
import { MainFacilityDialogHistoryComponent } from './main-facility/main-facility-dialog-history.component';
import { MainFacilityHistoryComponent } from './main-facility/main-facility-history.component';
import { MappingCollateralHistoryComponent } from './mapping/mapping-collateral.component';
import { MappingFacilityHistoryComponent } from './mapping/mapping-facility.component';
import { CollateralTabLoanAfterDialogHistoryComponent } from './take-over-after/collateral/credit-proposal-collateral-tab-loan-after-dialog.component';
import { CollateralTabLoanAfterHistoryComponent } from './take-over-after/collateral/credit-proposal-collateral-tab-loan-after.component';
import { LoanFacilityTakeOverAfterHistoryComponent } from './take-over-after/credit-proposal-tab-loan-facility-take-over-after.component';
import { LoanFacilityTakeOverAfterGridHistoryComponent } from './take-over-after/credit-proposal-tab-loan-facility-take-over-after.grid.component';
import { CollateralTabLoanDialogHistoryComponent } from './take-over/collateral/credit-proposal-collateral-tab-loan-dialog.component';
import { CollateralTabLoanHistoryComponent } from './take-over/collateral/credit-proposal-collateral-tab-loan.component';
import { LoanFacilityTakeOverHistoryComponent } from './take-over/credit-proposal-tab-loan-facility-take-over.component';
import { LoanFacilityTakeOverGridHistoryComponent } from './take-over/credit-proposal-tab-loan-facility-take-over.grid.component';
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
  imports: [SharedModule, SharedEntityModule, DocumentEditorAllModule, DocumentEditorContainerModule],
  declarations: [
    LoanFacilityDetailHistoryComponent,
    LoanFacilityTakeOverAfterGridHistoryComponent,
    LoanFacilityTakeOverAfterHistoryComponent,
    CollateralTabLoanAfterHistoryComponent,
    CollateralTabLoanAfterDialogHistoryComponent,
    LoanFacilityTakeOverGridHistoryComponent,
    LoanFacilityTakeOverHistoryComponent,
    CollateralTabLoanHistoryComponent,
    CollateralTabLoanDialogHistoryComponent,
    MappingFacilityHistoryComponent,
    MappingCollateralHistoryComponent,
    MainFacilityHistoryComponent,
    MainFacilityDialogHistoryComponent,
    MainFacilityChildHistoryComponent,
    LoanFacilityDetailGridHistoryComponent,
    CreditProposalLoanFacilityDialogHistoryComponent,
  ],
  exports: [
    LoanFacilityDetailHistoryComponent,
    LoanFacilityTakeOverAfterGridHistoryComponent,
    LoanFacilityTakeOverAfterHistoryComponent,
    CollateralTabLoanAfterHistoryComponent,
    CollateralTabLoanAfterDialogHistoryComponent,
    LoanFacilityTakeOverGridHistoryComponent,
    LoanFacilityTakeOverHistoryComponent,
    CollateralTabLoanHistoryComponent,
    CollateralTabLoanDialogHistoryComponent,
    MappingFacilityHistoryComponent,
    MappingCollateralHistoryComponent,
    MainFacilityHistoryComponent,
    MainFacilityDialogHistoryComponent,
    MainFacilityChildHistoryComponent,
    LoanFacilityDetailGridHistoryComponent,
    CreditProposalLoanFacilityDialogHistoryComponent,
  ],
  providers: [
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
export class LoanFacilityDetailHistoryModule {}
