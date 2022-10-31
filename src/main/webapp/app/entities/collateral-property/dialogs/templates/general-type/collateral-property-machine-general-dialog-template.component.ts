import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { IUom } from 'app/entities/uom/uom.model';
import {
  GUARANTEE_LETTER_COLLATERAL_DETAIL_TYPE,
  GUARANTEE_TYPE,
  GUARANTEE_BIS_COL_DETAIL_TYPE,
} from 'app/shared/constants/base.constants';
import { ICollateralProperty } from '../../../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-machine-general-dialog-template',
  templateUrl: './collateral-property-machine-general-dialog-template.component.html',
})
export class CollateralPropertyMachineGeneralDialogTemplateComponent implements OnChanges {
  private _collateralProperty: ICollateralProperty;
  @Input()
  get collateralProperty() {
    return this._collateralProperty;
  }
  set collateralProperty(param: ICollateralProperty) {
    this._collateralProperty = param;
  }

  public currencies: IUom[];
  public countries: IStateBoundary[];
  public areaMeasure: IUom[];
  public guaranteeType: any;
  public guaranteeBisColDetailType: any;
  public collateralDetailType: any;
  constructor() {
    this.collateralDetailType = GUARANTEE_LETTER_COLLATERAL_DETAIL_TYPE;
    this.guaranteeType = GUARANTEE_TYPE;
    this.guaranteeBisColDetailType = GUARANTEE_BIS_COL_DETAIL_TYPE;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateralProperty']) {
      console.log('hello world');
    }
  }
}
