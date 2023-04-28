import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { UOM_TYPE } from 'app/shared/constants/base.constants';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'jhi-main-facility-dialog',
  templateUrl: './main-facility-dialog.component.html',
  styleUrls: ['./main-facility-dialog.component.scss'],
})
export class MainFacilityDialogComponent implements OnInit {
  public myControlCurrency = new FormControl();
  public optionsCurrency: IUom[];
  public filteredOptionsCurrency: Observable<IUom[]>;
  public amountCcy: IUom;

  constructor(private uomService: UomService) {}

  ngOnInit(): void {
    this.loadCurrencyMeasure();
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

  private _filterCurrency(description: string): IUom[] {
    const filterValue = description.toLowerCase();
    return this.optionsCurrency.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  private loadCurrencyMeasure(): void {
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
}
