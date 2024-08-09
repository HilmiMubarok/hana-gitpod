import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { RepaymentSpreadsheetComponent } from './repayment-spreadsheet.component';
import { ContextMenuService, SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { CreditProposalFinancialStatementRemarksComponent } from './remarks/financial-statement-remarks.component';
import { DocumentEditorAllModule, DocumentEditorModule, DocumentEditorContainerAllModule } from '@syncfusion/ej2-angular-documenteditor';
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
  imports: [SharedModule, SharedEntityModule, SpreadsheetAllModule, DocumentEditorAllModule, DocumentEditorContainerAllModule],
  declarations: [RepaymentSpreadsheetComponent, CreditProposalFinancialStatementRemarksComponent],
  exports: [RepaymentSpreadsheetComponent],
  providers: [
    ContextMenuService,
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
export class RepaymentSpreadsheetModule {}
