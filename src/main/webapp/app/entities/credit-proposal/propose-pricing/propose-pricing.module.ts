import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProposePricingLoanFacilityDetailComponent } from './propose-pricing-loan-facility-detail.component';
import { CreditProposalProposePricingComponent } from './credit-proposal-propose-pricing.component';
import { ProposePricingLoanFacilityDetailDialogComponent } from './propose-pricing-loan-facility-detail-dialog.component';
import { CreditProposalTabCustomerProfitabilityComponent } from '../tab-customer-profitability/credit-proposal-tab-customer-profitability.component';

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
    CreditProposalProposePricingComponent,
    ProposePricingLoanFacilityDetailComponent,
    ProposePricingLoanFacilityDetailDialogComponent,
    CreditProposalTabCustomerProfitabilityComponent,
  ],
  exports: [
    CreditProposalProposePricingComponent,
    ProposePricingLoanFacilityDetailComponent,
    ProposePricingLoanFacilityDetailDialogComponent,
    CreditProposalTabCustomerProfitabilityComponent,
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
export class ProposePricingModule {}
