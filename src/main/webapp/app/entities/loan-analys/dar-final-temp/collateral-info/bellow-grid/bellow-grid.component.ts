import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';
import { CollateralInfoDialogTempComponent } from '../dialog/collateral-info-dialog-temp.component';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import {
  CreditProposalCollateralBinding,
  CreditProposalCollateralInsurance,
  ICreditProposalCollateralBinding,
  ICreditProposalCollateralInsurance,
} from '../credit-proposal-collateral-info.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import lodash from 'lodash';

@Component({
  selector: 'jhi-bellow-grid-temp',
  templateUrl: './bellow-grid.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
})
export class BellowGridTempComponent implements OnChanges {
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
    'action',
  ];

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
    private creditProposalService: CreditProposalService
  ) {
    this.collateralProperties = [];
    this.totalMVInt = 0;
    this.totalLVInt = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedMenu = 'INFORMATION';
    if (changes['creditProposal']) {
      if (this.creditProposal.collaterals.length > 0) {
        for (let i = 0; i < this.creditProposal.collaterals.length; i++) {
          const collateral = this.creditProposal.collaterals[i];
          this.findCollateralProperty(collateral);
        }
      }
    }

    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === 'Yes') {
      this.isChecked = true;
    }
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
        marketability: this.getMarketability(),
        internalMV: this.countMV(element),
        internalLV: this.countLV(element),
        properties: this.filterProperties(element),
        binding: this.getBinding(element),
        insurance: this.getInsurance(element),
        applicationProduct: this.creditProposal.products,
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
  countKJJPLV(element: ICollateral) {
    throw new Error('Method not implemented.');
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
    this.collateralPropertyService.queryFilterBy({ idCollateral: collateral.id, page: 0, size: 9999 }).subscribe(res => {
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

  public countTotalMV() {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.creditProposal.collaterals;
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
    const collaterals: ICollateral[] = this.creditProposal.collaterals;
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

  public slideChange($event) {
    if (this.isChecked === true) {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'Yes';
    } else {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
    }
  }

  public print() {
    this.countTotalMV();
  }
  //
}
