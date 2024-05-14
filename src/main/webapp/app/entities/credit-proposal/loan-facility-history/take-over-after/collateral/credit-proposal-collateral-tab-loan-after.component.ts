import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import lodash from 'lodash';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';

import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import {
  ICreditProposalCollateralBinding,
  ICreditProposalCollateralInsurance,
} from 'app/entities/credit-proposal/collateral-info/credit-proposal-collateral-info.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CollateralTabLoanAfterDialogHistoryComponent } from './credit-proposal-collateral-tab-loan-after-dialog.component';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';

@Component({
  selector: 'jhi-collateral-tab-loan-after-history',
  templateUrl: './credit-proposal-collateral-tab-loan-after.component.html',
  styleUrls: ['./collateral-info-dialog.css'],
})
export class CollateralTabLoanAfterHistoryComponent implements OnChanges {
  @Input() isViewMode: Boolean = false;
  @Input() isViewLoan: Boolean = false;

  public displayedColumns: string[] = ['no', 'collateralType', 'marketValue', 'liquidValue', 'action'];

  public collateralProperties: ICollateralProperty[];
  public totalMVInt: number;
  public totalLVInt: number;
  public dataItem: any;
  private _creditProposal: ICreditProposal;
  @ViewChild('paginator') paginator: MatPaginator;
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
    private creditProposalService: CreditProposalService,
    private collateralService: CollateralService,
    private cashCollateralService: CashCollateralService
  ) {
    this.collateralProperties = [];
    this.totalMVInt = 0;
    this.totalLVInt = 0;
  }

  private loadCollateralAfterData() {
    if (this.creditProposal.attributes['collateralAfterData']) {
      while (typeof this.creditProposal.attributes['collateralAfterData'] === 'string') {
        this.creditProposal.attributes['collateralAfterData'] = JSON.parse(this.creditProposal.attributes['collateralAfterData']);
      }
      // this.dataCollateralTotal = this.creditProposal.attributes['collateralAfterData'];
      this.dataItem = new MatTableDataSource(this.creditProposal.attributes['collateralAfterData']);
      this.dataItem.paginator = this.paginator;
    } else {
      this.creditProposal.attributes['collateralAfterData'] = [];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedMenu = 'INFORMATION';
    if (changes['creditProposal']) {
      if (this.creditProposal.collaterals.length > 0) {
        for (let i = 0; i < this.creditProposal.collaterals.length; i++) {
          const collateral = this.creditProposal.collaterals[i];
        }
      }
      this.loadCollateralAfterData();
      if (this.creditProposal.customerType === 'PERSONAL') {
        this.findCollateralProperty(this.creditProposal.prospectPerson.id);
      } else {
        this.findCollateralProperty(this.creditProposal.prospectOrganization.id);
      }
    }
  }

  public openDialog(element: ICollateral): void {
    let cp = {};
    for (let index = 0; index < this.creditProposal.collaterals.length; index++) {
      if (this.creditProposal.collaterals[index].collateralId === element.collateralId) {
        cp = this.creditProposal;
      }
    }
    // console.log('bab', this.creditProposal);
    const predicate: object = {
      width: '80vw',
      data: {
        cp: this.creditProposal,
        collateral: element,
        marketability: this.getMarketability(),
        internalMV: this.countMV(element),
        internalLV: this.countLV(element),
      },
    };
    const dialogRef = this.dialog.open(CollateralTabLoanAfterDialogHistoryComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
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

  public findCollateralProperty(partyId: string): void {
    this.cashCollateralService.getCollateralPropertyGroupAndDebitur(partyId).subscribe(res => {
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
    // console.log("collateral in above grid",collateral);
    if (collateral.collateralTypeId) {
      data = this.collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.liquidationValue === null) {
          return 0;
        } else {
          return data.liquidationValue;
        }
      }
    }
    return 0;
  }

  public countTotalLV(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.creditProposal.attributes['collateralAfterData'];
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

  public countTotalMV(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.creditProposal.attributes['collateralAfterData'];
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
}
