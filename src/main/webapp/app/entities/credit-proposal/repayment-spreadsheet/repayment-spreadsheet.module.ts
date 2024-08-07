import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ContextMenuService, SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { RepaymentSpreadsheetComponent } from './repayment-spreadsheet.component';
import { CreditProposalFinancialStatementRemarksComponent } from './remarks/financial-statement-remarks.component';

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
  imports: [SharedModule, SpreadsheetAllModule, DocumentEditorAllModule, DocumentEditorContainerModule],
  declarations: [RepaymentSpreadsheetComponent, CreditProposalFinancialStatementRemarksComponent],
  exports: [RepaymentSpreadsheetComponent, CreditProposalFinancialStatementRemarksComponent],
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class RepaymentSpreadsheetModule {}
