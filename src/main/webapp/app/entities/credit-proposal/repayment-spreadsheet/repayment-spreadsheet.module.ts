import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ContextMenuService, SpreadsheetAllModule } from '@syncfusion/ej2-angular-spreadsheet';
import { RepaymentSpreadsheetComponent } from './repayment-spreadsheet.component';
import { CreditProposalFinancialStatementRemarksComponent } from './remarks/financial-statement-remarks.component';

@NgModule({
  imports: [SharedModule, SpreadsheetAllModule],
  declarations: [RepaymentSpreadsheetComponent, CreditProposalFinancialStatementRemarksComponent],
  exports: [RepaymentSpreadsheetComponent, CreditProposalFinancialStatementRemarksComponent],
  providers: [ContextMenuService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class RepaymentSpreadsheetModule {}
