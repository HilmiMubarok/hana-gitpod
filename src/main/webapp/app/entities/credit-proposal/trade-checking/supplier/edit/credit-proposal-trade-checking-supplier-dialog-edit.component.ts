import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import lodash from 'lodash';
import { ITradeCheckingSupplier } from '../trade-checking-supplier.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-trade-checking-supplier-dialog-edit',
  templateUrl: './credit-proposal-trade-checking-supplier-dialog-edit.component.html',
})
export class CreditProposalTradeCheckingSupplierDialogEditComponent {
  public tradeCheckingSupplier: ITradeCheckingSupplier;
  public tradeCheckingSupplier1: ITradeCheckingSupplier;
  public creditProposal: ICreditProposal;
  public edit: boolean;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tradeCheckingSupplier: ITradeCheckingSupplier;
      creditProposal: ICreditProposal;
      edit: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalTradeCheckingSupplierDialogEditComponent>
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.edit = this.data.edit;
    this.creditProposal = this.data.creditProposal;
    this.tradeCheckingSupplier = this.data.tradeCheckingSupplier;
    this.tradeCheckingSupplier1 = lodash.cloneDeep(this.data.tradeCheckingSupplier);
  }

  public save(): void {
    this._dialog.close({ tradeCheckingSupplier: this.tradeCheckingSupplier, action: 'save' });
  }

  public close() {
    this._dialog.close({ tradeCheckingSupplier: this.tradeCheckingSupplier1, action: 'cancel' });
  }

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20vw',
      data: {
        title: '',
        message: 'Are you sure to cancel?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close({ tradeCheckingSupplier: this.tradeCheckingSupplier1, action: 'cancel' });
      }
    });
  }
  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }
}
