import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import lodash from 'lodash';
import { ICreditProposal } from '../credit-proposal.model';
import { CreditProposalBankAccountAnalystDialogComponent } from './bank-account-analyst-dialog.component';
import { BankAccountAnalyst, IBankAccountAnalyst } from './bank-account-analyst.model';
import { CreditProposalBankAccountAnalystDialogEditComponent } from './edit/bank-account-analyst-dialog-edit.component';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-credit-proposal-bank-account-analyst',
  templateUrl: './bank-account-analyst.component.html',
  styleUrls: ['./bank-account-analyst-dialog.component.css'],
})
export class CreditProposalBankAccountAnalystComponent implements OnInit {
  public allNegative: boolean;
  private _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  public total: any = {
    debit: null,
    fqDebit: null,
    credit: null,
    fqCredit: null,
    balance: null,
  };
  public totalData = [];

  ngOnInit(): void {
    const data = this.creditProposal.attributes['bankAnalyst'];
    data.length > 0 ? this.getTotal(data) : null;
  }
  public getTotal(data) {
    data.filter(item => item.convert > 0).map(item => (this.totalData = [...this.totalData, item.average_other]));
    data.filter(item => item.convert === 0).map(item => (this.totalData = [...this.totalData, item.average]));

    this.total = this.totalData.reduce((acc, obj) => (acc = this.deepMergeSum(acc, obj)));
  }

  public deleteTotal(data) {
    if (data.length === 0) {
      this.total = {
        debit: null,
        fqDebit: null,
        credit: null,
        fqCredit: null,
        balance: null,
      };
      data = this.total;
      this.totalData = [];
    } else {
      let deleteData = [];
      data.filter(item => item.convert > 0).map(item => (deleteData = [...deleteData, item.average_other]));
      data.filter(item => item.convert === 0).map(item => (deleteData = [...deleteData, item.average]));
      this.total = deleteData.reduce((acc, obj) => (acc = this.deepMergeSum(acc, obj)));
    }
  }

  public refreshTotal(data) {
    if (this.totalData.length > 0) {
      data.convert > 0 ? (this.totalData = [...this.totalData, data.average_other]) : (this.totalData = [...this.totalData, data.average]);
    } else {
      data.convert > 0 ? (this.totalData = [data.average_other]) : (this.totalData = [data.average]);
    }

    this.total = this.totalData.reduce((acc, obj) => (acc = this.deepMergeSum(acc, obj)));
  }

  public deepMergeSum(obj1, obj2) {
    return Object.keys(obj1).reduce((acc, key) => {
      if (typeof obj2[key] === 'object') {
        acc[key] = this.deepMergeSum(obj1[key], obj2[key]);
        // eslint-disable-next-line no-prototype-builtins
      } else if (obj2.hasOwnProperty(key) && !isNaN(parseFloat(obj2[key]))) {
        acc[key] = obj1[key] + obj2[key];
      }
      return acc;
    }, {});
  }

  public displayedColumns: string[] = [
    'no',
    'bank',
    'accNo',
    'ccy',
    'accName',
    'debit',
    'fqDebit',
    'credit',
    'fqCredit',
    'balance',
    'action',
  ];
  constructor(public dialog: MatDialog) {}

  public openDialog(element: IBankAccountAnalyst = null): void {
    const predicate = { width: '80vw', data: { creditProposal: this.creditProposal } };
    if (element) {
      predicate.data['bankAccountAnalyst'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['bankAccountAnalyst'] = new BankAccountAnalyst();
      predicate.data['view'] = false;
    }

    const dialogRef = this.dialog.open(CreditProposalBankAccountAnalystDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res.action !== 'cancel') {
        this.creditProposal.attributes['bankAnalyst'] = [...this.creditProposal.attributes['bankAnalyst'], res.bankAccAnalyst];
        this.refreshTotal(res.bankAccAnalyst);
      }
    });
  }
  public edit(element: IBankAccountAnalyst = null): void {
    const predicate = { width: '80vw', data: { creditProposal: this.creditProposal } };

    if (element) {
      predicate.data['bankAccountAnalyst'] = element;
      predicate.data['edit'] = true;
    } else {
      predicate.data['bankAccountAnalyst'] = new BankAccountAnalyst();
      predicate.data['edit'] = false;
    }
    const dialogRef = this.dialog.open(CreditProposalBankAccountAnalystDialogEditComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res.action !== 'cancel') {
        const bankindex: number = lodash.findIndex(this.creditProposal.attributes['bankAccountAnalyst'], function (o: IBankAccountAnalyst) {
          return o.id === res.bankAccAnalyst['bankAccountAnalyst'].id;
        });
        if (bankindex > -1) {
          this.creditProposal.attributes['bankAccountAnalyst'][bankindex] = res.bankAccAnalyst['bankAccountAnalyst'];
        } else {
          this.creditProposal.attributes['bankAccountAnalyst'] = [
            ...this.creditProposal.attributes['bankAccountAnalyst'],
            res.bankAccAnalyst['bankAccountAnalyst'],
          ];
        }
      } else {
        const temp = lodash.cloneDeep(this.creditProposal.attributes['bankAnalyst']);
        const bankindex: number = lodash.findIndex(this.creditProposal.attributes['bankAnalyst'], function (o: IBankAccountAnalyst) {
          return o.id === res.bankAccAnalyst.id;
        });

        this.creditProposal.attributes['bankAnalyst'] = [];
        for (let i = 0; i < temp.length; i++) {
          if (i === bankindex) {
            this.creditProposal.attributes['bankAnalyst'].push(res.bankAccAnalyst);
          } else {
            this.creditProposal.attributes['bankAnalyst'].push(temp[i]);
          }
        }
      }
    });
  }

  public findByMatchingProperties(set, properties) {
    return set.filter(function (entry) {
      return Object.keys(properties).every(function (key) {
        return entry[key] === properties[key];
      });
    });
  }

  // start debit section

  public getDebit(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    const detail = element.detail;
    if (detail.length > 0) {
      for (let a = 0; a < detail.length; a++) {
        result = result + detail[a].debit;
      }
    }

    return result;
  }

  public getDebitAverage(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    const detail = element.detail;
    if (detail.length > 0) {
      for (let a = 0; a < detail.length; a++) {
        result = this.getDebit(element) / detail.length;
      }
    }

    return result;
  }

  public getDebitConversion(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    const detail = element.detail;

    if (detail.length > 0) {
      for (let a = 0; a < detail.length; a++) {
        result = this.getDebitAverage(element) * (element.convert ? element.convert : 1);
      }
    }

    return result;
  }

  public getTotalDebit(): number {
    let result: number;
    result = 0;

    if (this.creditProposal.attributes['bankAnalyst'].length > 0) {
      const bankAnalyst: IBankAccountAnalyst[] = this.creditProposal.attributes['bankAnalyst'];
      for (let i = 0; i < bankAnalyst.length; i++) {
        result = result + this.getDebitConversion(bankAnalyst[i]);
      }
    }

    return result;
  }

  // end debit section

  // start fq debit section

  public getFqDebit(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    const detail = element.detail;
    if (detail.length > 0) {
      for (let a = 0; a < detail.length; a++) {
        result = result + detail[a].fqDebit;
      }
    }

    return result;
  }

  public getFqDebitAverage(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    const detail = element.detail;
    if (detail.length > 0) {
      for (let a = 0; a < detail.length; a++) {
        result = this.getFqDebit(element) / detail.length;
      }
    }

    return result;
  }

  public getTotalFqDebit(): number {
    let result: number;
    result = 0;

    if (this.creditProposal.attributes['bankAnalyst'].length > 0) {
      const bankAnalyst: IBankAccountAnalyst[] = this.creditProposal.attributes['bankAnalyst'];
      for (let i = 0; i < bankAnalyst.length; i++) {
        result = result + this.getFqDebitAverage(bankAnalyst[i]);
      }
    }

    return result;
  }

  // end fq debit section

  // start credit section

  public getCredit(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    const detail = element.detail;
    if (detail.length > 0) {
      for (let a = 0; a < detail.length; a++) {
        result = result + detail[a].credit;
      }
    }

    return result;
  }

  public getCreditAverage(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    const detail = element.detail;
    if (detail.length > 0) {
      for (let a = 0; a < detail.length; a++) {
        result = this.getCredit(element) / detail.length;
      }
    }

    return result;
  }

  public getCreditConversion(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    const detail = element.detail;
    if (detail.length > 0) {
      for (let a = 0; a < detail.length; a++) {
        result = this.getCreditAverage(element) * (element.convert ? element.convert : 1);
      }
    }

    return result;
  }

  public getTotalCredit(): number {
    let result: number;
    result = 0;

    if (this.creditProposal.attributes['bankAnalyst'].length > 0) {
      const bankAnalyst: IBankAccountAnalyst[] = this.creditProposal.attributes['bankAnalyst'];
      for (let i = 0; i < bankAnalyst.length; i++) {
        result = result + this.getCreditConversion(bankAnalyst[i]);
      }
    }

    return result;
  }

  // start fq credit section

  public getFqCredit(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    const detail = element.detail;
    if (detail.length > 0) {
      for (let a = 0; a < detail.length; a++) {
        result = result + detail[a].fqCredit;
      }
    }

    return result;
  }

  public getFqCreditAverage(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    const detail = element.detail;
    if (detail.length > 0) {
      for (let a = 0; a < detail.length; a++) {
        result = this.getFqCredit(element) / detail.length;
      }
    }

    return result;
  }

  public getTotalFqCredit(): number {
    let result: number;
    result = 0;

    if (this.creditProposal.attributes['bankAnalyst'].length > 0) {
      const bankAnalyst: IBankAccountAnalyst[] = this.creditProposal.attributes['bankAnalyst'];
      for (let i = 0; i < bankAnalyst.length; i++) {
        result = result + this.getFqCreditAverage(bankAnalyst[i]);
      }
    }

    return result;
  }

  // end fq credit section

  // start balance section

  public getBalance(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    const detail = element.detail;
    if (detail.length > 0) {
      for (let a = 0; a < detail.length; a++) {
        result = result + detail[a].balance;
      }
    }

    return result;
  }

  public getBalanceAverage(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    if (this.creditProposal.attributes['bankAnalyst'].length > 0) {
      const bankAnalyst: IBankAccountAnalyst[] = this.creditProposal.attributes['bankAnalyst'];
      for (let i = 0; i < bankAnalyst.length; i++) {
        result = result + bankAnalyst[i].average.balance;
      }
    }
    return result;
  }

  public getBalanceConversion(element: IBankAccountAnalyst): number {
    let result: number;
    result = 0;

    const detail = element.detail;
    if (detail.length > 0) {
      const jumlah = detail.map(t => t.balance).filter(balance => balance >= 0);
      result = this.getBalanceAverage(element) / jumlah.length;
    }

    return result;
  }

  public getTotalBalance(): number {
    let result: number;
    result = 0;

    if (this.creditProposal.attributes['bankAnalyst'].length > 0) {
      const bankAnalyst: IBankAccountAnalyst[] = this.creditProposal.attributes['bankAnalyst'];
      for (let i = 0; i < bankAnalyst.length; i++) {
        result = result + bankAnalyst[i].average_other.balance;
      }
    }

    return result;
  }

  // Delete Confirmation
  public deleteAccount(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Account Data',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const data = this.creditProposal.attributes['bankAnalyst'].filter(({ accNo }) => accNo !== element.accNo);
        this.creditProposal.attributes['bankAnalyst'] = data;

        if (element.accNo > 0) {
          // average other
          this.totalData = this.findByMatchingProperties(this.totalData, element.average_other);
        } else {
          // average
          this.totalData = this.findByMatchingProperties(this.totalData, element.average);
        }
      }
    });
  }
}
