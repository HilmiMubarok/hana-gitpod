import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { RequestSlikComponent } from './request-slik.component';
import { RequestSlikDetailComponent } from './request-slik-detail.component';
import { RequestSlikUpdateComponent } from './request-slik-update.component';
import { requestSlikRoute } from './request-slik.route';
import { DocumentRequestSlikComponent } from './document/document-request-slik.component';
import { DocumentRequestSlikDialogComponent } from './document/dialog/document-request-slik-dialog.component';
import { RequestSlikManagementDataGridComponent } from './management-data/request-slik-management-data-grid.component';
import { RequestSlikShareholderGridComponent } from './shareholder/request-slik-shareholder-grid.component';
import { RequestSlikOtherGridComponent } from './others/request-slik-other-grid.component';
import { RequestSlikBucketComponent } from './request-slik-bucket.component';
import { RequestSlikManagementDataDialogComponent } from './management-data/dialog/request-slik-management-data-dialog.component';
import { RequestSlikDebiturGridComponent } from './debitur/request-slik-debitur-grid.component';
import { RequestSlikPopupComponent } from './dialogs/request-slik-popup.component';
import { RequestSlikDialogSlikFileComponent } from './dialogs/request-slik-dialog-slik-file.component';
import { RequestSlikStatusPipe } from './pipes/request-slik-status.pipe';
import { RequestSlikViewComponent } from './request-slik-view.component';

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
    SharedEntityModule,
    DocumentEditorAllModule,
    DocumentEditorContainerModule,
    RouterModule.forChild(requestSlikRoute),
  ],
  declarations: [
    RequestSlikComponent,
    RequestSlikDetailComponent,
    RequestSlikUpdateComponent,
    DocumentRequestSlikComponent,
    DocumentRequestSlikDialogComponent,
    RequestSlikManagementDataGridComponent,
    RequestSlikShareholderGridComponent,
    RequestSlikOtherGridComponent,
    RequestSlikBucketComponent,
    RequestSlikManagementDataDialogComponent,
    RequestSlikDebiturGridComponent,
    RequestSlikPopupComponent,
    RequestSlikDialogSlikFileComponent,
    RequestSlikStatusPipe,
    RequestSlikViewComponent,
  ],
  entryComponents: [
    RequestSlikComponent,
    RequestSlikUpdateComponent,
    RequestSlikDetailComponent,
    DocumentRequestSlikComponent,
    DocumentRequestSlikDialogComponent,
    RequestSlikManagementDataGridComponent,
    RequestSlikShareholderGridComponent,
    RequestSlikOtherGridComponent,
    RequestSlikBucketComponent,
    RequestSlikManagementDataDialogComponent,
    RequestSlikDebiturGridComponent,
    RequestSlikPopupComponent,
    RequestSlikDialogSlikFileComponent,
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
export class LosgwRequestSlikModule {}
