import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';
import {
  IApplicationProduct,
  ApplicationProduct,
  ApplicationProductAttribute,
  IApplicationProductAttribute,
} from '../../../application-product/application-product.model';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { CreditProposalLoanFacilityDialogComponent } from '../../loan-facility/dialog/loan-facility-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail-grid-previous',
  templateUrl: './credit-proposal-tab-loan-facility-detail.grid-previous.component.html',
  styleUrls: ['./loan.scss'],
})
export class CreditProposalTabLoanFacilityDetailGridPreviousComponent implements OnInit {
  private _creditProposal: ICreditProposal;
  public dataSource: any;
  @Input() isOffering: Boolean = false;
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
    'availableLimit',
    'maturityDate',
  ];

  public stateOfAction?: string;
  public format = { format: 'R$ #. ## 0,00' };
  public numericFormatOptions: Object;
  public loading: boolean;
  public cloneData: any;

  constructor(public dialog: MatDialog, public _router: Router) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();

    this.loading = false;
    this.visibleDialog = false;
  }

  ngOnInit(): void {
    if (this.creditProposal.attributes['previousReturn']) {
      this.dataSource = JSON.parse(this.creditProposal.attributes['previousReturn']).products;
    } else if (this.isOffering) {
      this.dataSource = JSON.parse(this.creditProposal.attributes['previousHistory']).products;
    } else {
      this.dataSource = [];
    }
    this.numericFormatOptions = { format: 'N' };
    this.collaterallInfo = this.creditProposal.collaterals;
    this.collateralProductRelations = this.creditProposal.collateralProductRelations;
    this.creditProposaldata = this.creditProposal;
  }

  public parseStringToInt(data: string): number {
    return parseInt(data, 10);
  }
}
