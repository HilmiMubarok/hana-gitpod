import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProposalBasicInformationViewComponent } from './basic-information-view.component';
import { AddCoborowerComponent } from './add-new-coborower.component';
import { CreditProposalPersonalInfoComponent } from './personal-info.component';
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
import { SharedEntityModule } from 'app/entities/shared-entity.module';

@NgModule({
  imports: [SharedModule, SharedEntityModule, DocumentEditorAllModule, DocumentEditorContainerModule],
  declarations: [ProposalBasicInformationViewComponent, AddCoborowerComponent, CreditProposalPersonalInfoComponent],
  exports: [ProposalBasicInformationViewComponent, AddCoborowerComponent, CreditProposalPersonalInfoComponent],
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ProposalBasicInformationViewModule {}
