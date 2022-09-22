import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from '../credit-proposal.model';
import { BankAccountAnalystDetail, IBankAccountAnalyst, IBankAccountAnalystDetail } from './bank-account-analyst.model';

@Component({
  selector: 'jhi-credit-proposal-bank-account-analyst-dialog',
  templateUrl: './bank-account-analyst-dialog.component.html',
})
export class CreditProposalBankAccountAnalystDialogComponent {
  public banks: string[] = ['BCA', 'CIMB NIAGA', 'OCBC NISP', 'PANIN', 'PERMATA', 'MANDIRI'];
  public displayedColumns: string[] = ['date', 'debit', 'fqDebit', 'credit', 'fqCredit', 'lowest', 'highest', 'balance', 'action'];
  public creditProposal: ICreditProposal;
  public bankAccAnalyst: IBankAccountAnalyst;
  public view: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { bankAccountAnalyst: IBankAccountAnalyst; view: boolean },
    private _dialog: MatDialogRef<CreditProposalBankAccountAnalystDialogComponent>
  ) {
    this.bankAccAnalyst = this.data.bankAccountAnalyst;
    if (this.bankAccAnalyst.detail.length === 0) {
      this.bankAccAnalyst.detail = [...this.bankAccAnalyst.detail, new BankAccountAnalystDetail()];
    }
    this.view = this.data.view;
  }

  public onRemove(index: number): void {
    const copyAttr: IBankAccountAnalystDetail[] = this.bankAccAnalyst.detail;
    copyAttr.splice(index, 1);

    this.bankAccAnalyst.detail = [...copyAttr];
  }

  public getTotalDebit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.bankAccAnalyst.detail.map(t => t.debit).reduce((acc, value) => acc + value, 0);
    }
    return result;
  }

  public getTotalFqDebit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.bankAccAnalyst.detail.map(t => t.fqDebit).reduce((acc, value) => acc + value, 0);
    }
    return result;
  }

  public getTotalCredit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.bankAccAnalyst.detail.map(t => t.credit).reduce((acc, value) => acc + value, 0);
    }
    return result;
  }

  public getTotalFqCredit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.bankAccAnalyst.detail.map(t => t.fqCredit).reduce((acc, value) => acc + value, 0);
    }
    return result;
  }

  public getTotalLowest(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.bankAccAnalyst.detail.map(t => t.lowest).reduce((acc, value) => acc + value, 0);
    }
    return result;
  }

  public getTotalHighest(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.bankAccAnalyst.detail.map(t => t.highest).reduce((acc, value) => acc + value, 0);
    }
    return result;
  }

  public getTotalBalance(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.bankAccAnalyst.detail.map(t => t.balance).reduce((acc, value) => acc + value, 0);
    }
    return result;
  }

  public getAverageDebit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalDebit() / this.bankAccAnalyst.detail.length;
    }
    return result;
  }

  public getAverageFqDebit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalFqDebit() / this.bankAccAnalyst.detail.length;
    }
    return result;
  }

  public getAverageCredit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalCredit() / this.bankAccAnalyst.detail.length;
    }
    return result;
  }

  public getAverageFqCredit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalFqCredit() / this.bankAccAnalyst.detail.length;
    }
    return result;
  }

  public getAverageLowest(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalLowest() / this.bankAccAnalyst.detail.length;
    }
    return result;
  }

  public getAverageHighest(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalHighest() / this.bankAccAnalyst.detail.length;
    }
    return result;
  }

  public getAverageBalance(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalBalance() / this.bankAccAnalyst.detail.length;
    }
    return result;
  }

  public addRow(): void {
    this.bankAccAnalyst.detail = [...this.bankAccAnalyst.detail, new BankAccountAnalystDetail()];
  }

  public save(): void {
    this._dialog.close(this.bankAccAnalyst);
  }

  currencyInputChanged(value) {
    const num = value.replace(/[$,]/g, '');
    return Number(num);
  }
}
