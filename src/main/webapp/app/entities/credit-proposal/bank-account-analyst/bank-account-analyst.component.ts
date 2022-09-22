import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICreditProposal } from '../credit-proposal.model';
import { CreditProposalBankAccountAnalystDialogComponent } from './bank-account-analyst-dialog.component';
import { BankAccountAnalyst, IBankAccountAnalyst } from './bank-account-analyst.model';

@Component({
  selector: 'jhi-credit-proposal-bank-account-analyst',
  templateUrl: './bank-account-analyst.component.html',
})
export class CreditProposalBankAccountAnalystComponent implements OnInit {
  private _creditProposal: ICreditProposal;
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

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  public displayedColumns: string[] = [
    'no',
    'bank',
    'accNo',
    'accName',
    'ccy',
    'debit',
    'fqDebit',
    'credit',
    'fqCredit',
    'balance',
    'action',
  ];
  constructor(public dialog: MatDialog) {}

  public openDialog(element: IBankAccountAnalyst = null): void {
    const predicate = { width: '80vw', data: {} };
    if (element) {
      predicate.data['bankAccountAnalyst'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['bankAccountAnalyst'] = new BankAccountAnalyst();
      predicate.data['view'] = false;
    }

    const dialogRef = this.dialog.open(CreditProposalBankAccountAnalystDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.creditProposal.attributes['bankAnalyst'] = [...this.creditProposal.attributes['bankAnalyst'], res];
        this.refreshTotal(res);
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

  public deleteAccount(element) {
    const data = this.creditProposal.attributes['bankAnalyst'].filter(({ accNo }) => accNo !== element.accNo);
    this.creditProposal.attributes['bankAnalyst'] = data;
    this.deleteTotal(data);

    if (element.accNo > 0) {
      // average other
      this.totalData = this.findByMatchingProperties(this.totalData, element.average_other);
    } else {
      // average
      this.totalData = this.findByMatchingProperties(this.totalData, element.average);
    }
  }
}
