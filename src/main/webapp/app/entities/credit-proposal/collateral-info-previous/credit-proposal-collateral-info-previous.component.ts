import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { ICreditProposal } from '../credit-proposal.model';
import lodash from 'lodash';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';
import { CreditProposalService } from '../credit-proposal.service';
import {
  CreditProposalCollateralBinding,
  CreditProposalCollateralInsurance,
  ICreditProposalCollateralBinding,
  ICreditProposalCollateralInsurance,
} from './credit-proposal-collateral-info.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';

@Component({
  selector: 'jhi-credit-proposal-collateral-info-previous',
  templateUrl: './credit-proposal-collateral-info-previous.component.html',
  styleUrls: ['../collateral-info/collateral-info-cp.style.scss'],
})
export class CreditProposalCollateralInfoPreviousComponent implements OnInit, OnChanges {
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
  public dataSource: any;
  @Input() isOffering: Boolean = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  ngOnInit(): void {
    if (this.creditProposal.attributes['previousReturn']) {
      this.dataSource = JSON.parse(this.creditProposal.attributes['previousReturn']).collaterals;
    } else if (this.isOffering) {
      this.dataSource = JSON.parse(this.creditProposal.attributes['previousHistory']).collateras;
    } else {
      this.dataSource = [];
    }
    this.findCollateralProperty(this.creditProposal.id);
  }

  constructor(
    private collateralPropertyService: CollateralPropertyService,
    public dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private cashCollateralService: CashCollateralService
  ) {
    this.collateralProperties = [];
    this.totalMVInt = 0;
    this.totalLVInt = 0;
    // this.totalKJJPLVInt = 0;
    // this.totalKJJPMVInt = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedMenu = 'INFORMATION';
    if (changes['creditProposal']) {
      if (this.creditProposal.collaterals.length > 0) {
        for (let i = 0; i < this.creditProposal.collaterals.length; i++) {
          const collateral = this.creditProposal.collaterals[i];
        }
      }
    }
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
    if (this.creditProposal.attributes['previousReturn']) {
      if (JSON.parse(this.creditProposal.attributes['previousReturn']).appraisals.length > 0) {
        const lastAppraisal: ICollateralAppraisal = JSON.parse(this.creditProposal.attributes['previousReturn']).appraisals[
          JSON.parse(this.creditProposal.attributes['previousReturn']).appraisals.length - 1
        ];
        if (lodash.has(lastAppraisal.attributes, 'summary')) {
          return JSON.parse(lastAppraisal.attributes['summary']).marketbility;
        }
      }
    }
    return 'N/A';
  }

  private getInsurance(element: ICollateral): ICreditProposalCollateralInsurance {
    if (this.creditProposal.attributes['previousReturn']) {
      if (JSON.parse(this.creditProposal.attributes['previousReturn']).insurance.length > 0) {
        for (let i = 0; i < JSON.parse(this.creditProposal.attributes['previousReturn']).insurance.length; i++) {
          const item: ICreditProposalCollateralInsurance = JSON.parse(this.creditProposal.attributes['previousReturn']).insurance[i];
          if (item.collateralId === element.id) {
            return item;
          }
        }
      }
    }

    return new CreditProposalCollateralInsurance();
  }

  private getBinding(element: ICollateral): ICreditProposalCollateralBinding {
    if (this.creditProposal.attributes['previousReturn']) {
      if (JSON.parse(this.creditProposal.attributes['previousReturn']).binding.length > 0) {
        for (let i = 0; i < JSON.parse(this.creditProposal.attributes['previousReturn']).binding.length; i++) {
          const item: ICreditProposalCollateralBinding = JSON.parse(this.creditProposal.attributes['previousReturn']).binding[i];
          if (item.collateralId === element.id) {
            return item;
          }
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
    const collaterals: ICollateral[] = this.creditProposal.attributes['previous'].collateralInfo;
    if (collaterals?.length > 0) {
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
