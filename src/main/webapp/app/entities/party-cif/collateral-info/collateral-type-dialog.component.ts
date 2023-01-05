import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ICollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import lodash from 'lodash';
import { COLLATERAL_BINDING_TYPE, COLLATERAL_FACILITY_TYPE } from 'app/shared/constants/base.constants';
import { OptionNode } from 'app/shared/model/option-node.model';
import { PARIPASU_STATUS, STATUS, STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import moment from 'moment';
import { FormControl } from '@angular/forms';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY/MM/DD',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY/MM/DD',
  },
};
@Component({
  selector: 'jhi-collateral-type-dialog',
  templateUrl: './collateral-type-dialog.component.html',
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CollateralTypeDialogComponent implements OnInit, OnChanges {
  public _collateral: ICollateral;
  public _disabledOpt: any;
  public _hiddenOpt = true;
  public collateralStatus: any;
  public paripasuStatus: any;
  moment = _rollupMoment || _moment;
  date = new FormControl(moment());
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(item: ICollateral) {
    this._collateral = item;
  }
  @Input() collateralAppraisal: ICollateralAppraisal;
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
    this.collateralStatus = STATUS_COLLATERAL;
    this.paripasuStatus = PARIPASU_STATUS;
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
    this.cekData();
  }

  public cekData() {
    if (this.collateral.paripasuStatus === undefined) {
      this.collateral.paripasuStatus = 'N';
    }
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
      this.collateralTypes.pop();
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

  public dataSource() {
    if (this.collateral.dataSource === 'h' || this.collateral.dataSource === 'H') {
      return true;
    }

    if (this.disabledOpt === true) {
      return true;
    }

    return false;
  }
  hideordisable() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
  }
}
