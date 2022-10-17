import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { ICreditProposal } from '../../credit-proposal.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { ITradeCheckingSupplier } from './trade-checking-supplier.model';

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
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: ICreditProposal;
      tradeCheckingSupplier: ITradeCheckingSupplier;
      view: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalTradeCheckingSupplierDialogComponent>
  ) {
    this.creditProposal = this.data.object;
    this.view = this.data.view;
    this.tradeCheckingSupplier = this.data.tradeCheckingSupplier;
  }

  public save(): void {
    this._dialog.close(this.tradeCheckingSupplier);
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }
}
