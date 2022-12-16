import { Component, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
import { CreditProposalLoanFacilityDialogHistoryComponent } from '../dialog/loan-facility-dialog.component';
import { Router } from '@angular/router';
import { CollateralAttribute } from 'app/entities/collateral/collateral.model';
import {
  CollateralProductRelation,
  ICollateralProductRelation,
} from 'app/entities/collateral-product-relation/collateral-product-relation.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-loan-facility-detail-grid-history',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid.component.html',
  styleUrls: ['./loan.scss'],
})
export class LoanFacilityDetailGridHistoryComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<any[]>();
  public dataParty = [];
  @Input() isViewMode: Boolean = false;
  public _creditProposal: ICreditProposal;
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
  public parsedAttribute = {};

  constructor(public partyCifService: PartyCifService, public dialog: MatDialog, public _router: Router) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();

    this.loading = false;
    this.visibleDialog = false;
  }

  ngOnInit(): void {
    this.parsedAttribute = parsePreviousAtrribute(this.creditProposal);
    this.partyCifFunc();
    this.numericFormatOptions = { format: 'N' };
    this.collaterallInfo = this.creditProposal.collaterals;
    this.collateralProductRelations = this.creditProposal.collateralProductRelations;
    this.creditProposaldata = this.creditProposal;
    this.isViewMode && this.displayColumns.pop();
  }
  partyCifFunc() {
    for (let i = 0; i < this.parsedAttribute['previousHistory'].products.length; i++) {
      this.dataParty.push(this.parsedAttribute['previousHistory'].products[i]);
    }
  }

  public openDialog(param: IApplicationProduct = null): void {
    if (param) {
      this.applicationProduct = param;
      if (this.applicationProduct.attributes && typeof this.applicationProduct.attributes !== 'object') {
        this.applicationProduct.attributes = JSON.parse(this.applicationProduct.attributes);
      }
      if (this.applicationProduct.attributes.commitedLine === 'true') {
        this.applicationProduct.attributes.commitedLine = true;
      } else if (this.applicationProduct.attributes.commitedLine === 'false') {
        this.applicationProduct.attributes.commitedLine = false;
      }
      if (this.applicationProduct.attributes.subLimit === 'true') {
        this.applicationProduct.attributes.subLimit = true;
      } else if (this.applicationProduct.attributes.subLimit === 'false') {
        this.applicationProduct.attributes.subLimit = false;
      }
      if (this.applicationProduct.attributes.restructuredStatus === 'true') {
        this.applicationProduct.attributes.restructuredStatus = true;
      } else if (this.applicationProduct.attributes.restructuredStatus === 'false') {
        this.applicationProduct.attributes.restructuredStatus = false;
      }
    } else {
      this.applicationProduct = new ApplicationProduct();
      const attr: IApplicationProductAttribute = new ApplicationProductAttribute();
      attr.nomorUrutFasilitas = this.creditProposal.products.length + 1;
      this.applicationProduct.attributes = attr;
    }

    const dialogRef = this.dialog.open(CreditProposalLoanFacilityDialogHistoryComponent, {
      width: '80vw',

      data: {
        item: this.creditProposal,
        creditProposaldata: this.creditProposal,
        applicationProduct: this.applicationProduct,
        collateralInfo: this.collaterallInfo,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.applicationProduct = res.applicationProduct;
        this.creditProposal.collateralProductRelations = [...res.creditProposal.collateralProductRelations];
        this.onSave();
      }
    });
  }

  public onSave(): void {
    const appProduct: IApplicationProduct = this.applicationProduct;
    let idx: number;
    if (!this.applicationProduct.id) {
      idx = lodash.findIndex(this.creditProposal.products, function (o) {
        return o.uniqueKey === appProduct.uniqueKey;
      });

      if (idx === -1) {
        const copyApplicationProduct: IApplicationProduct = Object.assign({}, this.applicationProduct);
        copyApplicationProduct.applicationId = this.creditProposal.id;
        this.dataParty = [...this.dataParty, this.applicationProduct];
        this.creditProposal.products = [...this.creditProposal.products, this.applicationProduct];
      } else {
        this.creditProposal.products[idx] = appProduct;
        this.dataParty[idx] = appProduct;
      }
    } else {
      idx = lodash.findIndex(this.creditProposal.products, function (o) {
        return o.id === appProduct.id;
      });
      this.creditProposal.products[idx] = appProduct;
      this.dataParty[idx] = appProduct;
    }
  }

  public onDelete(element: IApplicationProduct) {
    const dataGrid = this.creditProposal.products.filter(({ attributes }) => attributes !== element.attributes);
    this.dataParty = dataGrid;
    this.creditProposal.products = dataGrid;
    this.partyCifFunc();
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
