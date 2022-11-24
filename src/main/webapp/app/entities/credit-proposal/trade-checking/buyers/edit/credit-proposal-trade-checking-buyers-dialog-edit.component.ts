import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import lodash from 'lodash';
import { ITradeCheckingBuyers } from '../trade-checking-buyers.model';

@Component({
  selector: 'jhi-trade-checking-buyers-dialog-edit',
  templateUrl: './credit-proposal-trade-checking-buyers-dialog-edit.component.html',
})
export class CreditProposalTradeCheckingBuyersDialogEditComponent {
  public tradeCheckingBuyers: ITradeCheckingBuyers;
  public tradeCheckingBuyers1: ITradeCheckingBuyers;
  public edit: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tradeCheckingBuyers: ITradeCheckingBuyers;
      edit: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalTradeCheckingBuyersDialogEditComponent>
  ) {
    this.edit = this.data.edit;
    this.tradeCheckingBuyers = this.data.tradeCheckingBuyers;
    this.tradeCheckingBuyers1 = lodash.cloneDeep(this.data.tradeCheckingBuyers);
  }

  public save(): void {
    this._dialog.close({ tradeCheckingBuyers: this.tradeCheckingBuyers, action: 'save' });
  }

  public close() {
    this._dialog.close({ tradeCheckingBuyers: this.tradeCheckingBuyers1, action: 'cancel' });
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }
}
