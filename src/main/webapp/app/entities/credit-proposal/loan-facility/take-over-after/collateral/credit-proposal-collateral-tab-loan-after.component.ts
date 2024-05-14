import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { Collateral, ICollateral, ICollateralInfoAfter } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';

import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import {
  ICreditProposalCollateralBinding,
  ICreditProposalCollateralInsurance,
  CreditProposalCollateralInsurance,
  CreditProposalCollateralBinding,
} from 'app/entities/credit-proposal/collateral-info/credit-proposal-collateral-info.model';
import { CreditProposalCollateralTabLoanAfterDialogComponent } from './credit-proposal-collateral-tab-loan-after-dialog.component';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CashCollateralService } from 'app/entities/cash-collateral/cash-collateral.service';

@Component({
  selector: 'jhi-credit-proposal-collateral-tab-loan-after',
  templateUrl: './credit-proposal-collateral-tab-loan-after.component.html',
  styleUrls: ['./credit-proposal-collateral-tab-loan-after.styles.scss'],
})
export class CreditProposalCollateralTabLoanAfterComponent implements OnChanges, OnInit {
  @Input() isViewMode: Boolean = false;
  public displayedColumns: string[] = ['no', 'collateralType', 'marketValue', 'liquidValue', 'action'];

  public collateralInfoAfterReport: ICollateralInfoAfter;
  public data: ICollateral;
  public dataCollateralTotal: ICollateral[];
  public dataCollateral: ICollateral[];
  public collateralProperties: ICollateralProperty[];
  public totalMVInt: number;
  public totalLVInt: number;
  public dataItem: any;
  public parentPath: any;
  // public totalKJJPMVInt: number;
  // public totalKJJPLVInt: number;
  private _creditProposal: ICreditProposal;
  @ViewChild('paginator') paginator: MatPaginator;
  public selectedMenu: string;
  public clikedMenu: string;
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
    protected activatedRoute: ActivatedRoute,
    private collateralPropertyService: CollateralPropertyService,
    public dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private collateralService: CollateralService,
    public router: Router,
    private cashCollateralService: CashCollateralService
  ) {
    this.collateralProperties = [];
    this.totalMVInt = 0;
    this.totalLVInt = 0;
    this.parentPath = this.router.url.split('/')[1];
    // this.totalKJJPLVInt = 0;
    // this.totalKJJPMVInt = 0;

    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.clikedMenu = subRoute;
      }
    });
  }
  ngOnInit(): void {
    if (this.creditProposal.attributes['collateralAfterData']) {
      while (typeof this.creditProposal.attributes['collateralAfterData'] === 'string') {
        this.creditProposal.attributes['collateralAfterData'] = JSON.parse(this.creditProposal.attributes['collateralAfterData']);
      }
      this.dataCollateralTotal = this.creditProposal.attributes['collateralAfterData'];
      this.dataItem = new MatTableDataSource(this.creditProposal.attributes['collateralAfterData']);
      this.dataItem.paginator = this.paginator;
    } else {
      this.creditProposal.attributes['collateralAfterData'] = [];
    }
    if (this.creditProposal.attributes['collateralAfterReport']) {
      while (typeof this.creditProposal.attributes['collateralAfterReport'] === 'string') {
        this.creditProposal.attributes['collateralAfterReport'] = JSON.parse(this.creditProposal.attributes['collateralAfterReport']);
      }
    } else {
      this.creditProposal.attributes['collateralAfterReport'] = [];
    }
    if (this.creditProposal.customerType === 'PERSONAL') {
      this.findCollateralProperty(this.creditProposal.prospectPerson.id);
    } else {
      this.findCollateralProperty(this.creditProposal.prospectOrganization.id);
    }
  }

  public deleteButtonStats() {
    if (
      this.parentPath === 'review-pk' ||
      this.parentPath === 'finalize-pk' ||
      this.parentPath === 'finalize-dpdl' ||
      this.parentPath === 'review-dpdl' ||
      this.parentPath === 'distribution' ||
      this.parentPath === 'review' ||
      this.parentPath === 'finalize'
    ) {
      return true;
    } else if (this.parentPath === 'dar-final' || this.parentPath === 'loan-committee-approval') {
      if (this.clikedMenu !== 'loan-facility-detail') {
        return true;
      }
      return false;
    }
    return false;
  }

  public addButtonStats() {
    if (this.parentPath === 'dar-final' || this.parentPath === 'loan-committee-approval') {
      if (this.clikedMenu !== 'loan-facility-detail') {
        return false;
      }
      return true;
    }
    return false;
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
        size: 999,
      })
      .subscribe(res => {
        this.dataCollateral = res.body;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedMenu = 'INFORMATION';
    if (changes['creditProposal']) {
      if (this.creditProposal.collaterals.length > 0) {
        for (let i = 0; i < this.creditProposal.collaterals.length; i++) {
          const collateral = this.creditProposal.collaterals[i];
          this.loadByPartyId(collateral.partyId);
        }
      }
    }
  }

  public openDialog(element?: ICollateral, type = 'view'): void {
    let dataCollateralOption: ICollateral[] = this.dataCollateral;

    if (this.creditProposal.attributes['collateralAfterData'].length > 0) {
      for (let i = 0; i < this.creditProposal.attributes['collateralAfterData'].length; i++) {
        if (this.creditProposal.attributes['proposalType'] === 'Total Exposure Back to Back') {
          dataCollateralOption = dataCollateralOption.filter(function (o) {
            return (
              o.collateralTypeId !== COLLATERAL_TYPE['machine'] &&
              o.collateralTypeId !== COLLATERAL_TYPE['realestate'] &&
              o.collateralTypeId !== COLLATERAL_TYPE['vehicle'] &&
              o.collateralTypeId !== COLLATERAL_TYPE['property'] &&
              o.collateralTypeId !== COLLATERAL_TYPE['personalCorporateGuarantee']
            );
          });
        }
        dataCollateralOption = dataCollateralOption.filter(obj => obj.id !== this.creditProposal.attributes['collateralAfterData'][i].id);
      }
    } else {
      dataCollateralOption = this.dataCollateral;
      if (this.creditProposal.attributes['proposalType'] === 'Total Exposure Back to Back') {
        dataCollateralOption = dataCollateralOption.filter(function (o) {
          return (
            o.collateralTypeId !== COLLATERAL_TYPE['machine'] &&
            o.collateralTypeId !== COLLATERAL_TYPE['realestate'] &&
            o.collateralTypeId !== COLLATERAL_TYPE['vehicle'] &&
            o.collateralTypeId !== COLLATERAL_TYPE['property'] &&
            o.collateralTypeId !== COLLATERAL_TYPE['personalCorporateGuarantee']
          );
        });
      }
    }
    let cp = {};

    if (element) {
      for (let index = 0; index < this.creditProposal.collaterals.length; index++) {
        if (this.creditProposal.collaterals[index].collateralId === element.collateralId) {
          cp = this.creditProposal;
        }
      }
    } else {
      element = new Collateral();
    }

    const predicate: object = {
      Width: '80vw',
      Height: 'auto',
      data: {
        cp: this.creditProposal,
        dataCollateral: this.dataCollateral,
        dataCollateralOptionx: dataCollateralOption,
        collateralProperties: this.collateralProperties,
        collateral: element,
        view: type,
      },
    };
    const dialogRef = this.dialog.open(CreditProposalCollateralTabLoanAfterDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      const collateral = this.dataCollateral.find(obj => obj.id === res.collateral.id);
      if (collateral) {
        this.creditProposal.attributes['collateralAfterData'].push(collateral);
      }
      this.dataCollateralTotal = this.creditProposal.attributes['collateralAfterData'];
      this.dataItem = new MatTableDataSource(this.creditProposal.attributes['collateralAfterData']);
      this.dataItem.paginator = this.paginator;
      this.creditProposal.attributes['collateralAfterReport'].push(res.collateralAfter);
    });
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
    const collaterals: ICollateral[] = this.dataCollateralTotal;
    if (collaterals) {
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
    this.creditProposal.attributes['totalLvAfterCollateral'] = result;
    return result;
  }

  public countTotalMV(): number {
    let data: ICollateralProperty;
    let result: number;
    result = 0;
    const collaterals: ICollateral[] = this.dataCollateralTotal;
    if (collaterals) {
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
    this.creditProposal.attributes['totalMvAfterCollateral'] = result;
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

  public onDelete(element) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Take Over After Data',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.creditProposal.attributes['collateralAfterData'] = this.creditProposal.attributes['collateralAfterData'].filter(
          obj => obj.id !== element.id
        );
        this.dataCollateralTotal = this.creditProposal.attributes['collateralAfterData'];
        this.dataItem = new MatTableDataSource(this.creditProposal.attributes['collateralAfterData']);
        this.dataItem.paginator = this.paginator;
        this.creditProposal.attributes['collateralAfterReport'] = this.creditProposal.attributes['collateralAfterReport'].filter(
          obj => obj.id !== element.id
        );
      }
    });
  }
}
