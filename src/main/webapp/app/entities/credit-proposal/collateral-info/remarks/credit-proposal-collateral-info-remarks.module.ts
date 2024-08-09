import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { DocumentEditorAllModule, DocumentEditorContainerAllModule } from '@syncfusion/ej2-angular-documenteditor';
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
import { CreditProposalCollateralInfoRemarksChecklistComponent } from './credit-proposal-collateral-info-remarks-checklist.component';
import { CreditProposalCollateralInfoRemarksInformationComponent } from './credit-proposal-collateral-info-remarks-information.component';
import { CreditProposalCollateralInfoRemarksComponent } from './credit-proposal-collateral-info-remarks.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, DocumentEditorAllModule, DocumentEditorContainerAllModule],
  declarations: [
    CreditProposalCollateralInfoRemarksChecklistComponent,
    CreditProposalCollateralInfoRemarksInformationComponent,
    CreditProposalCollateralInfoRemarksComponent,
  ],
  exports: [
    CreditProposalCollateralInfoRemarksChecklistComponent,
    CreditProposalCollateralInfoRemarksInformationComponent,
    CreditProposalCollateralInfoRemarksComponent,
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
})
export class CreditProposalCollateralInfoRemarksModule {}
