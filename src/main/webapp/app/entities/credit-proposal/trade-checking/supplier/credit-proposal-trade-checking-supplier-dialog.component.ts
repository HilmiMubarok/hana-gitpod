import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { ICreditProposal } from '../../credit-proposal.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { ITradeCheckingSupplier } from './trade-checking-supplier.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-trade-checking-supplier-dialog',
  templateUrl: './credit-proposal-trade-checking-supplier-dialog.component.html',
  styleUrls: ['../trade-checking.scss'],
})
export class CreditProposalTradeCheckingSupplierDialogComponent {
  creditProposal: ICreditProposal;
  public tradeCheckingSupplier: ITradeCheckingSupplier;
  public view: boolean;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: ICreditProposal;
      tradeCheckingSupplier: ITradeCheckingSupplier;
      view: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalTradeCheckingSupplierDialogComponent>
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.creditProposal = this.data.object;
    this.view = this.data.view;
    this.tradeCheckingSupplier = this.data.tradeCheckingSupplier;
  }

  public save(): void {
    this._dialog.close({ tradeCheckingSupplier: this.tradeCheckingSupplier, action: 'cencel' });
  }
  // public close() {
  //   this._dialog.close({ action: 'cancel' });
  // }

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close({ action: 'cancel' });
      }
    });
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }
}
