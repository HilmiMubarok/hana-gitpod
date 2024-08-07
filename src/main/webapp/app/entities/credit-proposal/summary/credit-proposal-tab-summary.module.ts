import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CreditProposalGeneratePkReport } from '../generate-document-pk-report/credit-proposal-generate-pk-report.module';
import { CreditProposalTabSummaryComponent } from './credit-proposal-tab-summary.component';
import { CreditProposalSummaryGenerateMemoBandingComponent } from './generate-memo-banding/credit-proposal-summary-generate-memo-banding.component';
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
  imports: [SharedModule, SharedEntityModule, CreditProposalGeneratePkReport, DocumentEditorAllModule, DocumentEditorContainerModule],
  declarations: [CreditProposalTabSummaryComponent, CreditProposalSummaryGenerateMemoBandingComponent],
  exports: [CreditProposalTabSummaryComponent, CreditProposalSummaryGenerateMemoBandingComponent],
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
export class CreditProposalSummaryTabModule {}
