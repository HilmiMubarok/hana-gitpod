import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HtmlEditorService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { Observable, of } from 'rxjs';
import { ICreditProposalCollateralBinding, ICreditProposalCollateralInsurance } from '../credit-proposal-collateral-info.model';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { COLLATERAL_BINDING_TYPE, COLLATERAL_FACILITY_TYPE, COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { ICollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
import { OptionNode } from 'app/shared/model/option-node.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import moment from 'moment';
import { FormControl } from '@angular/forms';
import { PARIPASU_STATUS, STATUS_COLLATERAL } from 'app/shared/constants/status.constants';

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
  selector: 'jhi-credit-proposal-collateral-info-dialog',
  templateUrl: './credit-proposal-collateral-info-dialog.component.html',
  styleUrls: ['./collateral-info-dialog.css'],
  providers: [
    ToolbarService,
    HtmlEditorService,

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CreditProposalCollateralInfoDialogComponent implements OnInit {
  public collateralTypes: ICollateralType[];
  public collateralCode: object[];
  public collateralGrading: OptionNode[];
  public collateralDetails: object[];
  public bindingTypesHobies: any;
  public facilityTypes: any;
  public creditProposal: ICreditProposal;
  public creditProposalOpenState: ICreditProposal;
  public disabledOpt = true;
  public collateral: ICollateral;
  public insurance: ICreditProposalCollateralInsurance;
  public marketability: string;
  public internalMV: number;
  public internalLV: number;
  public kjjpMV: number;
  public kjjpLV: number;
  public properties: ICollateralProperty[];
  public filteredOptionBindingTypes: Observable<string[]>;
  public binding: ICreditProposalCollateralBinding;
  public lovRank = [];
  public paripasuStatus: any;
  public dataCertDueDate: any;
  public dataOwnerShip: string;
  public optionBindingTypes: string[] = [
    'HAK TANGGUNGAN (APHT)',
    'GADAI',
    'FEO',
    'SKMHT',
    'CESSIE',
    'HIPOTIK',
    'PERNYATAAN JAMINAN & KUASA',
    'BELUM DIIKAT',
    'LAINNYA',
  ];
  public lovCollateralStatus: any;
  public insuranceTypes: string[] = ['Partner', 'Non - Partner'];
  moment = _rollupMoment || _moment;
  date = new FormControl(moment());

  constructor(
    private creditProposalService: CreditProposalService,
    private collateralTypeService: CollateralTypeService,
    private cashCollateralService: CashCollateralService,
    private _dialog: MatDialogRef<CreditProposalCollateralInfoDialogComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      cp: ICreditProposal;
      collateral: ICollateral;
      marketability: string;
      internalMV: number;
      internalLV: number;
      properties: ICollateralProperty[];
      binding: ICreditProposalCollateralBinding;
      insurance: ICreditProposalCollateralInsurance;
      certDueDate: any;
      ownerShip: string;
    }
  ) {
    this.bindingTypesHobies = COLLATERAL_BINDING_TYPE;
    this.facilityTypes = COLLATERAL_FACILITY_TYPE;
    this.creditProposal = this.data.cp;
    this.creditProposalOpenState = lodash.cloneDeep(this.data.cp);
    this.collateral = this.data.collateral;
    this.marketability = this.data.marketability;
    this.internalMV = this.data.internalMV;
    this.internalLV = this.data.internalLV;
    this.properties = this.data.properties;
    this.binding = this.data.binding;
    this.insurance = this.data.insurance;
    for (let i = 1; i < 101; i++) {
      this.lovRank.push(i);
    }
    this.lovCollateralStatus = STATUS_COLLATERAL;
    this.paripasuStatus = PARIPASU_STATUS;
    this.dataCertDueDate = data.certDueDate;
    this.dataOwnerShip = data.ownerShip;
  }
  ngOnInit(): void {
    this.loadCollateralDetailOption().then(resolve => {
      this.setCollateralDetail();
    });
    this.loadCollateralType();
    this.loadCollateralGrading();
    this.trashUndefined();
    this.checkStatusCOllateral();
  }

  private loadCollateralGrading(): void {
    this.cashCollateralService.loadCollateralGradingType().subscribe(res => {
      this.collateralGrading = res.body;
    });
  }

  private loadCollateralDetailOption(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.cashCollateralService.loadDetailType().subscribe(res => {
        this.collateralDetails = res.body;
        resolve();
      });
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

  private loadCollateralType(): void {
    this.collateralTypeService.query().subscribe(res => {
      this.collateralTypes = res.body;
    });
  }

  public save() {
    if (!this.binding.collateralId) {
      this.binding.collateralId = this.collateral.id;
    }
    if (!this.insurance.collateralId) {
      this.insurance.collateralId = this.collateral.id;
    }
    this._dialog.close({
      binding: this.binding,
      collateral: this.collateral,
      insurance: this.insurance,
      creditProposal: this.creditProposal,
      action: 'save',
    });
  }

  public cancel() {
    this._dialog.close({
      binding: this.binding,
      collateral: this.collateral,
      insurance: this.insurance,
      creditProposal: this.creditProposalOpenState,
      action: 'cancel',
    });
  }

  public getCertificateDueDate(): string {
    return this.creditProposalService.getCertificationDate(this.collateral, this.properties);
  }

  public filterBindingType(): void {
    const text: string = this.binding.bindingType;

    const regex = new RegExp(`\\b${text}`, 'i');
    const filtered: any = this.optionBindingTypes.filter(n => regex.test(n));

    this.filteredOptionBindingTypes = of(filtered);
  }

  currencyInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  public print() {
    console.log('ini collateral', this.collateral, 'ini collateral type', this.collateralTypes);
  }

  public getCreditProposalMappingData(creditProposalMappingData: any): void {
    this.creditProposal = creditProposalMappingData;
  }

  public dataSource() {
    if (this.collateral.dataSource === 'h' || this.collateral.dataSource === 'H') {
      return true;
    }
    return false;
  }
  public trashUndefined() {
    if (this.marketability === undefined && this.marketability === 'undefined') {
      this.marketability = '';
    }
  }

  public checkStatusCOllateral() {
    if (this.collateral.paripasuStatus === undefined) {
      this.collateral.paripasuStatus = 'N';
    }
  }
}
