import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ICollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import lodash from 'lodash';
import { COLLATERAL_BINDING_TYPE, COLLATERAL_FACILITY_TYPE } from 'app/shared/constants/base.constants';
import { OptionNode } from 'app/shared/model/option-node.model';
import { STATUS } from 'app/shared/constants/status.constants';

@Component({
  selector: 'jhi-collateral-type-dialog',
  templateUrl: './collateral-type-dialog.component.html',
})
export class CollateralTypeDialogComponent implements OnInit, OnChanges {
  public _collateral: ICollateral;
  public _disabledOpt: any;
  public _hiddenOpt = true;
  public collateralStatus: any;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(item: ICollateral) {
    this._collateral = item;
  }

  @Input()
  get disabledOpt() {
    return this._disabledOpt;
  }

  set disabledOpt(item: any) {
    this._disabledOpt = item;
  }

  public facilityTypes: any;
  public bindingTypes: any;
  public collateralGrading: OptionNode[];
  public collateralDetails: object[];
  public collateralTypes: ICollateralType[];
  public collateralCode: object[];
  constructor(private collateralTypeService: CollateralTypeService, private cashCollateralService: CashCollateralService) {
    this.bindingTypes = COLLATERAL_BINDING_TYPE;
    this.facilityTypes = COLLATERAL_FACILITY_TYPE;
    this.collateralStatus = STATUS;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      console.log('hello world');
    }
  }

  ngOnInit(): void {
    this.loadCollateralDetailOption().then(resolve => {
      this.setCollateralDetail();
    });
    this.loadCollateralType();
    this.loadCollateralGrading();
  }

  private loadCollateralGrading(): void {
    this.cashCollateralService.loadCollateralGradingType().subscribe(res => {
      this.collateralGrading = res.body;
    });
  }

  private setCollateralDetail(): void {
    if (this.collateral.id) {
      const collateral = this.collateral;
      this.collateralCode = lodash.find(this.collateralDetails, function (o) {
        return o['id'] === collateral.collateralTypeId;
      })['child'];
    }
  }

  private loadCollateralDetailOption(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.cashCollateralService.loadDetailType().subscribe(res => {
        this.collateralDetails = res.body;
        resolve();
      });
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
