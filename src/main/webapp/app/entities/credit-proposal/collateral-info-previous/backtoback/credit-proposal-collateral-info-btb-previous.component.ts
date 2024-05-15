import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';
import { CreditProposalService } from '../../credit-proposal.service';
import { CreditProposalCollateralBinding, ICreditProposalCollateralBinding } from '../credit-proposal-collateral-info.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { IEmptyField } from './empty-field.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';
@Component({
  selector: 'jhi-credit-proposal-collateral-info-btb-previous',
  templateUrl: './credit-proposal-collateral-info-btb-previous.component.html',
  styleUrls: ['../../collateral-info/collateral-info-cp.style.scss'],
})
export class CreditProposalCollateralInfoBTPPreviousComponent implements OnInit, OnChanges {
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
  ];

  public collateralProperties: ICollateralProperty[];
  public dataItem: ICollateral[];
  public totalMVInt: number;
  public totalLVInt: number;
  public isChecked: boolean;
  private _creditProposal: ICreditProposal;

  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }];
  public parsedData: any;
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
    private creditProposalService: CreditProposalService,
    private collateralService: CollateralService,
    private cashCollateralService: CashCollateralService
  ) {
    this.collateralProperties = [];
    this.totalMVInt = 0;
    this.totalLVInt = 0;
  }

  ngOnInit() {
    this.parsedData = parsePreviousAtrribute(this.creditProposal);
    this.dataItem = this.parsedData.previousReturn && this.parsedData.previousReturn.collaterals;
    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === '') {
      this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus = 'No';
    }

    if (this.creditProposal.attributes['creditProposalCollateralData'].crossCollateralStatus === 'Yes') {
      this.isChecked = true;
    }
    this.isViewMode ? this.displayedColumns.splice(this.displayedColumns.length - 1, 1) : null;
    if (this.creditProposal.customerType === 'PERSONAL') {
      this.findCollateralProperty(this.creditProposal.prospectPerson.id);
    } else {
      this.findCollateralProperty(this.creditProposal.prospectOrganization.id);
    }
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
      if (this.parsedData.previousReturn.collaterals.length > 0) {
        for (let i = 0; i < this.parsedData.previousReturn.collaterals.length; i++) {
          const collateral = this.parsedData.previousReturn.collaterals[i];
          if (this.creditProposal.cif) {
            this.loadByPartyId(this.creditProposal.cif.partyId);
          }
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
    const collaterals: ICollateral[] = this.parsedData.previousReturn.collaterals;
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
    const collaterals: ICollateral[] = this.parsedData.previousReturn.collaterals;
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
}
