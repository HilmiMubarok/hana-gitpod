import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { UOM_TYPE } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { map, Observable, startWith } from 'rxjs';
import { ICreditProposal } from '../../credit-proposal.model';
import { INilaiRac } from './nilai-pembelian.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'jhi-nilai-pembelian-add',
  templateUrl: './credrit-proposal-risk-acceptance-criteria-add.html',
  styleUrls: ['./nilai-pembelian.css'],
})
export class CreditProposalRacNilaiPembelianAddComponent {
  public nilaiRac: INilaiRac;
  private provisionFormat = '0,.00';
  public logoProvisonFee = '0,.00';
  public nilaiRacA = {
    nilaiPembelian: '',
    jenisJaminan: '',
    facilityType: '',
    totalPlafond: '',
    id: '',
    lovBelow: {},
  };
  public item: ICreditProposal;
  public view: boolean;
  public filteredOptionsCurrency: Observable<IUom[]>;
  public myControlCurrency = new FormControl();
  public amountCcy: IUom;
  public optionsCurrency: IUom[];

  constructor(
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private uomService: UomService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: ICreditProposal;
      lovBelow: INilaiRac;
      view: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalRacNilaiPembelianAddComponent>
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    (this.item = this.data.item), (this.view = this.data.view);
    this.nilaiRac = this.data.lovBelow;
    this.loadCurrencyMeasure();
  }

  public save(): void {
    this.nilaiRacA['nilaiPembelian'] = this.nilaiRac.nilaiPembelian;
    this.nilaiRacA['jenisJaminan'] = this.nilaiRac.jenisJaminan;
    this.nilaiRacA['facilityType'] = this.nilaiRac.facilityType;
    if (!this.nilaiRacA.facilityType) {
      this._snackBar.open('Masukan Facility type terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    this.nilaiRacA['totalPlafond'] = this.nilaiRac.totalPlafond;
    if (!this.nilaiRac.totalPlafond) {
      this._snackBar.open('Masukan Total Plafond terlebih dahulu', null, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    this.nilaiRacA['keteranganJaminan'] = this.nilaiRac.keteranganJaminan;
    this.nilaiRacA['id'] = this.nilaiRac.id;
    this.nilaiRacA['ccy'] = this.nilaiRac.ccy['id'];
    this._dialog.close(this.nilaiRacA);
  }
  private _filterCurrency(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsCurrency.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  filteredCurrency() {
    this.filteredOptionsCurrency = this.myControlCurrency.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterCurrency(name as string) : this.optionsCurrency.slice();
      })
    );
  }
  displayFnCurrency(curency: IUom): string {
    return curency && curency.id ? curency.id : '';
  }
  public loadCurrencyMeasure(): void {
    this.uomService
      .queryFilterBy({
        idUomType: UOM_TYPE.CURRENCY,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.optionsCurrency = res.body;
        this.filteredCurrency();
      });
  }
  public getAmountCcy() {}

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
        this._dialog.close();
      }
    });
  }
  public updateFormat(type, event) {
    if (type === 'Plafond') {
      if (event === '%p.a') {
        this.logoProvisonFee = this.provisionFormat;
      }
      if (event === 'Amount IDR') {
        this.logoProvisonFee = 'IDR ' + this.provisionFormat;
      }
      if (event === 'Amount USD') {
        this.logoProvisonFee = 'USD ' + this.provisionFormat;
      }
      if (event === '' || event === undefined) {
        this.logoProvisonFee = '';
      }
    }
  }
}
