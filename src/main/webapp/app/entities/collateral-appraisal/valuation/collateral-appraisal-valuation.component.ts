import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EventManager } from 'app/core/util/event-manager.service';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICollateralAppraisal } from '../collateral-appraisal.model';

@Component({
  selector: 'jhi-collateral-appraisal-valuation',
  templateUrl: './collateral-appraisal-valuation.component.html',
  styleUrls: ['./collateral-appraisal-valuation.scss'],
})
export class CollateralAppraisalValuationComponent {
  private _collateral: ICollateral;
  private _collateralAppraisal: ICollateralAppraisal;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  @Input()
  get collateralAppraisal() {
    return this._collateralAppraisal;
  }
  set collateralAppraisal(param: ICollateralAppraisal) {
    this._collateralAppraisal = param;
  }

  public collateralProperties: ICollateralProperty[];
  constructor() {}
}
