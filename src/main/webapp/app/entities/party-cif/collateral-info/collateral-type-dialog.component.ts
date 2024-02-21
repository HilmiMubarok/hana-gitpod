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
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { CollateralParameter, ICollateralParameter } from 'app/entities/master-parameter/collateral-parameter/collateral-parameter.model';
import { CollateralParameterService } from 'app/entities/master-parameter/collateral-parameter/collateral-parameter.service';
import { CollateralProposePricingParameterService } from 'app/entities/master-parameter/collateral-parameter/collateral-propose-pricing/propose-pricing-parameter.service';

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
  styleUrls: ['./collateral-type-dialog.style.scss'],
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
  public bindingvalue: string;
  public gradingvalue: string;
  public facilityTypeValue: string;
  moment = _rollupMoment || _moment;
  date = new FormControl(moment());
  public collateralCodeValue: string;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(item: ICollateral) {
    this._collateral = item;
  }
  @Input() collateralAppraisal: ICollateralAppraisal;
  @Input() public type: string;
  @Input()
  get disabledOpt() {
    return this._disabledOpt;
  }

  set disabledOpt(item: any) {
    this._disabledOpt = item;
  }

  public corporatePersonalGuaranteeType = {
    appraise: false,
    attributes: {},
    description: 'Corporate/Personal Guarantee',
    id: 'GUARANTEE',
    parentDescription: null,
    parentId: null,
  };
  public facilityTypes: any;
  public collateralGrading = [];
  public bindingTypes = [];
  public collateralDetails: object[];
  public collateralTypes: ICollateralType[];
  public collateralCode: ICollateralParameter[];
  constructor(
    private collateralTypeService: CollateralTypeService,
    protected generalParameterService: GeneralParameterService,
    protected collateralParameterService: CollateralParameterService,
    protected collateralProposePricingService: CollateralProposePricingParameterService
  ) {
    // this.bindingTypes = COLLATERAL_BINDING_TYPE;

    this.collateralStatus = STATUS_COLLATERAL;
    this.paripasuStatus = PARIPASU_STATUS;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      console.log('hello world');
    }
  }

  ngOnInit(): void {
    // this.loadCollateralDetailOption().then(resolve => {
    //   this.setCollateralDetail();
    // });
    this.loadCollateralType();
    this.loadCollateralGrading();
    this.cekData();
    this.lovBindingType();
    this.collateralFacilityTypeLov();
    this.loadCollateralCode();
  }
  public lovBindingType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_BINDING_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.bindingTypes = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        if (this.bindingTypes) {
          let element: string;
          for (let i = 0; i < this.bindingTypes.length; i++) {
            if (this.collateral.collBindingType === this.bindingTypes[i].code) {
              element = this.bindingTypes[i].value;
            }
          }
          this.bindingvalue = element;
        }
      });
  }

  public disabledOccupansy() {
    if (this.type === 'appraisal') {
      return true;
    }
    return false;
  }

  public cekData() {
    if (this.collateral.paripasuStatus === undefined) {
      this.collateral.paripasuStatus = 'N';
    }
  }

  private loadCollateralGrading(): void {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_GRADING',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.collateralGrading = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        if (this.bindingTypes) {
          let element: string;
          for (let i = 0; i < this.collateralGrading.length; i++) {
            if (this.collateral.collateralGrading === this.collateralGrading[i].code) {
              element = this.collateralGrading[i].value;
            }
          }
          this.gradingvalue = element;
        }
      });
  }

  // private setCollateralDetail(): void {
  //   if (this.collateral.id) {
  //     const collateral = this.collateral;
  //     this.collateralCode = lodash.find(this.collateralDetails, function (o) {
  //       return o['id'] === collateral.collateralTypeId;
  //     })['child'];
  //   }
  // }

  // private loadCollateralDetailOption(): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     this.cashCollateralService.loadDetailType().subscribe(res => {
  //       this.collateralDetails = res.body;
  //       resolve();
  //     });
  //   });
  // }

  private loadCollateralType(): void {
    this.collateralTypeService.query().subscribe(res => {
      this.collateralTypes = res.body.filter(obj => obj.id !== 'CASH');
    });
  }

  public changeCollateralType(event: MatSelectChange): void {
    this.collateralParameterService
      .queryFilterBy({
        collateralType: event.value,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        // Filter status Active in collateral type
        this.collateralCode = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });

        this.collateral.attributes.collateralProposePricing = '';
        this.collateral.attributes.collateralCode = '';
      });
  }

  public changeCollateralCode(event: any): void {
    const idCollateralParam = this.collateralCode.filter(e => e.collateralTypeCode === event);
    const collateralParamId: any = idCollateralParam.map(e => e.id);
    event = collateralParamId;
    if (event) {
      this.collateralProposePricingService.filterTableData(event).subscribe(res => {
        let element: string;
        if (res.body) {
          for (let i = 0; i < res.body.length; i++) {
            element = res.body[i].proposePricing;
          }
          this.collateral.attributes.collateralProposePricing = element;
        }
      });
    }
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

  public collateralFacilityTypeLov() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_FACILITY_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.facilityTypes = lodash.filter(res.body, function (obj) {
          return obj.statusId === 'ACTIVE';
        });
        if (this.facilityTypes) {
          let element: string;
          for (let i = 0; i < this.facilityTypes.length; i++) {
            if (this.collateral.facilityType === this.facilityTypes[i].code) {
              element = this.facilityTypes[i].value;
            }
          }
          this.facilityTypeValue = element;
        }
      });
  }

  public collateralCodeLov() {
    this.collateralParameterService
      .queryFilterBy({
        collateralType: 'vehicle',
      })
      .subscribe(res => {
        console.log('ini parameter ', res.body);
      });
  }

  public loadCollateralCode() {
    if (this.collateral.collateralTypeId) {
      this.collateralParameterService
        .queryFilterBy({
          collateralType: this.collateral.collateralTypeId,
          page: 0,
          size: 9999,
        })
        .subscribe(res => {
          this.collateralCode = res.body;
          if (this.collateralCode) {
            for (let i = 0; i < this.collateralCode.length; i++) {
              if (this.collateral.attributes.collateralCode === this.collateralCode[i].collateralTypeCode) {
                this.collateralCodeValue = this.collateralCode[i].collateralTypeCodeDescription;
              }
            }
          }
        });
    }
  }
  public getParipasuStatus(element: string) {
    if (element === 'N') {
      return 'NO';
    }
    if (element === 'Y') {
      return 'YES';
    }
    return element;
  }
}
