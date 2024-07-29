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

@NgModule({
  imports: [SharedModule],
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

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TradeCheckingModule {}
