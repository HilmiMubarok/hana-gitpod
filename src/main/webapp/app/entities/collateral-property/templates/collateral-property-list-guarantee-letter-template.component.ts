import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { GUARANTEE_LETTER_COLLATERAL_DETAIL_TYPE, GUARANTEE_TYPE, UOM_TYPE } from 'app/shared/constants/base.constants';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-list-guarantee-letter-template',
  templateUrl: './collateral-property-list-guarantee-letter-template.component.html',
})
export class CollateralPropertyListGuaranteeLetterTemplateComponent implements OnInit {
  @Output() openDialogEvent = new EventEmitter<ICollateralProperty>();

  public currencies: IUom[];
  private _dataSource: ICollateralProperty[];

  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }
  public displayColumns: string[] = [
    'no',
    'detailType',
    'guaranteeType',
    'guaranteeCoverage',
    'certificateNumber',
    'marketValue',
    'address',
    'accountOfficer',
    'action',
  ];

  public collateralDetailType: any;
  public guaranteeType: any;
  constructor(private uomService: UomService) {
    this.guaranteeType = GUARANTEE_TYPE;
    this.collateralDetailType = GUARANTEE_LETTER_COLLATERAL_DETAIL_TYPE;
  }

  ngOnInit(): void {
    this.loadCurrencyMeasure();
  }

  private loadCurrencyMeasure(): void {
    this.uomService
      .queryFilterBy({
        idUomType: UOM_TYPE.CURRENCY,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.currencies = res.body;
      });
  }

  public getCurrencyUOM(uomId: string): string {
    if (this.currencies.length > 0) {
      for (let i = 0; i < this.currencies.length; i++) {
        if (this.currencies[i].id === uomId) {
          return this.currencies[i].description;
        }
      }
    }
    return '';
  }

  public openDialog(element: ICollateralProperty): void {
    this.openDialogEvent.emit(element);
  }
}
