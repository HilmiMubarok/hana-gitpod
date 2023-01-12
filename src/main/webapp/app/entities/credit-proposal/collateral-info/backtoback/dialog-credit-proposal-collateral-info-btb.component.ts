import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HtmlEditorService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from '../../credit-proposal.model';
import { ICreditProposalCollateralBinding } from '../credit-proposal-collateral-info.model';
import { IEmptyField } from './empty-field.model';
import { Observable, of } from 'rxjs';
import lodash from 'lodash';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import moment from 'moment';
import { FormControl } from '@angular/forms';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { PARIPASU_STATUS, STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import { COLLATERAL_BINDING_TYPE, COLLATERAL_TYPE, OTHER_COLLATERAL_DETAIL_TYPE } from 'app/shared/constants/base.constants';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';

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
  templateUrl: './dialog-credit-proposal-collateral-info-btb.component.html',
  styleUrls: ['../../proposal-basic-information.css'],
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
export class DialogCreditProposalCollateralInfoDialogBTBComponent implements OnInit {
  private branceManagement: any;
  public branchesNames: any;
  public collateralCode: any;
  public collateralDetails: object[];
  private dataBranch: any;
  private dataBranchName: any;
  public branch: string;
  public collateral: ICollateral;
  public creditProposal: ICreditProposal;
  public creditProposalOpenState: ICreditProposal;
  public binding: ICreditProposalCollateralBinding;
  public empty: IEmptyField;
  private bindingTypeVal: any;
  public properties: ICollateralProperty[];
  public filteredOptionBindingTypes: Observable<string[]>;
  public collateralProperty: ICollateralProperty;
  public collateralPropertyExternal: ICollateralProperty;
  public collateralDetailType: any;
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
  public collateralStatus: any;
  public paripasuStatus: any;
  public bindingTypes: any;
  public isViewMode: Boolean;

  public collateralValue: number;
  public accountCustomer: any;
  public lembagaPenjamin: string;
  public sifatJaminan: string;
  public noDocumentJaminan: string;
  public jenis: string;

  constructor(
    private creditProposalService: CreditProposalService,
    private collateralPropertyService: CollateralPropertyService,
    private partyCifService: PartyCifService,
    private cashCollateralService: CashCollateralService,
    private _dialog: MatDialogRef<DialogCreditProposalCollateralInfoDialogBTBComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cp: ICreditProposal;
      collateral: ICollateral;
      properties: ICollateralProperty[];
      binding: ICreditProposalCollateralBinding;
      emptyField: IEmptyField;
      isViewMode: Boolean;
    }
  ) {
    this.creditProposal = this.data.cp;
    this.creditProposalOpenState = lodash.cloneDeep(this.data.cp);
    this.collateral = this.data.collateral;
    this.binding = this.data.binding;
    this.properties = this.data.properties;
    this.empty = this.data.emptyField;
    this.collateralStatus = STATUS_COLLATERAL;
    this.paripasuStatus = PARIPASU_STATUS;
    this.bindingTypes = COLLATERAL_BINDING_TYPE;
    this.collateralDetailType = OTHER_COLLATERAL_DETAIL_TYPE;
    this.isViewMode = this.data.isViewMode;
    this.setManagementBrance();
    this.setBranches();
    this.loadByCollateral(this.collateral.id);
  }
  ngOnInit(): void {
    console.log('ini credit proposal ', this.creditProposal);
    this.loadCollateralDetailOption().then(resolve => {
      this.setCollateralDetail();
    });
    this.setBranches();
  }
  moment = _rollupMoment || _moment;
  date = new FormControl(moment());

  public filterBindingType(): void {
    const text: string = this.binding.bindingType;

    const regex = new RegExp(`\\b${text}`, 'i');
    const filtered: any = this.optionBindingTypes.filter(n => regex.test(n));

    this.filteredOptionBindingTypes = of(filtered);
  }

  public save() {
    if (!this.binding.collateralId) {
      this.binding.collateralId = this.collateral.id;
    }

    if (!this.empty.collateralId) {
      this.empty.collateralId = this.collateral.id;
    }

    this._dialog.close({
      collateral: this.collateral,
      binding: this.binding,
      emptyField: this.empty,
      creditProposal: this.creditProposal,
      action: 'save',
    });
  }

  public cancel() {
    this._dialog.close({
      binding: this.binding,
      collateral: this.collateral,
      creditProposal: this.creditProposalOpenState,
      action: 'cancel',
    });
  }

  public getCreditProposalMappingData(creditProposalMappingData: any): void {
    this.creditProposal = creditProposalMappingData;
  }
  public getCertificateDueDate(): string {
    return this.creditProposalService.getCertificationDate(this.collateral, this.properties);
  }

  private loadByCollateral(collateralId: number): void {
    this.collateralPropertyService
      .queryFilterBy({
        page: 0,
        idCollateral: collateralId,
        idPropertyType: CollateralPropertyType.GENERAL,
        size: 9999,
      })
      .subscribe(res => {
        if (res.body.length > 0) {
          this.collateralProperty = lodash.find(res.body, function (o) {
            return !o.external;
          });
          this.collateralPropertyExternal = lodash.find(res.body, function (o) {
            return o.external;
          });
          this.setValue();
        }
      });
  }

  public setValue() {
    console.log('ini collateral ', this.collateralProperty);
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['guaranteeLetter']) {
      this.noDocumentJaminan = this.collateralProperty.attributes.certificateNumber;
      this.collateralValue = this.collateralProperty.attributes.amount;
      this.accountCustomer = this.collateralProperty.attributes.lGApp;
      this.lembagaPenjamin = this.collateralProperty.attributes.issuingInstitusi;
      this.jenis = this.collateral.attributes['collateralCode'];
    }
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['deposit']) {
      this.collateralValue = this.collateralProperty.attributes.amount;
      this.lembagaPenjamin = this.collateralProperty.attributes.bicCode;
      this.noDocumentJaminan = this.collateralProperty.attributes.accountNumber;
      this.accountCustomer = this.collateralProperty.attributes.accountCustomerNo;
      this.jenis = this.collateral.attributes['collateralCode'];
    }
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['securities']) {
      this.collateralValue = this.collateralProperty.attributes.totalFaceAmount;
      this.accountCustomer = this.collateralProperty.attributes.securityName;
      this.lembagaPenjamin = this.collateralProperty.attributes.issuer;
      this.jenis = this.collateral.attributes['collateralCode'];
    }
    if (this.collateral.collateralTypeId === COLLATERAL_TYPE['other']) {
      this.jenis = this.collateralProperty.attributes.collateralDetailType;
      this.collateralValue = this.collateralProperty.attributes.marketValue;
      this.sifatJaminan = this.collateralProperty.attributes.issuer;
      this.collateralValue = this.collateralProperty.attributes.totalFaceAmount;
    }
  }

  public getBindingType(element: string) {
    const keyy = Object.keys(this.bindingTypeVal).find(item => item === element);
    return this.bindingTypeVal[keyy];
  }

  public print() {
    console.log(this.creditProposal);
  }

  public setManagementBrance() {
    this.partyCifService.getManagementBranc().subscribe(res => {
      this.branceManagement = res.body;
      this.branch = this.findBranchName(this.collateralProperty.attributes.branch);
    });
  }

  public setBranches() {
    this.partyCifService.geBranches().subscribe(res => {
      this.branchesNames = res.body;
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

  public findBranch(id) {
    if (this.branceManagement) {
      this.dataBranch = this.branceManagement.find(obj => obj.id === id);
      if (this.dataBranch) {
        return this.branceManagement.label;
      }
      return '';
    }
  }

  public findBranchName(id) {
    console.log('ini branch name', this.branchesNames);
    for (let i = 0; i < this.branchesNames.length; i++) {
      console.log('id branch', this.branchesNames[i]);
    }
    console.log('ini id', id);
    if (this.branchesNames) {
      this.dataBranchName = this.branchesNames.find(obj => obj.id === id);
      if (this.dataBranchName) {
        return this.branchesNames.label;
      }
      return '';
    }
  }
}
