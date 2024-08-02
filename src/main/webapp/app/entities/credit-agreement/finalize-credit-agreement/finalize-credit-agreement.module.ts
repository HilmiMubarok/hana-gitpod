import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewHistoryComponent } from './review-history/review-history.component';
import { GeneratePKDraftComponent } from './generate-pk-draft/generate-pk-draft.component';
import { SharedModule } from 'app/shared/shared.module';
import { FinalizeCreditAgreementComponent } from './finalize-credit-agreement.component';
import { ReviewHistoryDialogComponent } from '../review-history-dialog/review-history-dialog.component';
import { ClausalPkDialogComponentEditComponent } from './clausal-pk-dialog/clausal-pk-dialog-edit.component';
import { ClausalPkDialogComponent } from './clausal-pk-dialog/clausal-pk-dialog.component';
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
  declarations: [
    ReviewHistoryComponent,
    ReviewHistoryDialogComponent,
    GeneratePKDraftComponent,
    FinalizeCreditAgreementComponent,
    ClausalPkDialogComponentEditComponent,
    ClausalPkDialogComponent,
  ],
  imports: [CommonModule, SharedModule, DocumentEditorAllModule, DocumentEditorContainerModule],
  exports: [
    ReviewHistoryComponent,
    ReviewHistoryDialogComponent,
    GeneratePKDraftComponent,
    FinalizeCreditAgreementComponent,
    ClausalPkDialogComponentEditComponent,
    ClausalPkDialogComponent,
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
export class FinalizeCreditAgreementModule {}
