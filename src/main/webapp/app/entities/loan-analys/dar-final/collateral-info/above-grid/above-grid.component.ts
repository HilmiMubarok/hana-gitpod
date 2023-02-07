import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_BINDING_TYPE, COLLATERAL_FACILITY_TYPE, COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { CollateralAppraisal, ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';
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
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { CollateralInfoDialogTempComponent } from '../dialog/collateral-info-dialog-temp.component';

@Component({
  selector: 'jhi-above-grid-dar-final',
  templateUrl: './above-grid.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
})
export class AboveGridDarFinalComponent extends AbstractEntityMaterialComponent<ICollateral> implements OnChanges, OnInit, AfterViewInit {
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

  public certificateType: any;
  public dataItem: any;
  public dataCertyficate: any;
  private bindingTypeVal: any;
  private facilityTypes: any;
  public collateralProperties: ICollateralProperty[];
  public totalMVInt: number;
  public totalLVInt: number;
  private _creditProposal: ICreditProposal;

  public selectedMenu: string;
  public isChecked: boolean;
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }];
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  public presentage(value: string) {
    const num = parseFloat(value).toFixed(2);
    if (num === 'Infinity') {
      return 0 + '%';
    } else {
      return num + '%';
    }
  }

  @Input() isViewMode;

  constructor(
    protected _snackbar: MatSnackBar,
    private collateralPropertyService: CollateralPropertyService,
    public dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private collateralService: CollateralService,
    private partyCifService: PartyCifService
  ) {
    super(_snackbar, collateralService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.bindingTypeVal = COLLATERAL_BINDING_TYPE;
    this.facilityTypes = COLLATERAL_FACILITY_TYPE;
    this.collateralProperties = [];
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
  }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
      })
      .subscribe(res => {
        this.dataItem = new MatTableDataSource(res.body);
        this.dataItem.paginator = this.paginator;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedMenu = 'INFORMATION';
    if (changes['creditProposal']) {
      if (this.creditProposal.collaterals.length > 0) {
        for (let i = 0; i < this.creditProposal.collaterals.length; i++) {
          const collateral = this.creditProposal.collaterals[i];
          this.findCollateralProperty(collateral);
          if (this.creditProposal.cif) {
            this.loadByPartyId(this.creditProposal.cif.partyId);
          }
        }
      }
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
      },
    };
    const dialogRef = this.dialog.open(CollateralInfoDialogTempComponent, predicate);
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

  public findCollateralProperty(collateral: ICollateral): void {
    if (collateral.id) {
      this.collateralPropertyService.queryFilterBy({ idCollateral: collateral.id, page: 0, size: 9999 }).subscribe(res => {
        this.collateralProperties = [...this.collateralProperties, ...res.body];
      });
    }
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
    const collaterals: ICollateral[] = this.creditProposal.collaterals;
    if (collaterals.length > 0) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterProperties(collaterals[i]);
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
    const collaterals: ICollateral[] = this.creditProposal.collaterals;
    if (collaterals.length > 0) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterProperties(collaterals[i]);
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

  public getCurrency(collateral: ICollateral) {
    let data: ICollateralProperty;
    if (collateral) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data) {
        if (data.attributes.marketValueCcy === undefined) {
          if (
            collateral.collateralTypeId === COLLATERAL_TYPE['machine'] ||
            collateral.collateralTypeId === COLLATERAL_TYPE['vehicle'] ||
            collateral.collateralTypeId === COLLATERAL_TYPE['realestate']
          ) {
            if (data.attributes.marketValueOriginalCcy === undefined) {
              return 'IDR';
            } else {
              return data.attributes.marketValueOriginalCcy;
            }
          }
          return '';
        }
        return data.attributes.marketValueCcy;
      }
    }
    return 'IDR';
  }

  fungsiSumcredit() {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.totalPlafond !== undefined) {
            result = result + Number(filterIdr[i].attributes.totalPlafond);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.totalPlafond !== undefined) {
            dolar = dolar + Number(filterUsd[i].attributes.totalPlafond) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }

    return result + dolar;
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
      collateral.collateralTypeId === COLLATERAL_TYPE['realestate']
    ) {
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

  public countTotalMVKJJP() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.creditProposal.collaterals;
    if (collaterals.length > 0) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterProperties(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === true);
          if (data !== undefined && collaterals[i].collateralTypeId) {
            result = result + data.marketValue;
          }
        }
      }
    }
    return result;
  }

  public countTotalLVKJJP() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.creditProposal.collaterals;
    if (collaterals.length > 0) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterProperties(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === true);
          if (data !== undefined) {
            result = result + data.liquidationValue;
          }
        }
      }
    }
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
    if (collateral.collateralTypeId) {
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
    return string2;
  }

  public getExpiry(collateral: ICollateral) {
    let result: any;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];

    // console.log("collateral in above grid",collateral);
    if (collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] || collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
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
    if (
      collateral.collateralTypeId === COLLATERAL_TYPE['guaranteeLetter'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['securities']
    ) {
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
    return result;
  }

  public openResult(element: ICollateral) {
    const dialogRef = this.dialog.open(CollateralPropertyResultListComponent, {
      width: '80vw',
      data: { collateral: element },
    });
  }
  public slideChange($event) {
    if (this.isChecked === true) {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'Yes';
      if (this.creditProposal.collaterals?.length > 0 && this.creditProposal.products?.length > 0) {
        for (let i = 0; i < this.creditProposal.collaterals.length; i++) {
          for (let j = 0; j < this.creditProposal.products.length; j++) {
            if ($event === true) {
              const tempCollateralProductRelationObject = {
                collateralId: this.creditProposal.collaterals[i].id,
                bindingValue: 0,
                applicationProduct: this.creditProposal.products[j],
              };
              this.creditProposal.collateralProductRelations.push(tempCollateralProductRelationObject);
            }
          }
        }
      }
    } else {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
      if (this.creditProposal.collateralProductRelations.length > 0) {
        for (let i = 0; i < this.creditProposal.collateralProductRelations.length; i++) {
          if (
            this.creditProposal.collateralProductRelations[i].collateralId === this.creditProposal.collaterals[i]?.id &&
            this.creditProposal.collateralProductRelations[i].applicationProduct?.id === this.creditProposal.products[i]?.id
          ) {
            this.creditProposal.collateralProductRelations.splice(i, this.creditProposal.collateralProductRelations.length);
          }
        }
      }
    }
  }

  public getBindingType(element: string) {
    const keyy = Object.keys(this.bindingTypeVal).find(item => item === element);
    return this.bindingTypeVal[keyy];
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
}
