import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import lodash from 'lodash';
import { ITradeCheckingBuyers } from '../trade-checking-buyers.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-trade-checking-buyers-dialog-edit',
  templateUrl: './credit-proposal-trade-checking-buyers-dialog-edit.component.html',
  styleUrls: ['../../trade-checking.scss'],
})
export class CreditProposalTradeCheckingBuyersDialogEditComponent {
  private dialog: MatDialog;
  public creditProposal: ICreditProposal;
  public tradeCheckingBuyers: ITradeCheckingBuyers;
  public tradeCheckingBuyers1: ITradeCheckingBuyers;
  public edit: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tradeCheckingBuyers: ITradeCheckingBuyers;
      creditProposal: ICreditProposal;
      edit: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalTradeCheckingBuyersDialogEditComponent>
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.edit = this.data.edit;
    this.creditProposal = this.data.creditProposal;
    this.tradeCheckingBuyers = this.data.tradeCheckingBuyers;
    this.tradeCheckingBuyers1 = lodash.cloneDeep(this.data.tradeCheckingBuyers);
  }

  public save(): void {
    this._dialog.close({ tradeCheckingBuyers: this.tradeCheckingBuyers, action: 'save' });
    console.log('trade cecking buyers', this.tradeCheckingBuyers);
  }

  public close() {
    this._dialog.close({ tradeCheckingBuyers: this.tradeCheckingBuyers1, action: 'cancel' });
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }
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
        this._dialog.close({ tradeCheckingBuyers: this.tradeCheckingBuyers1, action: 'cancel' });
      }
    });
  }
}
