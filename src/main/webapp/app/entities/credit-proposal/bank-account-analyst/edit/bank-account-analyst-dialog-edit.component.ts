import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators } from '@angular/forms';
import { ICreditProposal } from '../../credit-proposal.model';
import { BankAccountAnalystDetail, IBankAccountAnalyst, IBankAccountAnalystDetail } from '../bank-account-analyst.model';
import lodash from 'lodash';
import * as _moment from 'moment';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UomService } from 'app/entities/uom/uom.service';
import { IUom } from 'app/entities/uom/uom.model';
import { Observable, map, startWith } from 'rxjs';
import { UOM_TYPE } from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-credit-proposal-bank-account-analyst-dialog',
  templateUrl: './bank-account-analyst-dialog-edit.component.html',
  styleUrls: ['../bank-account-analyst-dialog.component.css'],
})
export class CreditProposalBankAccountAnalystDialogEditComponent implements OnInit {
  public banks: string[] = ['BCA', 'CIMB NIAGA', 'OCBC NISP', 'PANIN', 'PERMATA', 'MANDIRI', 'OTHERS'];
  public displayedColumns: string[] = ['date', 'debit', 'fqDebit', 'credit', 'fqCredit', 'lowest', 'highest', 'balance', 'action'];
  public creditProposal: ICreditProposal;
  public bankAccAnalyst: IBankAccountAnalyst;
  public bankAccAnalyst1: IBankAccountAnalyst;
  public edit: boolean;
  // public ccy: string[] = ['EUR', 'USD', 'IDR', 'KRW', 'CNY', 'CAD', 'AUD'];
  public ccy: IUom[];
  public curen: string;
  public ccyControl = new FormControl();
  public filteredCcy: Observable<IUom[]>;

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
  public applicationProduct: IApplicationProduct;
  public setData: string;
  public currencyName: number;
  public logoCcy;
  public conCcy = false;
  public allNegative: boolean;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { creditProposal: ICreditProposal; bankAccountAnalyst: IBankAccountAnalyst; edit: boolean },
    private _dialog: MatDialogRef<CreditProposalBankAccountAnalystDialogEditComponent>,
    private _snackBar: MatSnackBar,
    public creditProposalService: CreditProposalService,
    private uomService: UomService
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.bankAccAnalyst = this.data.bankAccountAnalyst;
    this.bankAccAnalyst1 = lodash.cloneDeep(this.data.bankAccountAnalyst);
    if (this.bankAccAnalyst.detail.length === 0) {
      this.bankAccAnalyst.detail = [...this.bankAccAnalyst.detail, new BankAccountAnalystDetail()];
    }
    this.edit = this.data.edit;
    this.creditProposal = this.data.creditProposal;
  }

  ngOnInit(): void {
    this.loadCurrencyMeasure();
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
      const _detail = this.bankAccAnalyst.detail.map(t => t.balance);
      const arg = _detail.every(n => n < 0);

      if (arg === false) {
        this.allNegative = false;
        return (result = _detail.filter(balance => balance >= 0).reduce((acc, value) => acc + value, 0));
      } else {
        this.allNegative = true;
        return (result = _detail.reduce((acc, value) => acc + value, 0));
      }
    } else {
      return result;
    }
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
      if (this.allNegative === false) {
        const jumlah = this.bankAccAnalyst.detail.map(t => t.balance).filter(balance => balance >= 0);
        result = this.getTotalBalance() / jumlah.length;
      } else {
        const jumlah = this.bankAccAnalyst.detail.map(t => t.balance).filter(balance => balance <= 0);
        result = this.getTotalBalance() / jumlah.length;
      }
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
      this._snackBar.open('Value of Equivalent to IDR Cannot Be 0 or Lower', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    this._dialog.close({ bankAccAnalyst: this.bankAccAnalyst, action: 'save' });
  }
  // public close() {
  //   this._dialog.close({ bankAccAnalyst: this.bankAccAnalyst1, action: 'cancel' });
  // }
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

  // public changeCurency(value: string) {
  //   this.curen = value;
  //   this.setData = new Date().toISOString().split('T')[0];
  //   this.creditProposalService.getCurrency(value, 'IDR', this.setData.replace(/-/g, '')).subscribe(res => {
  //     this.currencyName = res.body[0]?.factor;

  //     this.bankAccAnalyst.convert = res.body[0]?.factor;
  //     if (value === 'IDR') {
  //       this.conCcy = true;
  //       this.logoCcy = { prefix: 'IDR', thousands: ',', decimal: ',', precision: 0 };
  //     } else if (value === 'USD') {
  //       this.conCcy = true;
  //       this.logoCcy = {};
  //     } else if (value === 'EUR') {
  //       this.conCcy = true;
  //       this.logoCcy = {};
  //     } else if (value === 'KRW') {
  //       this.conCcy = true;
  //       this.logoCcy = {};
  //     } else if (value === 'CNY') {
  //       this.conCcy = true;
  //       this.logoCcy = {};
  //     } else if (value === 'CAD') {
  //       this.conCcy = true;
  //       this.logoCcy = {};
  //     } else if (value === 'AUD') {
  //       this.conCcy = true;
  //       this.logoCcy = {};
  //     }
  //   });
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
        this._dialog.close({ bankAccAnalyst: this.bankAccAnalyst1, action: 'cancel' });
      }
    });
  }

  private _filterCcy(value: string): IUom[] {
    const filterValue = value.toLowerCase();
    const filtered = this.ccy.filter(
      ccy => ccy.abbreviation.toLowerCase().includes(filterValue) || ccy.description.toLowerCase().includes(filterValue)
    );
    return filtered;
  }

  filteredCurrency() {
    this.filteredCcy = this.ccyControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCcy(value))
    );
  }

  public changeCurency(value: MatAutocompleteSelectedEvent) {
    this.curen = value.option.value;
    this.setData = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency(this.curen, 'IDR', this.setData.replace(/-/g, '')).subscribe(res => {
      this.currencyName = res.body[0]?.factor;
      this.bankAccAnalyst.convert = res.body[0]?.factor;

      if (this.curen === 'IDR') {
        this.conCcy = true;
        this.logoCcy = { prefix: 'IDR', thousands: '.', decimal: ',', precision: 0 };
      } else {
        this.conCcy = true;
        this.logoCcy = {};
      }
    });
  }

  private loadCurrencyMeasure(): void {
    this.uomService
      .queryFilterBy({
        idUomType: UOM_TYPE.CURRENCY,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.ccy = res.body;
        // Mengurutkan secara ascending berdasarkan abbreviation
        this.ccy.sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));
        this.filteredCurrency();
      });
  }
}
