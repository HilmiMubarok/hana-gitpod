import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';
import { CreditProposalCollateralInfoDialogComponent } from '../dialog/credit-proposal-collateral-info-dialog.component';
import { CreditProposalService } from '../../credit-proposal.service';
import { CreditProposalCollateralBinding, ICreditProposalCollateralBinding } from '../credit-proposal-collateral-info.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { DialogCreditProposalCollateralInfoDialogBTBComponent } from './dialog-credit-proposal-collateral-info-btb.component';
import { IEmptyField } from './empty-field.model';
@Component({
  selector: 'jhi-credit-proposal-collateral-info-btb',
  templateUrl: './credit-proposal-collateral-info-btb.component.html',
})
export class CreditProposalCollateralInfoBTPComponent implements OnChanges, OnInit {
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

  public collateralProperties: ICollateralProperty[];
  public totalMVInt: number;
  public totalLVInt: number;
  // public totalKJJPMVInt: number;
  // public totalKJJPLVInt: number;
  private _creditProposal: ICreditProposal;

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
    private collateralPropertyService: CollateralPropertyService,
    public dialog: MatDialog,
    private creditProposalService: CreditProposalService
  ) {
    this.collateralProperties = [];
    this.totalMVInt = 0;
    this.totalLVInt = 0;
    // this.totalKJJPLVInt = 0;
    // this.totalKJJPMVInt = 0;
  }

  ngOnInit() {
    this.isViewMode ? this.displayedColumns.splice(this.displayedColumns.length - 1, 1) : null;
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
        collateral: value,
        binding: this.getBinding(value),
        emptyField: this.getEmptyField(value),
      },
    };
    const dialogRef = this.dialog.open(DialogCreditProposalCollateralInfoDialogBTBComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      console.log('res ddd', res);
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
        // return lastAppraisal.attributes['summary'].marketbility;
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
    this.collateralPropertyService.queryFilterBy({ idCollateral: collateral.id, page: 0, size: 9999 }).subscribe(res => {
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
    result = 0;
    const properties: ICollateralProperty[] = this.filterProperties(collateral);
    if (properties.length > 0) {
      if (collateral.collateralTypeId === COLLATERAL_TYPE['machine']) {
        for (let i = 0; i < properties.length; i++) {
          result = result + properties[i].machineMarketValue * (properties[i].machinePercentage / 100);
        }
      } else if (
        collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] ||
        collateral.collateralTypeId === COLLATERAL_TYPE['property']
      ) {
        for (let i = 0; i < properties.length; i++) {
          result = result + properties[i].propertyMarketValue * (properties[i].propertyPercentage / 100);
        }
      } else if (collateral.collateralTypeId === COLLATERAL_TYPE['vehicle']) {
        for (let i = 0; i < properties.length; i++) {
          result = result + properties[i].vehicleMarketValue * (properties[i].vehiclePercentage / 100);
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
}
