import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_BINDING_TYPE, COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { ICreditProposal } from '../../credit-proposal.model';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';
import { CollateralInfoHistoryDialogComponent } from '../dialog/credit-proposal-collateral-info-dialog.component';
import { CreditProposalService } from '../../credit-proposal.service';
import {
  CreditProposalCollateralBinding,
  ICreditProposalCollateralBinding,
} from 'app/entities/credit-proposal/collateral-info/credit-proposal-collateral-info.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CollateralInfoDialogBTBHistoryComponent } from './dialog-credit-proposal-collateral-info-btb.component';
import lodash from 'lodash';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { IEmptyField } from '../../collateral-info/backtoback/empty-field.model';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';

@Component({
  selector: 'jhi-collateral-info-btb-history',
  templateUrl: './credit-proposal-collateral-info-btb.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
})
export class CollateralInfoBTPHistoryComponent extends AbstractEntityMaterialComponent<ICollateral> implements OnChanges, OnInit {
  public displayedColumns: string[] = [
    'no',
    'collateralType',
    'collateralAddress',
    'mvInternalOriginal',
    'marketValue',
    'liquidValue',
    'ownership',
    'certificateDueDate',
    'bindingType',
    'bindingValue',
    'collateralStatus',
    'crossCollateral',
    'action',
  ];

  public certificateType: any;
  public dataCertyficate: any;
  public dataCollateral: ICollateral[];
  public collateralProperties: ICollateralProperty[];
  public dataItem: any;
  public totalMVInt: number;
  public totalLVInt: number;
  public isChecked: boolean;
  private _creditProposal: ICreditProposal;
  private bindingTypeVal: any;
  public selectedMenu: string;
  public totalPlafond: number;
  public biddingValueSum: number;
  public biddingValueCoverage: number;
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }];
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }
  public parsedData: any;
  @Input() isViewMode?: Boolean = false;

  @Input() isOnCompareData: Boolean = false;

  @Input() isCompareDar: Boolean = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  constructor(
    protected _snackbar: MatSnackBar,
    private collateralPropertyService: CollateralPropertyService,
    public dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private collateralService: CollateralService,
    private partyCifService: PartyCifService,
    private cashCollateralService: CashCollateralService
  ) {
    super(_snackbar, collateralService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.collateralProperties = [];
    this.bindingTypeVal = COLLATERAL_BINDING_TYPE;
    this.totalMVInt = 0;
    this.totalLVInt = 0;
  }

  public historyData() {
    // if isOnCompare and not isCompareDar, then set dynamic data to previousReturn
    if (this.isOnCompareData && !this.isCompareDar) {
      return this.parsedData.previousReturn;
    } else if (this.isOnCompareData && this.isCompareDar) {
      // return dataDar
      return {
        collaterals: this.creditProposal.collaterals,
        insurance: this.creditProposal.attributes.insurance,
        binding: this.creditProposal.attributes.binding,
        creditProposalCollateralData: this.creditProposal.attributes.creditProposalCollateralData,
        products: this.creditProposal.products,
      };
    } else {
      return this.parsedData.previousHistory;
    }
  }

  ngOnInit() {
    this.loadData();

    if (this.historyData().creditProposalCollateralData.crossCollateralStatus === '') {
      this.historyData().creditProposalCollateralData.crossCollateralStatus = 'No';
    }

    if (this.historyData().creditProposalCollateralData.crossCollateralStatus === 'Yes') {
      this.isChecked = true;
    }

    this.setCertyficateType();
    if (this.creditProposal.customerType === 'PERSONAL') {
      this.findCollateralProperty(this.creditProposal.prospectPerson.id);
    } else {
      this.findCollateralProperty(this.creditProposal.prospectOrganization.id);
    }
    // this.isViewMode ? this.displayedColumns.splice(this.displayedColumns.length - 1, 1) : null;
  }

  private loadData(): void {
    this.parsedData = parsePreviousAtrribute(this.creditProposal);
    const dataFilter = this.historyData().collaterals.filter(obj => obj.statusId !== 'CANCEL');

    this.dataItem = new MatTableDataSource(dataFilter);
    this.dataItem.paginator = this.paginator;

    if (dataFilter.length > 0) {
      this.getBindingCalculate(dataFilter);
    }
    if (this.historyData().creditProposalCollateralData.crossCollateralStatus === '') {
      this.historyData().creditProposalCollateralData.crossCollateralStatus = 'No';
    }
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
      })
      .subscribe(res => {
        const filter: ICollateral[] = res.body.filter(function (o) {
          return (
            o.collateralTypeId !== COLLATERAL_TYPE['machine'] &&
            o.collateralTypeId !== COLLATERAL_TYPE['realestate'] &&
            o.collateralTypeId !== COLLATERAL_TYPE['vehicle'] &&
            o.collateralTypeId !== COLLATERAL_TYPE['property'] &&
            o.collateralTypeId !== COLLATERAL_TYPE['personalCorporateGuarantee']
          );
        });
        this.dataCollateral = filter;
        this.dataItem = new MatTableDataSource(filter);
        this.dataItem.paginator = this.paginator;
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
  }
  public openDialogBTB(value: ICollateral): void {
    let cp = {};
    for (let index = 0; index < this.creditProposal.collaterals.length; index++) {
      if (this.creditProposal.collaterals[index].collateralId === value.collateralId) {
        cp = this.creditProposal;
      }
    }
    const predicate: object = {
      width: '80vw',
      data: {
        isOnCompare: this.isOnCompareData,
        isCompareDar: this.isCompareDar,
        cp: this._creditProposal,
        collateral: value,
        binding: this.getBinding(value),
        emptyField: this.getEmptyField(value),
        applicationProduct: this.historyData().products,
        properties: this.collateralProperties,
        isViewMode: this.isViewMode,
      },
    };
    const dialogRef = this.dialog.open(CollateralInfoDialogBTBHistoryComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (res.action === 'cancel') {
          this.creditProposal.collateralProductRelations = res.creditProposal.collateralProductRelations;
        }
      }

      const collateralIdx: number = lodash.findIndex(this.creditProposal.collaterals, function (o) {
        return o.id === res['collateral'].id;
      });
      if (collateralIdx > -1) {
        this.creditProposal.collaterals[collateralIdx] = res['collateral'];
      }

      const emptyIdx: number = lodash.findIndex(
        this.creditProposal.attributes['emptyField'],
        function (o: ICreditProposalCollateralBinding) {
          return o.collateralId === res['collateral'].id;
        }
      );
      if (emptyIdx > -1) {
        this.creditProposal.attributes['emptyField'][emptyIdx] = res['emptyField'];
      } else {
        this.creditProposal.attributes['emptyField'] = [...this.creditProposal.attributes['emptyField'], res['emptyField']];
      }

      // replace / add binding
      const bindingIdx: number = lodash.findIndex(this.historyData().binding, function (o: ICreditProposalCollateralBinding) {
        return o.collateralId === res['collateral'].id;
      });
      if (bindingIdx > -1) {
        this.historyData().binding[bindingIdx] = res['binding'];
      } else {
        this.historyData().binding = [...this.historyData().binding, res['binding']];
      }
    });
  }

  countKJJPLV(element: ICollateral) {
    throw new Error('Method not implemented.');
  }
  countKJJPMV(element: ICollateral) {
    throw new Error('Method not implemented.');
  }

  public getCertificationDate(collateral: ICollateral): string {
    const properties: ICollateralProperty[] = this.filterProperties(collateral);
    return this.creditProposalService.getCertificationDate(collateral, properties);
  }

  public getMarketability(): string {
    if (this.creditProposal.appraisals.length > 0) {
      const lastAppraisal: ICollateralAppraisal = this.creditProposal.appraisals[this.creditProposal.appraisals.length - 1];
      if (lodash.has(lastAppraisal.attributes, 'summary')) {
        return JSON.parse(lastAppraisal.attributes['summary']).marketbility;
      }
    }
    return 'N/A';
  }

  public getEmptyField(element: ICollateral): IEmptyField {
    if (this.creditProposal.attributes['emptyField'].length > 0) {
      for (let i = 0; i < this.creditProposal.attributes['emptyField'].length; i++) {
        const item: IEmptyField = this.creditProposal.attributes['emptyField'][i];
        if (item.collateralId === element.id) {
          return item;
        }
      }
    }
    return new CreditProposalCollateralBinding();
  }

  public getBinding(element: ICollateral): ICreditProposalCollateralBinding {
    if (this.historyData().binding.length > 0) {
      for (let i = 0; i < this.historyData().binding.length; i++) {
        const item: ICreditProposalCollateralBinding = this.historyData().binding[i];
        if (item.collateralId === element.id) {
          return item;
        }
      }
    }
    return new CreditProposalCollateralBinding();
  }

  public findCollateralProperty(partyId: string): void {
    this.cashCollateralService.getCollateralPropertyGroupAndDebitur(partyId).subscribe(res => {
      this.collateralProperties = [...this.collateralProperties, ...res.body];
    });
  }

  private filterProperties(collateral: ICollateral): ICollateralProperty[] {
    let properties: ICollateralProperty[];
    properties = [];

    // for machine
    if (collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
      properties = lodash.filter(this.collateralProperties, function (o) {
        return o.propertyType === 'MACHINE';
      });
    }

    // for realestate
    if (collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] || collateral.collateralTypeId === COLLATERAL_TYPE['property']) {
      properties = lodash.filter(this.collateralProperties, function (o) {
        return o.propertyType === 'LAND' || o.propertyType === 'BUILDING';
      });
    }

    // for vehicle
    if (collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
      properties = lodash.filter(this.collateralProperties, function (o) {
        return o.propertyType === 'VEHICLE';
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

    return result;
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

  public slideChange($event) {
    if (this.isChecked === true) {
      this.historyData().creditProposalCollateralData.crossCollateralStatus = 'Yes';
    } else {
      this.historyData().creditProposalCollateralData.crossCollateralStatus = 'No';
    }
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

  public getBindingType(element: string) {
    const keyy = Object.keys(this.bindingTypeVal).find(item => item === element);
    return this.bindingTypeVal[keyy];
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

  public setCertyficateType() {
    this.partyCifService.getCertificate().subscribe(res => {
      this.certificateType = res.body;
    });
  }

  public findCertyficate(collateral) {
    let data: ICollateralProperty;

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

  public presentage(value: string, status: string) {
    // console.log('cekd', value);
    const num = parseFloat(value).toFixed(2);
    if (num === 'Infinity') {
      return '0.00' + 'x';
    } else if (num === 'NaN') {
      return '0.00' + 'x';
    } else {
      return num + 'x';
    }
  }

  public fungsiSumcredit(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let result: number;
      let dolar: number;
      let filterIdr = [];
      let filterUsd = [];
      result = 0;
      dolar = 0;

      const dataFilter = this.historyData().products.filter(obj => obj.subLimit === false);

      if (dataFilter?.length > 0) {
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
        this.totalPlafond = result + dolar;
      }
      if (value === 'USD') {
        this.totalPlafond = result + dolar;
      }
      if (value === 'IDR') {
        this.totalPlafond = result + dolar;
      }

      resolve();
    });
  }

  public getBindingCalculate(res: any[]) {
    const array1 = res;
    const array2 = typeof this.historyData().binding === 'string' ? JSON.parse(this.historyData().binding) : this.historyData().binding;

    let getBindingCalculateValue;
    const data = [];
    array1.filter(({ id: value1, collateralTypeId: collateralTypeId }) => {
      data.push(array2.find(({ collateralId: value2 }) => value1 === value2 && collateralTypeId !== 'CORPORATEPERSONALGUARANTEE'));
      getBindingCalculateValue = data.filter(item => item !== undefined);
      this.fungsiSumcredit('both').then(() => {
        this.biddingValueSum = getBindingCalculateValue.reduce((a: any, b: any) => a + Number(b.bindingValue), 0);
        const biddingValueCoverage = Number(this.biddingValueSum) / Number(this.totalPlafond);
        this.biddingValueCoverage = parseFloat(biddingValueCoverage.toFixed(2));
      });
    });
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
}
