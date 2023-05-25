import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { ICreditProposal } from '../../credit-proposal.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { ITradeCheckingBuyers } from './trade-checking-buyers.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-trade-checking-buyers-dialog',
  templateUrl: './credit-proposal-trade-checking-buyers-dialog.component.html',
  styleUrls: ['../trade-checking.scss'],
})
export class CreditProposalTradeCheckingBuyersDialogComponent {
  public creditProposal: ICreditProposal;
  public tradeCheckingBuyers: ITradeCheckingBuyers;
  public view: boolean;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: ICreditProposal;
      tradeCheckingBuyers: ITradeCheckingBuyers;
      view: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalTradeCheckingBuyersDialogComponent>
  ) {
    _dialog.disableClose = true;
    this.creditProposal = this.data.object;
    this.view = this.data.view;
    this.tradeCheckingBuyers = this.data.tradeCheckingBuyers;
  }

  public save(): void {
    this._dialog.close({ tradeCheckingBuyers: this.tradeCheckingBuyers, action: 'cencel' });
  }
  public close() {
    this._dialog.close({ action: 'cancel' });
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
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
        this._dialog.close({ action: 'cancel' });
      }
    });
  }
}
