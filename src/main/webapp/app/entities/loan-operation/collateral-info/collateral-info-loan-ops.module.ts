import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { CollateralInfoLoanOpsComponent } from './collateral-info-loan-ops.component';
import { CollateralInfoRemarksChecklistLoanOpsComponent } from './remarks/collateral-info-remarks-checklist-loan-ops.component';
import { CollateralInfoRemarksInformationLoanOpsComponent } from './remarks/collateral-info-remarks-information-loan-ops.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, DocumentEditorAllModule, DocumentEditorContainerAllModule],
  declarations: [
    CollateralInfoLoanOpsComponent,
    CollateralInfoRemarksChecklistLoanOpsComponent,
    CollateralInfoRemarksInformationLoanOpsComponent,
  ],
  exports: [CollateralInfoLoanOpsComponent],
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
export class CollateralInfoLoanOpsModule {}
