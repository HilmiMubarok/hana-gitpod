import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { Collateral, ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_BINDING_TYPE, COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { ICreditProposal } from '../../credit-proposal.model';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';
import { CreditProposalService } from '../../credit-proposal.service';
import {
  CreditProposalCollateralBinding,
  CreditProposalCollateralInsurance,
  ICreditProposalCollateralBinding,
  ICreditProposalCollateralInsurance,
} from '../credit-proposal-collateral-info.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import lodash from 'lodash';
import { CollateralPropertyResultListComponent } from 'app/entities/collateral-property/collateral-property-result-list.component';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';

@Component({
  selector: 'jhi-below-grid-previous',
  templateUrl: './below-grid-previous.component.html',
  styleUrls: ['../../collateral-info/collateral-info-cp.style.scss'],
})
export class BellowGridPreviousComponent implements OnChanges, OnInit {
  public displayedColumns: string[] = [
    'no',
    'collateralType',
    'collateralAddress',
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
  ];

  private bindingTypeVal: any;
  public dataItem: ICollateral[] = [];
  public hitungMV = [];
  public collateralProperties: ICollateralProperty[];
  public totalMVInt: number;
  public totalLVInt: number;
  private _creditProposal: ICreditProposal;
  public isChecked: boolean;
  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }];
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }
  public parsedData: any;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  constructor(
    private collateralPropertyService: CollateralPropertyService,
    public dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private collateralService: CollateralService,
    private cashCollateralService: CashCollateralService
  ) {
    this.bindingTypeVal = COLLATERAL_BINDING_TYPE;
    this.collateralProperties = [];
    this.totalMVInt = 0;
    this.totalLVInt = 0;
  }

  ngOnInit(): void {
    this.parsedData = parsePreviousAtrribute(this.creditProposal);
    this.dataItem = this.parsedData.previousReturn && this.parsedData.previousReturn.collaterals;
    console.log('dataItem', {
      dataItem: this.dataItem,
      parsedData: this.parsedData,
    });
    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === '') {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
    }

    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === 'Yes') {
      this.isChecked = true;
    }
    this.findCollateralProperty(this.creditProposal.id);
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
      })
      .subscribe(res => {
        this.dataItem = res.body;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedMenu = 'INFORMATION';
    if (changes['creditProposal']) {
      if (this.dataItem.length > 0) {
        for (let i = 0; i < this.dataItem.length; i++) {
          const collateral = this.dataItem[i];
          if (this.parsedData.previousReturn.cif) {
            this.loadByPartyId(this.parsedData.previousReturn.cif.partyId);
          }
        }
      }
    }

    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === 'Yes') {
      this.isChecked = true;
    }
  }

  countKJJPLV(collateral: ICollateral) {
    let result: number;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    result = 0;

    if (collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
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
    } else if (
      collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['property']
    ) {
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
    } else if (collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
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
    } else if (
      collateral.collateralTypeId !== COLLATERAL_TYPE['vehicle'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['property'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['machine']
    ) {
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
    if (collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === true
      );
      if (data !== undefined) {
        if (data.machineMarketValue === null) {
          result = 0;
        } else {
          result = data.machineMarketValue;
        }
      }
    } else if (
      collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['property']
    ) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === true
      );
      if (data !== undefined) {
        if (data.propertyMarketValue === null) {
          result = 0;
        } else {
          result = data.propertyMarketValue;
        }
      }
    } else if (collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === true
      );
      if (data !== undefined) {
        if (data.vehicleMarketValue === null) {
          result = 0;
        } else {
          result = data.vehicleMarketValue;
        }
      }
    } else if (
      collateral.collateralTypeId !== COLLATERAL_TYPE['vehicle'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['property'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['machine']
    ) {
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

  public getMarketability(): string {
    if (this.creditProposal.appraisals.length > 0) {
      const lastAppraisal: ICollateralAppraisal = this.creditProposal.appraisals[this.creditProposal.appraisals.length - 1];
      if (lodash.has(lastAppraisal.attributes, 'summary')) {
        return JSON.parse(lastAppraisal.attributes['summary']).marketbility;
      }
    }
    return 'N/A';
  }

  private getInsurance(element: ICollateral): ICreditProposalCollateralInsurance {
    if (this.parsedData.previousReturn.insurance.length > 0) {
      for (let i = 0; i < this.parsedData.previousReturn.insurance.length; i++) {
        const item: ICreditProposalCollateralInsurance = this.parsedData.previousReturn.insurance[i];
        if (item.collateralId === element.id) {
          return item;
        }
      }
    }
    return new CreditProposalCollateralInsurance();
  }

  private getBinding(element: ICollateral): ICreditProposalCollateralBinding {
    if (this.parsedData.previousReturn.binding.length > 0) {
      for (let i = 0; i < this.parsedData.previousReturn.binding.length; i++) {
        const item: ICreditProposalCollateralBinding = this.parsedData.previousReturn.binding[i];
        if (item.collateralId === element.id) {
          return item;
        }
      }
    }
    return new CreditProposalCollateralBinding();
  }

  public findCollateralProperty(applicationId: number): void {
    this.cashCollateralService.getCollateralProperty(applicationId).subscribe(res => {
      this.collateralProperties = [...this.collateralProperties, ...res.body];
    });
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

    if (collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
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
    } else if (
      collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['property']
    ) {
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
    } else if (collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
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
    } else if (
      collateral.collateralTypeId !== COLLATERAL_TYPE['vehicle'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['property'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['machine']
    ) {
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

  public countLVKJJP(collateral: ICollateral) {
    let result: number;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];
    result = 0;

    if (collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
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
    } else if (
      collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['property']
    ) {
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
    } else if (collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
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
    } else if (
      collateral.collateralTypeId !== COLLATERAL_TYPE['vehicle'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['property'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['machine']
    ) {
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

  public countTotalLV(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataItem;
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

  public countTotalMV() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataItem;
    if (collaterals.length > 0) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterProperties(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === false);
          if (
            (data !== undefined && collaterals[i].collateralTypeId === COLLATERAL_TYPE['realestate']) ||
            collaterals[i].collateralTypeId === COLLATERAL_TYPE['property']
          ) {
            result = result + data.propertyMarketValue;
          }
          if (data !== undefined && collaterals[i].collateralTypeId === COLLATERAL_TYPE['vehicle']) {
            result = result + data.vehicleMarketValue;
          }
          if (data !== undefined && collaterals[i].collateralTypeId === COLLATERAL_TYPE['machine']) {
            result = result + data.machineMarketValue;
          }
          if (
            (data !== undefined && collaterals[i].collateralTypeId !== COLLATERAL_TYPE['vehicle']) ||
            collaterals[i].collateralTypeId !== COLLATERAL_TYPE['realestate'] ||
            collaterals[i].collateralTypeId !== COLLATERAL_TYPE['property'] ||
            collaterals[i].collateralTypeId !== COLLATERAL_TYPE['machine']
          ) {
            result = result + data.marketValue;
          }
        }
      }
    }
    return result;
  }

  public countTotalMVKJJP() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataItem;
    if (collaterals.length > 0) {
      for (let i = 0; i < collaterals.length; i++) {
        const properties: ICollateralProperty[] = this.filterProperties(collaterals[i]);
        if (properties.length > 0) {
          data = properties.find(obj => obj.external === true);
          if (
            (data !== undefined && collaterals[i].collateralTypeId === COLLATERAL_TYPE['realestate']) ||
            collaterals[i].collateralTypeId === COLLATERAL_TYPE['property']
          ) {
            result = result + data.propertyMarketValue;
          }
          if (data !== undefined && collaterals[i].collateralTypeId === COLLATERAL_TYPE['vehicle']) {
            result = result + data.vehicleMarketValue;
          }
          if (data !== undefined && collaterals[i].collateralTypeId === COLLATERAL_TYPE['machine']) {
            result = result + data.machineMarketValue;
          }
          if (
            (data !== undefined && collaterals[i].collateralTypeId !== COLLATERAL_TYPE['vehicle']) ||
            collaterals[i].collateralTypeId !== COLLATERAL_TYPE['realestate'] ||
            collaterals[i].collateralTypeId !== COLLATERAL_TYPE['property'] ||
            collaterals[i].collateralTypeId !== COLLATERAL_TYPE['machine']
          ) {
            result = result + data?.marketValue;
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
    const collaterals: ICollateral[] = this.dataItem;
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

  public countMV(collateral: ICollateral): number {
    let result: number;
    let data: ICollateralProperty;
    let datas: ICollateralProperty[];

    if (collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.machineMarketValue === null) {
          result = 0;
        } else {
          result = data.machineMarketValue;
        }
      }
    } else if (
      collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['property']
    ) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.propertyMarketValue === null) {
          result = 0;
        } else {
          result = data.propertyMarketValue;
        }
      }
    } else if (collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.vehicleMarketValue === null) {
          result = 0;
        } else {
          result = data.vehicleMarketValue;
        }
      }
    } else if (
      collateral.collateralTypeId !== COLLATERAL_TYPE['vehicle'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['property'] ||
      collateral.collateralTypeId !== COLLATERAL_TYPE['machine']
    ) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
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
  public openResult(element: ICollateral) {
    const dialogRef = this.dialog.open(CollateralPropertyResultListComponent, {
      width: '80vw',
      data: { collateral: element },
    });
  }

  public slideChange($event) {
    if (this.isChecked === true) {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'Yes';
    } else {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
    }
  }

  public getBindingType(element: string) {
    const keyy = Object.keys(this.bindingTypeVal).find(item => item === element);
    return this.bindingTypeVal[keyy];
  }

  public print() {
    this.countTotalMV();
  }
  //
}
