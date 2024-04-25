import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CODE, COLLATERAL_BINDING_TYPE, COLLATERAL_FACILITY_TYPE, COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';
import { CreditProposalCollateralInfoDialogComponent } from '../dialog/credit-proposal-collateral-info-dialog.component';
import { CreditProposalService } from '../../credit-proposal.service';
import {
  CreditProposalCollateralBinding,
  CreditProposalCollateralInsurance,
  ICreditProposalCollateralBinding,
  ICreditProposalCollateralInsurance,
} from '../credit-proposal-collateral-info.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CollateralPropertyResultListComponent } from 'app/entities/collateral-property/collateral-property-result-list.component';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { ApplicationProduct } from 'app/entities/application-product/application-product.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { ICertificateInfo } from 'app/entities/offering-letter/certificate-info/certificate-info.model';
@Component({
  selector: 'jhi-above-grid',
  templateUrl: './above-grid.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
})
export class AboveGridComponent extends AbstractEntityMaterialComponent<ICollateral> implements OnChanges, OnInit, AfterViewInit {
  public displayedColumns: string[] = [
    'no',
    // 'id',
    'collateralType',
    'collateralAddress',
    'mvInternalOriginal',
    'marketValue',
    'liquidValue',
    'mValueKjjp',
    'lValueKjjp',
    'marketability',
    'occupancy',
    'ownership',
    'certificateDueDate',
    'insuredtype',
    'insuredAmount',
    'bindingType',
    'bindingValue',
    'collateralStatus',
    'crossCollateral',
    'action',
  ];

  private _collateralProperty: ICollateralProperty[];
  public collateralStartState: ICollateral;
  public creditProposalStartState: ICreditProposal;
  public dataCollateral: ICollateral[];
  public certificateType: any;
  public dataItem: any;
  public dataCertyficate: any;
  private bindingTypeVal: any;
  private facilityTypes: any;
  public totalMVInt: number;
  public totalLVInt: number;
  private _creditProposal: ICreditProposal;
  public totalPlafond: number;
  public biddingValueSum: number;
  public biddingValueCoverage: number;
  public insuranceTypes = [];
  public bindingTypesHobies = [];

  public selectedMenu: string;
  public isChecked: boolean;
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }, { text: 'SUMMARY' }];
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input() parentSource?: String = '';

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  @Input()
  get collateralProperties() {
    return this._collateralProperty;
  }
  set collateralProperties(item: ICollateralProperty[]) {
    this._collateralProperty = item;
  }

  public presentage(value: string, status: string): any {
    // console.log('cekd', value);
    const num = String(Math.floor(Number(value) * 100) / 100);
    if (num === 'Infinity') {
      if (status === 'mv') {
        this.creditProposal.attributes.coverageTotal.mvInternalCoverage = '0.00';
      } else if (status === 'lv') {
        this.creditProposal.attributes.coverageTotal.lvInternalCoverage = '0.00';
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.coverageTotal.mvKjjpCoverage = '0.00';
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.coverageTotal.lvKjjpCoverage = '0.00';
      }
      return '0.00' + 'x';
    } else if (num === 'NaN') {
      if (status === 'mv') {
        this.creditProposal.attributes.coverageTotal.mvInternalCoverage = '0.00';
      } else if (status === 'lv') {
        this.creditProposal.attributes.coverageTotal.lvInternalCoverage = '0.00';
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.coverageTotal.mvKjjpCoverage = '0.00';
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.coverageTotal.lvKjjpCoverage = '0.00';
      }
      return '0.00' + 'x';
    } else {
      if (status === 'mv') {
        this.creditProposal.attributes.coverageTotal.mvInternalCoverage = num;
      } else if (status === 'lv') {
        this.creditProposal.attributes.coverageTotal.lvInternalCoverage = num;
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.coverageTotal.mvKjjpCoverage = num;
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.coverageTotal.lvKjjpCoverage = num;
      }
      return num + 'x';
    }
  }

  private totalCoverage() {
    const mvCoverage =
      this._creditProposal.attributes['coverageTotal'].countTotalMV / this._creditProposal.attributes['coverageTotal'].creditLimit;
    this._creditProposal.attributes['coverageTotal'].mvInternalCoverage = mvCoverage.toFixed(2);
    const lvCoverage =
      this._creditProposal.attributes['coverageTotal'].countTotalLV / this._creditProposal.attributes['coverageTotal'].creditLimit;
    this._creditProposal.attributes['coverageTotal'].lvInternalCoverage = lvCoverage.toFixed(2);
    const mvKjjpCoverage = this._creditProposal.attributes['coverageTotal'].countTotalMVKJJP / 0;
    this._creditProposal.attributes['coverageTotal'].mvKjjpCoverage = mvKjjpCoverage.toFixed(2);
    const lvKjjpCoverage =
      this._creditProposal.attributes['coverageTotal'].countTotalLVKJJP / this._creditProposal.attributes['coverageTotal'].creditLimit;
    this._creditProposal.attributes['coverageTotal'].lvKjjpCoverage = lvKjjpCoverage.toFixed(2);
  }
  private _group: string;
  @Input()
  get group() {
    return this._group;
  }
  set group(data: string) {
    this._group = data;
  }
  @Input() isViewMode;

  constructor(
    protected _snackbar: MatSnackBar,
    private collateralPropertyService: CollateralPropertyService,
    public dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private collateralService: CollateralService,
    private partyCifService: PartyCifService,
    private generalParameterService: GeneralParameterService
  ) {
    super(_snackbar, collateralService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.bindingTypeVal = COLLATERAL_BINDING_TYPE;
    this.facilityTypes = COLLATERAL_FACILITY_TYPE;
    this.totalMVInt = 0;
    this.totalLVInt = 0;
  }

  ngOnInit(): void {
    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === '') {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
    }

    // this.isViewMode && this.displayedColumns.pop();

    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === 'Yes') {
      this.isChecked = true;
    }
    this.setCertyficateType();
    this.totalCoverage();
    this.getLovInsuranceType();
    this.lovBindingType();
  }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
        size: 999,
      })
      .subscribe(res => {
        this.dataCollateral = res.body;
        this.dataItem = new MatTableDataSource(res.body);
        this.dataItem.paginator = this.paginator;
        this.getBindingCalculate(res.body);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedMenu = 'INFORMATION';
    if (changes['creditProposal']) {
      if (this.creditProposal.collaterals.length > 0) {
        for (let i = 0; i < this.creditProposal.collaterals.length; i++) {
          const collateral = this.creditProposal.collaterals[i];
          if (this.creditProposal.cif) {
            this.loadByPartyId(this.creditProposal.cif.partyId);
          }
        }
      }
    }

    if (changes['collateralProperties']) {
      // console.log('above ', this.collateralProperties);
    }
  }

  public collateral: any;
  ngAfterViewInit(): void {
    let a = [];
    for (let i = 0; i < this.creditProposal.collaterals.length; i++) {
      a = lodash.concat(a, this.creditProposal.collaterals[i]);
    }
    this.collateral = new MatTableDataSource(a);
    this.collateral.paginator = this.paginator2;
  }

  public openDialog(element: ICollateral): void {
    this.collateralStartState = lodash.cloneDeep(element);
    this.creditProposalStartState = lodash.cloneDeep(this.creditProposal);
    let cp = {};
    for (let index = 0; index < this.creditProposal.collaterals.length; index++) {
      if (this.creditProposal.collaterals[index].collateralId === element.collateralId) {
        cp = this.creditProposal;
      }
    }
    const predicate: object = {
      width: '80vw',
      data: {
        cp: this.creditProposal,
        collateral: element,
        marketability: this.getMarketability(element),
        internalMV: this.countMV(element),
        internalLV: this.countLV(element),
        externalMV: this.countKJJPMV(element),
        externalLV: this.countKJJPLV(element),
        properties: this.filterProperties(element),
        binding: this.getBinding(element),
        insurance: this.getInsurance(element),
        certDueDate: this.getExpiry(element),
        ownerShip: this.findCertyficate(element) + ' ' + this.getOwnerShip(element),
        applicationProduct: this.creditProposal.products,
        matrikBindingType: this.getBindingType(element.collBindingType),
        isViewMode: this.isViewMode,
        group: this.group,
        collateralProperties: this.collateralProperties,
        parentSource: this.parentSource,
        depositInterestRate: this.getDepositInterestRate(element),
      },
    };
    const dialogRef = this.dialog.open(CreditProposalCollateralInfoDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const collateralIdx: number = lodash.findIndex(this.creditProposal.collaterals, function (o) {
          return o.id === res['collateral'].id;
        });
        if (collateralIdx > -1) {
          this.creditProposal.collaterals[collateralIdx] = res['collateral'];
          const filter = this.creditProposal.collaterals.filter(obj => obj.statusId !== 'CANCEL');
          this.dataItem = new MatTableDataSource(filter);
          this.dataItem.paginator = this.paginator;
        }
        // replace / add binding
        const bindingIdx: number = lodash.findIndex(
          this.creditProposal.attributes['binding'],
          function (o: ICreditProposalCollateralBinding) {
            return o.collateralId === res['collateral'].id;
          }
        );
        if (bindingIdx > -1) {
          this.creditProposal.attributes['binding'][bindingIdx] = res['binding'];
        } else {
          this.creditProposal.attributes['binding'] = [...this.creditProposal.attributes['binding'], res['binding']];
        }

        // replace / add insurance
        const insuranceIdx: number = lodash.findIndex(
          this.creditProposal.attributes['insurance'],
          function (o: ICreditProposalCollateralInsurance) {
            return o.collateralId === res['collateral'].id;
          }
        );
        if (insuranceIdx > -1) {
          this.creditProposal.attributes['insurance'][insuranceIdx] = res['insurance'];
        } else {
          this.creditProposal.attributes['insurance'] = [...this.creditProposal.attributes['insurance'], res['insurance']];
        }
        this.setDepositInterestRate(element, res.depositInterestRate);
      } else {
        const collateralIdx: number = lodash.findIndex(this.creditProposal.collaterals, o => o.id === this.collateralStartState.id);
        if (collateralIdx > -1) {
          this.creditProposal.collaterals[collateralIdx] = this.collateralStartState;
          const filter = this.creditProposal.collaterals.filter(obj => obj.statusId !== 'CANCEL');
          this.dataItem = new MatTableDataSource(filter);
          this.dataItem.paginator = this.paginator;
        }
        const bindingIdx: number = lodash.findIndex(
          this.creditProposal.attributes['binding'],
          (o: ICreditProposalCollateralBinding) => o.collateralId === this.collateralStartState.id
        );
        if (bindingIdx > -1) {
          this.creditProposal.attributes['binding'][bindingIdx] = this.creditProposalStartState.attributes['binding'][bindingIdx];
        }
        const insuranceIdx: number = lodash.findIndex(
          this.creditProposal.attributes['insurance'],
          (o: ICreditProposalCollateralInsurance) => o.collateralId === this.collateralStartState.id
        );
        if (insuranceIdx > -1) {
          this.creditProposal.attributes['insurance'][insuranceIdx] = this.creditProposalStartState.attributes['insurance'][insuranceIdx];
        }
      }
    });
  }
  countKJJPLV(collateral: ICollateral) {
    let result: number;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    result = 0;

    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === true
      );
      if (data !== undefined) {
        if (data.liquidationValue === null) {
          result = 0;
        } else {
          result = data.liquidationValue;
        }
      }
    }
    return result;
  }
  countKJJPMV(collateral: ICollateral) {
    let result: number;
    result = 0;
    let data: ICollateralProperty;
    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === true
      );
      if (data !== undefined) {
        if (data.marketValue === null) {
          result = 0;
        } else {
          result = data.marketValue;
        }
      }
    }
    return result;
  }

  public getCertificationDate(collateral: ICollateral): string {
    const properties: ICollateralProperty[] = this.filterProperties(collateral);
    return this.creditProposalService.getCertificationDate(collateral, properties);
  }

  public getMarketability(collateral): string {
    let data: ICollateralProperty;
    if (collateral) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.marketability === undefined || data.marketability === null) {
          return 'N/A';
        } else {
          return data.marketability;
        }
      }
    }
    return 'N/A';
  }

  private getInsurance(element: ICollateral): ICreditProposalCollateralInsurance {
    if (this.creditProposal.attributes['insurance'].length > 0) {
      for (let i = 0; i < this.creditProposal.attributes['insurance'].length; i++) {
        const item: ICreditProposalCollateralInsurance = this.creditProposal.attributes['insurance'][i];
        if (item.collateralId === element.id) {
          return item;
        }
      }
    }
    return new CreditProposalCollateralInsurance();
  }

  private getBinding(element: ICollateral): ICreditProposalCollateralBinding {
    if (this.creditProposal.attributes['binding'].length > 0) {
      for (let i = 0; i < this.creditProposal.attributes['binding'].length; i++) {
        const item: ICreditProposalCollateralBinding = this.creditProposal.attributes['binding'][i];
        if (item.collateralId === element.id) {
          return item;
        }
      }
    }
    return new CreditProposalCollateralBinding();
  }

  private filterProperties(collateral: ICollateral): ICollateralProperty[] {
    let properties: ICollateralProperty[];
    properties = [];

    // for machine
    if (collateral.collateralTypeId !== '' || collateral.collateralTypeId !== undefined) {
      properties = lodash.filter(this.collateralProperties, function (o) {
        return o.propertyType === 'GENERAL' && o.collateralId === collateral.id;
      });
    }

    return properties;
  }

  public countLV(collateral: ICollateral): number {
    let result: number;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    result = 0;

    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.liquidationValue === null) {
          result = 0;
        } else {
          result = data.liquidationValue;
        }
      }
    }
    return result;
  }

  public countTotalLV(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === false);
          if (data !== undefined) {
            result = result + Number(data.liquidationValue);
          }
        }
      }
    }
    this._creditProposal.attributes['coverageTotal'].countTotalLV = result;

    return result;
  }

  private filterPropertiesFilterGurante(collateral: ICollateral): ICollateralProperty[] {
    let properties: ICollateralProperty[];
    properties = [];

    // for machine
    if (collateral.collateralTypeId !== 'CORPORATEPERSONALGUARANTEE') {
      if (collateral.collateralTypeId !== '' || collateral.collateralTypeId !== undefined) {
        properties = lodash.filter(this.collateralProperties, function (o) {
          return o.propertyType === 'GENERAL' && o.collateralId === collateral.id;
        });
      }
    }

    return properties;
  }

  public countTotalMV(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === false);
          if (data !== undefined) {
            result = result + Number(data.marketValue);
          }
        }
      }
    }
    this._creditProposal.attributes['coverageTotal'].countTotalMV = result;
    return result;
  }

  public countMV(collateral: ICollateral): number {
    let result: number;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    // console.log("collateral in above grid",collateral);
    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.marketValue === null) {
          return 0;
        } else {
          return data.marketValue;
        }
      }
    }
    return 0;
  }

  public getCurrency(collateral: ICollateral) {
    let data: ICollateralProperty;
    if (collateral) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data) {
        if (data.marketValueOriginalCcy === undefined || data.marketValueOriginalCcy === null) {
          return '';
        }
        return data.marketValueOriginalCcy;
      }
    }
    return 'IDR';
  }
  fungsiSumcredit(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let result: number;
      let dolar: number;
      let filterIdr = [];
      let filterUsd = [];
      result = 0;
      dolar = 0;

      const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

      if (dataFilter.length > 0) {
        if (value === 'USD' || value === 'both') {
          filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
        }

        if (value === 'IDR' || value === 'both') {
          filterIdr = dataFilter.filter(obj => obj.currencyId === 'IDR');
        }

        if (value === 'IDR' || value === 'both') {
          if (filterIdr.length > 0) {
            for (let i = 0; i < filterIdr.length; i++) {
              if (filterIdr[i].totalPlafond !== undefined) {
                result = result + Number(filterIdr[i].totalPlafond);
              }
            }
          }
        }

        if (value === 'USD') {
          if (filterUsd.length > 0) {
            for (let i = 0; i < filterUsd.length; i++) {
              if (filterUsd[i].totalPlafond !== undefined) {
                dolar = dolar + Number(filterUsd[i].totalPlafond);
              }
            }
          }
        }

        if (value === 'both') {
          if (filterUsd.length > 0) {
            for (let i = 0; i < filterUsd.length; i++) {
              if (filterUsd[i].totalPlafond !== undefined) {
                dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
              }
            }
          }
        }
      }
      if (value === 'both') {
        this.creditProposal.attributes['facilityDetail'].totalPlafond = result + dolar;
      }
      if (value === 'USD') {
        this.creditProposal.attributes['facilityDetail'].totalPlafondUsd = result + dolar;
      }
      if (value === 'IDR') {
        this.creditProposal.attributes['facilityDetail'].totalPlafondIdr = result + dolar;
      }

      const creditLimit = result + dolar;
      this._creditProposal.attributes['coverageTotal'].creditLimit = creditLimit;

      this.totalPlafond = result + dolar;

      resolve();
    });
  }

  public countMVOriginal(collateral: ICollateral): number {
    let result: string;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    // console.log("collateral in above grid",collateral);
    if (collateral.collateralTypeId === COLLATERAL_TYPE['deposit']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.amount === null || data.attributes.amount === undefined) {
          return 0;
        } else {
          return data.attributes.amount;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['personalProperty']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.collateralValue === null || data.attributes.collateralValue === undefined) {
          return 0;
        } else {
          return data.attributes.collateralValue;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['securities']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.totalFaceAmount === null || data.attributes.totalFaceAmount === undefined) {
          return 0;
        } else {
          return data.attributes.totalFaceAmount;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['other']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.collateralValueOther === undefined || data.attributes.collateralValueOther === null) {
          return 0;
        } else {
          return data.attributes.collateralValueOther;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['guaranteeLetter']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.amount === null || data.attributes.amount === undefined) {
          return 0;
        } else {
          return data.attributes.amount;
        }
      }
    }
    if (
      collateral.collateralTypeId === COLLATERAL_TYPE['machine'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['vehicle'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['personalCorporateGuarantee']
    ) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.marketValueOriginalAmt === null) {
          return 0;
        } else {
          return data.marketValueOriginalAmt;
        }
      }
    }
    return 0;
  }

  public countTotalMVKJJP() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === true);
          if (data !== undefined && collaterals[i].collateralTypeId) {
            result = result + data.marketValue;
          }
        }
      }
    }
    this._creditProposal.attributes['coverageTotal'].countTotalMVKJJP = result;
    return result;
  }

  public countTotalLVKJJP() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === true);
          if (data !== undefined) {
            result = result + data.liquidationValue;
          }
        }
      }
    }
    this._creditProposal.attributes['coverageTotal'].countTotalLVKJJP = result;
    return result;
  }

  // get Ownership
  public getOwnerShip(collateral: ICollateral) {
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    let string1: string;
    let string2: string;
    let result: string;

    // console.log("collateral in above grid",collateral);
    if (collateral.collateralTypeId !== COLLATERAL_TYPE['personalCorporateGuarantee']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.certificateNumber === undefined) {
          string2 = '';
        } else {
          string2 = data.attributes.certificateNumber;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['personalCorporateGuarantee']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.certificateNumber === undefined) {
          string2 = '';
        } else {
          string2 = data.certificateNumber;
        }
      }
    }
    return string2;
  }

  public getExpiry(collateral: ICollateral) {
    let result: any;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];

    // console.log("collateral in above grid",collateral);
    if (
      collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['machine'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['vehicle'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['property'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['other']
    ) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.expiry === undefined) {
          result = '';
        } else {
          result = data.attributes.expiry;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['guaranteeLetter']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.certificateExpiryDate === undefined) {
          result = '';
        } else {
          result = data.attributes.certificateExpiryDate;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['securities'] || collateral.collateralTypeId === COLLATERAL_TYPE['deposit']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.maturityDate === undefined) {
          result = '';
        } else {
          result = data.attributes.maturityDate;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['personalCorporateGuarantee']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.certificateExpiryDate === undefined) {
          result = '';
        } else {
          result = data.certificateExpiryDate;
        }
      }
    }
    return result;
  }

  public openResult(element: ICollateral) {
    const dialogRef = this.dialog.open(CollateralPropertyResultListComponent, {
      width: '80vw',
      data: { collateral: element },
    });
  }

  public slideChange($event) {
    const dataTemp = [];
    if (this.isChecked === true) {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'Yes';
      if (this.creditProposal.collaterals?.length > 0 && this.creditProposal.products?.length > 0) {
        for (let i = 0; i < this.creditProposal.collaterals.length; i++) {
          if (
            this.creditProposal.collaterals[i].collateralTypeId !== 'CORPORATEPERSONALGUARANTEE' &&
            this.creditProposal.collaterals[i].statusId !== CODE.CANCEL
          ) {
            for (let j = 0; j < this.creditProposal.products.length; j++) {
              if ($event === true) {
                const tempCollateralProductRelationObject = {
                  collateralId: this.creditProposal.collaterals[i].id,
                  bindingValue: 0,
                  applicationProduct: this.creditProposal.products[j],
                };
                dataTemp.push(tempCollateralProductRelationObject);
              }
            }
            this.creditProposal.collateralProductRelations = dataTemp;
          }
        }
      }
    } else {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
      if (
        this.creditProposal.collateralProductRelations.length > 0 &&
        this.creditProposal.products.length > 0 &&
        this.creditProposal.collaterals.length > 0
      ) {
        for (let i = 0; i < this.creditProposal.collateralProductRelations.length; i++) {
          for (let j = 0; j < this.creditProposal.products.length; j++) {
            for (let k = 0; k < this.creditProposal.collaterals.length; k++) {
              if (
                this.creditProposal.collateralProductRelations[i].applicationProduct.id === this.creditProposal.products[j].id &&
                this.creditProposal.collateralProductRelations[i].collateralId === this.creditProposal.collaterals[k].id
              ) {
                this.creditProposal.collateralProductRelations.splice(i);
              }
            }
          }
        }
      }
    }
  }

  public getBindingType(element: string) {
    if (this.bindingTypesHobies) {
      const data = this.bindingTypesHobies.find(obj => obj.code === element);
      if (data) {
        return data.value;
      }
    }
    return '';
  }

  public getCrossStatus(status: string) {
    if (status === 'N') {
      return 'NO';
    }
    if (status === 'Y') {
      return 'YES';
    }
    if (status === undefined) {
      return '';
    }
    return '';
  }

  public setCertyficateType() {
    this.partyCifService.getCertificate().subscribe(res => {
      this.certificateType = res.body;
    });
  }

  public findCertyficate(collateral) {
    let data: ICollateralProperty;

    // console.log("collateral in above grid",collateral);
    if (collateral) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.certificateType !== undefined) {
          if (this.certificateType) {
            this.dataCertyficate = this.certificateType.find(obj => obj.id === data.attributes.certificateType);
            if (this.dataCertyficate) {
              return this.dataCertyficate.label;
            }
            return '';
          }
        }
      }
    }
    return '';
  }

  public presentageSummary(value: string, status: string) {
    const num = parseFloat(value).toFixed(2);
    if (num === 'Infinity') {
      if (status === 'mv') {
        this.creditProposal.attributes.collateralSummary.mvInternalCoverage = '0.00';
      } else if (status === 'lv') {
        this.creditProposal.attributes.collateralSummary.lvInternalCoverage = '0.00';
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.collateralSummary.mvKjjpCoverage = '0.00';
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.collateralSummary.lvKjjpCoverage = '0.00';
      }
      return '0.00' + 'x';
    } else if (num === 'NaN') {
      if (status === 'mv') {
        this.creditProposal.attributes.collateralSummary.mvInternalCoverage = '0.00';
      } else if (status === 'lv') {
        this.creditProposal.attributes.collateralSummary.lvInternalCoverage = '0.00';
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.collateralSummary.mvKjjpCoverage = '0.00';
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.collateralSummary.lvKjjpCoverage = '0.00';
      }
      return '0.00' + 'x';
    } else {
      if (status === 'mv') {
        this.creditProposal.attributes.collateralSummary.mvInternalCoverage = num;
      } else if (status === 'lv') {
        this.creditProposal.attributes.collateralSummary.lvInternalCoverage = num;
      } else if (status === 'mvKjjp') {
        this.creditProposal.attributes.collateralSummary.mvKjjpCoverage = num;
      } else if (status === 'lvKjjp') {
        this.creditProposal.attributes.collateralSummary.lvKjjpCoverage = num;
      }
      return num + 'x';
    }
  }

  public getBindingCalculate(res: any[]) {
    const array1 = res;
    const array2 = this.creditProposal.attributes['binding'];
    let getBindingCalculateValue;
    const data = [];
    array1.filter(({ id: value1, collateralTypeId: collateralTypeId }) => {
      data.push(array2.find(({ collateralId: value2 }) => value1 === value2 && collateralTypeId !== 'CORPORATEPERSONALGUARANTEE'));
      getBindingCalculateValue = data.filter(item => item !== undefined);
      this.fungsiSumcredit('both').then(() => {
        this.biddingValueSum = getBindingCalculateValue.reduce((a: any, b: any) => a + Number(b.bindingValueEqIdr), 0);
        const biddingValueCoverage = this.convertNan(Number(this.biddingValueSum) / Number(this.totalPlafond));

        this.biddingValueCoverage = Math.round(biddingValueCoverage * 100) / 100;
        this.creditProposal.attributes['coverageTotal'].biddingValueSum = this.biddingValueSum;
        this.creditProposal.attributes['coverageTotal'].biddingValueCoverage = this.biddingValueCoverage;

        this.presentageSummary(String(this.countTotalMVSummary() / this.totalPlafond), 'mv');
        this.presentageSummary(String(this.countTotalLVSummary() / this.totalPlafond), 'lv');
        this.presentageSummary(String(this.countTotalMVKJJPSummary() / this.totalPlafond), 'mvKjjp');
        this.presentageSummary(String(this.countTotalLVKJJPSummary() / this.totalPlafond), 'lvKjjp');
      });
    });
  }

  public countTotalMVSummary(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === false);
          if (data !== undefined) {
            result = result + Number(data.marketValue);
          }
        }
      }
    }
    this.creditProposal.attributes['collateralSummary'].countTotalMV = result;
    return result;
  }

  public countTotalLVSummary(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === false);

          if (data !== undefined) {
            result = result + Number(data.liquidationValue);
          }
        }
      }
    }

    this._creditProposal.attributes['collateralSummary'].countTotalLV = result;
    return result;
  }

  public countTotalMVKJJPSummary() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === true);
          if (data !== undefined && collaterals[i].collateralTypeId) {
            result = result + data.marketValue;
          }
        }
      }
    }
    this.creditProposal.attributes['collateralSummary'].countTotalMV = result;
    return result;
  }

  public countTotalLVKJJPSummary() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateral;
    if (collaterals) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterPropertiesFilterGurante(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === true);
          if (data !== undefined) {
            result = result + data.liquidationValue;
          }
        }
      }
    }
    this._creditProposal.attributes['collateralSummary'].countTotalLVKJJP = result;
    return result;
  }

  public convertNan(value: any): any {
    if (Number.isNaN(value)) {
      return 0;
    } else {
      return value;
    }
  }

  getLovInsuranceType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'INSURANCE_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        // console.log('insurance type body ', res.body);
        this.insuranceTypes = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public getInsuranceType(value) {
    if (this.insuranceTypes) {
      const data = this.insuranceTypes.find(obj => obj.code === value);
      if (data) {
        return data.value;
      }
    }
    return '';
  }

  public lovBindingType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_BINDING_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.bindingTypesHobies = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public getCcyBinding(element) {
    if (element) {
      return element;
    }
    return '';
  }

  public getDepositInterestRate(collateral: ICollateral): number {
    let result: number;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    // console.log("collateral in above grid",collateral);
    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.depositInterestRate === null) {
          return 0;
        } else {
          return data.depositInterestRate;
        }
      }
    }
    return 0;
  }

  public setDepositInterestRate(collateral: ICollateral, depositInterestRate: number) {
    let data: ICollateralProperty;
    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        const idx = this.collateralProperties.findIndex(obj => obj.id === data.id);
        if (idx) {
          this.collateralProperties[idx].depositInterestRate = depositInterestRate;
          console.log('idx ', idx);
          console.log('property di child ', this.collateralProperties);
        }
      }
    }
  }
}
