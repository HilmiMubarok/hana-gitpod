import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CreditProposalTradeCheckingBuyersDialogComponent } from './buyers/credit-proposal-trade-checking-buyers-dialog.component';
import { CreditProposalTradeCheckingBuyersComponent } from './buyers/credit-proposal-trade-checking-buyers.component';
import { CreditProposalTradeCheckingBuyersDialogEditComponent } from './buyers/edit/credit-proposal-trade-checking-buyers-dialog-edit.component';
import { TradeCheckingComponent } from './credit-proposal-trade-checking.component';
import { RemarskComponent } from './Remarks/credit-proposal-trade-checking-remarks.component';
import { CreditProposalTradeCheckingSupplierDialogComponent } from './supplier/credit-proposal-trade-checking-supplier-dialog.component';
import { CreditProposalTradeCheckingSupplierComponent } from './supplier/credit-proposal-trade-checking-supplier.component';
import { CreditProposalTradeCheckingSupplierDialogEditComponent } from './supplier/edit/credit-proposal-trade-checking-supplier-dialog-edit.component';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
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
  imports: [SharedModule, DocumentEditorAllModule, DocumentEditorContainerModule],
  declarations: [
    CreditProposalTradeCheckingBuyersDialogEditComponent,
    CreditProposalTradeCheckingBuyersDialogComponent,
    CreditProposalTradeCheckingBuyersComponent,

    RemarskComponent,

    CreditProposalTradeCheckingSupplierDialogEditComponent,
    CreditProposalTradeCheckingSupplierDialogComponent,
    CreditProposalTradeCheckingSupplierComponent,

    TradeCheckingComponent,
  ],
  exports: [
    CreditProposalTradeCheckingBuyersDialogEditComponent,
    CreditProposalTradeCheckingBuyersDialogComponent,
    CreditProposalTradeCheckingBuyersComponent,

    RemarskComponent,

    CreditProposalTradeCheckingSupplierDialogEditComponent,
    CreditProposalTradeCheckingSupplierDialogComponent,
    CreditProposalTradeCheckingSupplierComponent,

    TradeCheckingComponent,
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
export class TradeCheckingModule {}
