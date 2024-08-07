import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ContextMenuService, SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { CreditProposalGeneratePkReportComponent } from './credit-proposal-generate-pk-report.component';

@NgModule({
  imports: [SharedModule, SpreadsheetAllModule],
  declarations: [CreditProposalGeneratePkReportComponent],
  exports: [CreditProposalGeneratePkReportComponent],
  providers: [ContextMenuService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class CreditProposalGeneratePkReport {}
