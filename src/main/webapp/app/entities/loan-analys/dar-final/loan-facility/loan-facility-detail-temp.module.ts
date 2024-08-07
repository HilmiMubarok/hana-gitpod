import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';

import { SharedLibsModule } from 'app/shared/shared-libs.module';
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
import { LoanFacilityDetailTempComponent } from './credit-proposal-tab-loan-facility-detail.component';
import { LoanFacilityDialogTempComponent } from './dialog/loan-facility-dialog.component';
import { LoanFacilityDetailGridTempComponent } from './grid/credit-proposal-tab-loan-facility-detail.grid.component';
import { MainFacilityChildDarComponent } from './main-facility/main-facility-child-dar.component';
import { MainFacilityDarComponent } from './main-facility/main-facility-dar.component';
import { MainFacilityDialogDarComponent } from './main-facility/main-facility-dialog-dar.component';
import { CreditProposalMappingCollateralTempComponent } from './mapping/mapping-collateral.component';
import { MappingFacilityTempComponent } from './mapping/mapping-facility.component';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, DocumentEditorAllModule, DocumentEditorContainerModule],
  declarations: [
    LoanFacilityDetailTempComponent,
    CreditProposalMappingCollateralTempComponent,
    MappingFacilityTempComponent,
    MainFacilityDialogDarComponent,
    MainFacilityDarComponent,
    MainFacilityChildDarComponent,
    LoanFacilityDetailGridTempComponent,
    LoanFacilityDialogTempComponent,
  ],
  exports: [
    LoanFacilityDetailTempComponent,
    CreditProposalMappingCollateralTempComponent,
    MappingFacilityTempComponent,
    MainFacilityDialogDarComponent,
    MainFacilityDarComponent,
    MainFacilityChildDarComponent,
    LoanFacilityDetailGridTempComponent,
    LoanFacilityDialogTempComponent,
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
export class LoanFacilityDetailTempModule {}
