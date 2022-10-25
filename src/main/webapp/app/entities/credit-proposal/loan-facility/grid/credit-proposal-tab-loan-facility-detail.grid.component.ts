import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ICreditProposal, CreditProposal } from '../../credit-proposal.model';
import {
  IApplicationProduct,
  ApplicationProduct,
  ApplicationProductAttribute,
  IApplicationProductAttribute,
} from '../../../application-product/application-product.model';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { CreditProposalLoanFacilityDialogComponent } from '../dialog/loan-facility-dialog.component';
import { Router } from '@angular/router';
import { CollateralAttribute } from 'app/entities/collateral/collateral.model';
import {
  CollateralProductRelation,
  ICollateralProductRelation,
} from 'app/entities/collateral-product-relation/collateral-product-relation.model';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail-grid',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid.component.html',
  styleUrls: ['./loan.scss'],
})
export class CreditProposalTabLoanFacilityDetailGridComponent implements OnInit {
  private _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public visibleDialog: boolean;
  public applicationProduct: IApplicationProduct;
  public collaterallInfo: any;
  public collateralProductRelations: any;
  public creditProposaldata: any;

  public displayColumns: string[] = [
    'no',
    'applicationType',
    'facilityType',
    'subLimit',
    'currency',
    'initialLimit',
    'outstanding',
    'changes',
    'totalCreditLimit',
    'interestrate',
    'provisionAmount',
    'provisionCcy',
    'tenor',
    'maturityDate',
    'action',
  ];

  public stateOfAction?: string;
  public format = { format: 'R$ #. ## 0,00' };
  public numericFormatOptions: Object;
  public loading: boolean;
  public cloneData: any;

  // dataData: any;

  constructor(public dialog: MatDialog, public _router: Router) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();

    this.loading = false;
    this.visibleDialog = false;
  }

  ngOnInit(): void {
    this.numericFormatOptions = { format: 'N' };
    this.collaterallInfo = this.creditProposal.collaterals;
    this.collateralProductRelations = this.creditProposal.collateralProductRelations;
    this.creditProposaldata = this.creditProposal;
  }

  public openDialog(param: IApplicationProduct = null): void {
    if (param) {
      this.applicationProduct = param;
      if (this.applicationProduct.attributes && typeof this.applicationProduct.attributes !== 'object') {
        this.applicationProduct.attributes = JSON.parse(this.applicationProduct.attributes);
      }
      if (this.applicationProduct.attributes.commitedLine === 'true') {
        this.applicationProduct.attributes.commitedLine = true;
        // console.log('comitted line', this.applicationProduct.attributes.commitedLine);
      } else if (this.applicationProduct.attributes.commitedLine === 'false') {
        this.applicationProduct.attributes.commitedLine = false;
        // console.log('comitted line', this.applicationProduct.attributes.commitedLine);
      }
      if (this.applicationProduct.attributes.subLimit === 'true') {
        this.applicationProduct.attributes.subLimit = true;
        // console.log('sublimit', this.applicationProduct.attributes.subLimit);
      } else if (this.applicationProduct.attributes.subLimit === 'false') {
        this.applicationProduct.attributes.subLimit = false;
        // console.log('sublimit', this.applicationProduct.attributes.subLimit);
      }
      if (this.applicationProduct.attributes.restructuredStatus === 'true') {
        this.applicationProduct.attributes.restructuredStatus = true;
        // console.log('restructuredStatus', this.applicationProduct.attributes.restructuredStatus);
      } else if (this.applicationProduct.attributes.restructuredStatus === 'false') {
        this.applicationProduct.attributes.restructuredStatus = false;
        // console.log('restructuredStatus', this.applicationProduct.attributes.restructuredStatus);
      }
    } else {
      this.applicationProduct = new ApplicationProduct();
      const attr: IApplicationProductAttribute = new ApplicationProductAttribute();
      attr.nomorUrutFasilitas = this.creditProposal.products.length + 1;
      this.applicationProduct.attributes = attr;
    }

    const dialogRef = this.dialog.open(CreditProposalLoanFacilityDialogComponent, {
      width: '80vw',
      data: {
        item: this.creditProposal,
        creditProposaldata: this.creditProposal,
        applicationProduct: this.applicationProduct,
        collateralInfo: this.collaterallInfo,
        collateralProductRelations: this.collateralProductRelations,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.applicationProduct = res;
        this.onSave();
      }
    });
  }

  public onSave(): void {
    // add new
    const appProduct: IApplicationProduct = this.applicationProduct;
    let idx: number;
    if (!this.applicationProduct.id) {
      idx = lodash.findIndex(this.creditProposal.products, function (o) {
        return o.uniqueKey === appProduct.uniqueKey;
      });

      if (idx === -1) {
        // kalau tidak pernah add baru
        const copyApplicationProduct: IApplicationProduct = Object.assign({}, this.applicationProduct);
        copyApplicationProduct.applicationId = this.creditProposal.id;

        this.creditProposal.products = [...this.creditProposal.products, this.applicationProduct];
      } else {
        this.creditProposal.products[idx] = appProduct;
      }
    } else {
      idx = lodash.findIndex(this.creditProposal.products, function (o) {
        return o.id === appProduct.id;
      });
      this.creditProposal.products[idx] = appProduct;
    }
  }

  public onDelete(element: IApplicationProduct) {
    const dataGrid = this.creditProposal.products.filter(({ attributes }) => attributes !== element.attributes);
    this.creditProposal.products = dataGrid;
  }

  public parseStringToInt(data: string): number {
    return parseInt(data, 10);
  }

  public printElement(element) {
    let subLimit: string;
    subLimit = '';
    if (element === true || element === 'true') {
      subLimit = 'Yes';
    } else if (element === false || element === 'false') {
      subLimit = 'No';
    }
    return subLimit;
  }

  print() {
    console.log(this._creditProposal);
  }
}
