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

@Component({
  selector: 'jhi-nilai-pembelian-add',
  templateUrl: './credrit-proposal-risk-acceptance-criteria-add.html',
  styleUrls: ['./nilai-pembelian.css'],
})
export class CreditProposalRacNilaiPembelianAddComponent {
  public nilaiRac: INilaiRac;
  public nilaiRacA = {
    nilaiPembelian: '',
    jenisJaminan: '',
    facilityType: '',
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
    private uomService: UomService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: ICreditProposal;
      lovBelow: INilaiRac;
      view: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalRacNilaiPembelianAddComponent>
  ) {
    (this.item = this.data.item), (this.view = this.data.view);
    this.nilaiRac = this.data.lovBelow;
    this.loadCurrencyMeasure();
  }

  public save(): void {
    this.nilaiRacA['nilaiPembelian'] = this.nilaiRac.nilaiPembelian;
    this.nilaiRacA['jenisJaminan'] = this.nilaiRac.jenisJaminan;
    this.nilaiRacA['facilityType'] = this.nilaiRac.facilityType;
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
}
