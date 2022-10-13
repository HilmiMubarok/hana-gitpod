import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { ICreditProposal } from '../../credit-proposal.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { ITradeCheckingBuyers } from './trade-checking-buyers.model';

@Component({
  selector: 'jhi-trade-checking-buyers-dialog',
  templateUrl: './credit-proposal-trade-checking-buyers-dialog.component.html',
  styleUrls: ['../trade-checking.scss'],
})
export class CreditProposalTradeCheckingBuyersDialogComponent {
  public tradeCheckingBuyers: ITradeCheckingBuyers;
  public view: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tradeCheckingBuyers: ITradeCheckingBuyers;
      view: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalTradeCheckingBuyersDialogComponent>
  ) {
    this.view = this.data.view;
    this.tradeCheckingBuyers = this.data.tradeCheckingBuyers;
  }

  public save(): void {
    this._dialog.close(this.tradeCheckingBuyers);
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }
}
