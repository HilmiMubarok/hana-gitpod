import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ICollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import lodash from 'lodash';
import { COLLATERAL_BINDING_TYPE } from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-collateral-type-dialog',
  templateUrl: './collateral-type-dialog.component.html',
})
export class CollateralTypeDialogComponent implements OnInit {
  private _collateral: ICollateral;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(item: ICollateral) {
    this._collateral = item;
  }

  private _disabledOpt: any;
  @Input()
  get disabledOpt() {
    return this._disabledOpt;
  }

  set disabledOpt(item: any) {
    this._disabledOpt = item;
  }

  public bindingTypes: any;
  public collateralDetails: object[];
  public collateralTypes: ICollateralType[];
  public collateralCode: object[];
  constructor(private collateralTypeService: CollateralTypeService, private cashCollateralService: CashCollateralService) {
    this.bindingTypes = COLLATERAL_BINDING_TYPE;
  }

  ngOnInit(): void {
    this.loadCollateralDetailOption();
    this.loadCollateralType();
  }

  private loadCollateralDetailOption(): void {
    this.cashCollateralService.loadDetailType().subscribe(res => {
      this.collateralDetails = res.body;
    });
  }

  private loadCollateralType(): void {
    this.collateralTypeService.query().subscribe(res => {
      this.collateralTypes = res.body;
    });
  }

  public changeCollateralType(event: MatSelectChange): void {
    this.collateralCode = lodash.find(this.collateralDetails, function (o) {
      return o['id'] === event.value;
    })['child'];
  }

  public changeCollateralCode(event: MatSelectChange): void {
    this.collateral.attributes.collateralProposePricing = lodash.find(this.collateralCode, function (o) {
      return o['id'] === event.value;
    })['proposePricing'];
  }
}
