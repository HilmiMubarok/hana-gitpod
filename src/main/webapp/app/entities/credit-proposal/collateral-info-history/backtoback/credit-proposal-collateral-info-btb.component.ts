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
import { IEmptyField } from './empty-field.model';
import lodash from 'lodash';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

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

  public collateralProperties: ICollateralProperty[];
  public dataItem: any;
  public totalMVInt: number;
  public totalLVInt: number;
  public isChecked: boolean;
  private _creditProposal: ICreditProposal;
  private bindingTypeVal: any;
  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }];
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input() isViewMode?: Boolean = false;

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
    private partyCifService: PartyCifService
  ) {
    super(_snackbar, collateralService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.collateralProperties = [];
    this.bindingTypeVal = COLLATERAL_BINDING_TYPE;
    this.totalMVInt = 0;
    this.totalLVInt = 0;
  }

  ngOnInit() {
    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === '') {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
    }

    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === 'Yes') {
      this.isChecked = true;
    }

    this.setCertyficateType();
    // this.isViewMode ? this.displayedColumns.splice(this.displayedColumns.length - 1, 1) : null;
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
            o.collateralTypeId !== COLLATERAL_TYPE['vehicle']
          );
        });
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
          this.findCollateralProperty(collateral);
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
        cp: this._creditProposal,
        collateral: value,
        binding: this.getBinding(value),
        emptyField: this.getEmptyField(value),
        applicationProduct: this.creditProposal.products,
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
        console.log('after closed ', this.creditProposal.attributes);
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
        console.log(lastAppraisal.attributes);

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
            result = result + data.liquidationValue;
          }
        }
      }
    }
    return result;
  }

  public countTotalLV(): number {
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.creditProposal.collaterals;
    if (collaterals.length > 0) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterProperties(collaterals[i]);
        if (properties.length > 0) {
          for (let a = 0; a < properties.length; a++) {
            if (properties[a].machineMarketValue && properties[a].machinePercentage) {
              result = result + properties[a].machineMarketValue * (properties[a].machinePercentage / 100);
            } else if (properties[a].propertyMarketValue && properties[a].propertyPercentage) {
              result = result + properties[a].propertyMarketValue * (properties[a].propertyPercentage / 100);
            } else if (properties[a].vehicleMarketValue && properties[a].vehiclePercentage) {
              result = result + properties[a].vehicleMarketValue * (properties[a].vehiclePercentage / 100);
            }
          }
        }
      }
    }
    return result;
  }

  public countTotalMV(): number {
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.creditProposal.collaterals;
    if (collaterals.length > 0) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterProperties(collaterals[i]);
        if (properties.length > 0) {
          for (let a = 0; a < properties.length; a++) {
            if (properties[a].machineMarketValue) {
              result = result + properties[a].machineMarketValue;
            } else if (properties[a].propertyMarketValue) {
              result = result + properties[a].propertyMarketValue;
            } else if (properties[a].vehicleMarketValue) {
              result = result + properties[a].vehicleMarketValue;
            }
          }
        }
      }
    }
    return result;
  }

  public countMV(collateral: ICollateral): number {
    let result: number;
    result = 0;

    const properties: ICollateralProperty[] = this.filterProperties(collateral);
    if (properties.length > 0) {
      if (collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
        for (let i = 0; i < properties.length; i++) {
          result = result + properties[i].machineMarketValue;
        }
      } else if (
        collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] ||
        collateral.collateralTypeId === COLLATERAL_TYPE['property']
      ) {
        for (let i = 0; i < properties.length; i++) {
          result = result + properties[i].propertyMarketValue;
        }
      } else if (collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
        for (let i = 0; i < properties.length; i++) {
          result = result + properties[i].vehicleMarketValue;
        }
      }
    }
    return result;
  }

  public slideChange($event) {
    if (this.isChecked === true) {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'Yes';
    } else {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
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

  public setCertyficateType() {
    this.partyCifService.getCertificate().subscribe(res => {
      this.certificateType = res.body;
    });
  }

  public findCertyficate(id) {
    if (this.certificateType) {
      this.dataCertyficate = this.certificateType.find(obj => obj.id === id);
      if (this.dataCertyficate) {
        return this.dataCertyficate.label;
      }
      return '';
    }
  }

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
}
