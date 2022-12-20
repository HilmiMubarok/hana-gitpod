import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICreditProposal } from '../credit-proposal.model';
import { BankAccountAnalystDetail, IBankAccountAnalyst, IBankAccountAnalystDetail } from './bank-account-analyst.model';
import { FormControl, Validators } from '@angular/forms';
import { CreditProposalService } from '../credit-proposal.service';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';

@Component({
  selector: 'jhi-credit-proposal-bank-account-analyst-dialog',
  templateUrl: './bank-account-analyst-dialog.component.html',
  styleUrls: ['./bank-account-analyst-dialog.component.css'],
})
export class CreditProposalBankAccountAnalystDialogComponent {
  public banks: string[] = ['BCA', 'CIMB NIAGA', 'OCBC NISP', 'PANIN', 'PERMATA', 'MANDIRI'];
  public displayedColumns: string[] = ['date', 'debit', 'fqDebit', 'credit', 'fqCredit', 'lowest', 'highest', 'balance', 'action'];
  public creditProposal: ICreditProposal;
  public applicationProduct: IApplicationProduct;
  public bankAccAnalyst: IBankAccountAnalyst;
  public view: boolean;
  public ccy: string[] = ['IDR', 'USD'];
  public curen: string;

  public validBankControl = new FormControl('', [Validators.required]);
  public validAccountNo = new FormControl('', [Validators.required]);
  public validCcy = new FormControl('', [Validators.required]);
  public validEqToIDR = new FormControl('', [Validators.required]);
  public ValidMonthYear = new FormControl('', [Validators.required]);
  public validDebit = new FormControl('', [Validators.required]);
  public validFqCr = new FormControl('', [Validators.required]);
  public validHighest = new FormControl('', [Validators.required]);
  public validAverageBalance = new FormControl('', [Validators.required]);
  public validFqDb = new FormControl('', [Validators.required]);
  public validCredit = new FormControl('', [Validators.required]);
  public validLowest = new FormControl('', [Validators.required]);
  public setData: string;
  public currencyName: number;
  public preCurent = '';
  public logoCcy;
  public conCcy = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      creditProposal: ICreditProposal;
      bankAccountAnalyst: IBankAccountAnalyst;
      view: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalBankAccountAnalystDialogComponent>,
    private _snackBar: MatSnackBar,
    public creditProposalService: CreditProposalService
  ) {
    this.bankAccAnalyst = this.data.bankAccountAnalyst;
    if (this.bankAccAnalyst.detail.length === 0) {
      this.bankAccAnalyst.detail = [...this.bankAccAnalyst.detail, new BankAccountAnalystDetail()];
    }
    this.view = this.data.view;
    this.creditProposal = this.data.creditProposal;
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
    this.bankAccAnalyst.average.debit = result;
    return result;
  }

  public getAverageFqDebit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalFqDebit() / this.bankAccAnalyst.detail.length;
    }
    this.bankAccAnalyst.average.fqDebit = result;
    return result;
  }

  public getAverageCredit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalCredit() / this.bankAccAnalyst.detail.length;
    }
    this.bankAccAnalyst.average.credit = result;
    return result;
  }

  public getAverageFqCredit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalFqCredit() / this.bankAccAnalyst.detail.length;
    }
    this.bankAccAnalyst.average.fqCredit = result;
    return result;
  }

  public getAverageLowest(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalLowest() / this.bankAccAnalyst.detail.length;
    }
    this.bankAccAnalyst.average.lowest = result;
    return result;
  }

  public getAverageHighest(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalHighest() / this.bankAccAnalyst.detail.length;
    }
    this.bankAccAnalyst.average.highest = result;
    return result;
  }

  public getAverageBalance(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getTotalBalance() / this.bankAccAnalyst.detail.length;
    }
    this.bankAccAnalyst.average.balance = result;
    return result;
  }

  // Average Other CCY
  public getAverageOtherDebit() {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getAverageDebit() * (this.bankAccAnalyst.convert ? this.bankAccAnalyst.convert : 1);
    }
    this.bankAccAnalyst.average_other.debit = result;
    return result;
  }

  public getAverageOtherFqDebit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getAverageFqDebit() * (this.bankAccAnalyst.convert ? this.bankAccAnalyst.convert : 1);
    }
    this.bankAccAnalyst.average_other.fqDebit = result;
    return result;
  }

  public getAverageOtherCredit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getAverageCredit() * (this.bankAccAnalyst.convert ? this.bankAccAnalyst.convert : 1);
    }
    this.bankAccAnalyst.average_other.credit = result;
    return result;
  }

  public getAverageOtherFqCredit(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getAverageFqCredit() * (this.bankAccAnalyst.convert ? this.bankAccAnalyst.convert : 1);
    }
    this.bankAccAnalyst.average_other.fqCredit = result;
    return result;
  }

  public getAverageOtherLowest(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getAverageLowest() * (this.bankAccAnalyst.convert ? this.bankAccAnalyst.convert : 1);
    }
    this.bankAccAnalyst.average_other.lowest = result;
    return result;
  }

  public getAverageOtherHighest(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getAverageHighest() * (this.bankAccAnalyst.convert ? this.bankAccAnalyst.convert : 1);
    }
    this.bankAccAnalyst.average_other.highest = result;
    return result;
  }

  public getAverageOtherBalance(): number {
    let result: number;
    result = 0;
    if (this.bankAccAnalyst.detail.length > 0) {
      result = this.getAverageBalance() * (this.bankAccAnalyst.convert ? this.bankAccAnalyst.convert : 1);
    }
    this.bankAccAnalyst.average_other.balance = result;
    return result;
  }

  public addRow(): void {
    const newRow = { date: '', debit: 0, fqDebit: 0, credit: 0, fqCredit: 0, lowest: 0, highest: 0, balance: 0, isEdit: true };
    this.bankAccAnalyst.detail = [...this.bankAccAnalyst.detail, newRow];
  }

  public save(): void {
    if (this.bankAccAnalyst.convert <= 0) {
      this._snackBar.open('Value of Exchange Rate Cannot Be 0 or Lower', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    this._dialog.close({ bankAccAnalyst: this.bankAccAnalyst, action: 'cencel' });
  }
  public close() {
    this._dialog.close({ action: 'cancel' });
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }
  public curdIdr: number;
  getCurs() {
    this.setData = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency('USD', 'IDR', this.setData.replace(/-/g, '')).subscribe(res => {
      this.curdIdr = res.body[0]?.factor;
      // this.applicationProduct.attributes['initialLimit'] = this.applicationProduct.attributes['initialLimit'] * this.curdIdr;
      // this.applicationProduct.attributes['outstanding'] = this.applicationProduct.attributes['outstanding'] * this.curdIdr;
      // this.applicationProduct.attributes['changes'] = this.applicationProduct.attributes['changes'] * this.curdIdr;
    });
  }

  public changeCurency(value: string) {
    this.curen = value;
    this.setData = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency(value, 'IDR', this.setData.replace(/-/g, '')).subscribe(res => {
      this.currencyName = res.body[0]?.factor;
      this.bankAccAnalyst.convert = res.body[0]?.factor;
      if (this.preCurent === '') {
        if (value === 'IDR') {
          this.conCcy = true;
          this.logoCcy = { prefix: 'IDR', thousands: ',', decimal: ',', precision: 0 };
          this.preCurent = 'IDR';
        } else if (value === 'USD') {
          this.conCcy = true;
          this.logoCcy = {};
          this.preCurent = 'USD';
        }
      } else if (this.preCurent === 'IDR') {
        if (value === '') {
          this.conCcy = false;
          this.preCurent = '';
        } else if (value === 'USD') {
          this.conCcy = false;
          this.logoCcy = {};
          // this.applicationProduct.attributes['initialLimit'] = this.applicationProduct.attributes['initialLimit'] / this.currencyName;
          // this.applicationProduct.attributes['outstanding'] = this.applicationProduct.attributes['outstanding'] / this.currencyName;
          // this.applicationProduct.attributes['changes'] = this.applicationProduct.attributes['changes'] / this.currencyName;
          this.preCurent = 'USD';
        }
      } else if (this.preCurent === 'USD') {
        if (value === '') {
          this.conCcy = false;
          this.preCurent = '';
        } else if (value === 'IDR') {
          this.conCcy = true;
          this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
          this.getCurs();
          this.preCurent = 'IDR';
        }
      }
    });
  }
}
