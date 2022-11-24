import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import lodash from 'lodash';
import { ITradeCheckingSupplier } from '../trade-checking-supplier.model';

@Component({
  selector: 'jhi-trade-checking-supplier-dialog-edit',
  templateUrl: './credit-proposal-trade-checking-supplier-dialog-edit.component.html',
})
export class CreditProposalTradeCheckingSupplierDialogEditComponent {
  public tradeCheckingSupplier: ITradeCheckingSupplier;
  public tradeCheckingSupplier1: ITradeCheckingSupplier;
  public edit: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tradeCheckingSupplier: ITradeCheckingSupplier;
      edit: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalTradeCheckingSupplierDialogEditComponent>
  ) {
    this.edit = this.data.edit;
    this.tradeCheckingSupplier = this.data.tradeCheckingSupplier;
    this.tradeCheckingSupplier1 = lodash.cloneDeep(this.data.tradeCheckingSupplier);
  }

  public save(): void {
    this._dialog.close({ tradeCheckingSupplier: this.tradeCheckingSupplier, action: 'save' });
  }

  public close() {
    this._dialog.close({ tradeCheckingSupplier: this.tradeCheckingSupplier1, action: 'cancel' });
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }
}
