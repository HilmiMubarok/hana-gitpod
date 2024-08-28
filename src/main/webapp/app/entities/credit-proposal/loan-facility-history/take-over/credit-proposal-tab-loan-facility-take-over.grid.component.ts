/* eslint-disable no-unsafe-optional-chaining */
import { Component, ViewChild, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
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
import { LoanFacilityTakeOverHistoryComponent } from './credit-proposal-tab-loan-facility-take-over.component';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import {
  IApplicationProductTakeOver,
  ApplicationProductTakeOver,
} from 'app/entities/credit-proposal/loan-facility/application-product-take-over/application-product-take-over.model';
import { LoanFacilityTakeOverAfterHistoryComponent } from '../take-over-after/credit-proposal-tab-loan-facility-take-over-after.component';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
@Component({
  selector: 'jhi-loan-facility-take-over-grid-history',
  templateUrl: './credit-proposal-tab-loan-facility-take-over.grid.component.html',
  styleUrls: ['../grid/loan.scss'],
})
export class LoanFacilityTakeOverGridHistoryComponent implements OnChanges, OnInit {
  private _creditProposal: ICreditProposal;
  @Input() isViewLoan: Boolean = false;
  @Input() isViewMode: Boolean = false;
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

  public displayColumns: string[] = ['no', 'facilityType1', 'changes', 'outstanding', 'tenor', 'action'];

  public stateOfAction?: string;
  public format = { format: 'R$ #. ## 0,00' };
  public numericFormatOptions: Object;
  public loading: boolean;
  public cloneData: any;

  // dataData: any;

  private loanApplication: ILoanApplication;
  constructor(public router: Router, public dialog: MatDialog, private loanApplicationService: LoanApplicationService) {
    this.loading = false;
  }
  ngOnInit(): void {
    this.parsedAttr = parsePreviousAtrribute(this.creditProposal);
    this.facilityTakeOver = this.parsedAttr.previousHistory.facilityTakeOver;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      this.getLoanApplication();
    }
    // this.historyGet();
  }

  public parsedAttr: any;
  // Dimatiin dulu sama moyo
  // public historyGet(){
  //   if (this.router.url.split('/').indexOf('loan-committee-approval') > -1 || this.router.url.split('/').indexOf('dar-notif') > -1 || this.router.url.split('/').indexOf('dar-final') > -1) {
  //     if (this.router.url.split('=').indexOf('loan-facility') > -1) {

  //       this.parsedAttr = parsePreviousAtrribute(this.creditProposal);
  //       if (this.parsedAttr.previousHistory) {
  //         this.facilityTakeOver = this.parsedAttr.previousHistory.facilityTakeOver;

  //       } else {
  //         this.facilityTakeOver = this.creditProposal.attributes['facilityTakeOver'];
  //     }
  //   }else{
  //     this.facilityTakeOver = this.creditProposal.attributes['facilityTakeOver'];

  //   }

  //   }else{
  //     this.facilityTakeOver = this.creditProposal.attributes['facilityTakeOver'];

  //   }
  // }

  private getLoanApplication(): void {
    this.loanApplicationService.find(this.creditProposal.id).subscribe(res => {
      this.loanApplication = res.body;
    });
  }

  // Add And Detail
  public openDialog(element: IApplicationProductTakeOver = null): void {
    const predicate = { width: '80vw', data: { object: this.creditProposal } };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['facilityTakeOver'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['facilityTakeOver'] = new ApplicationProductTakeOver();
    }
    const dialogRef = this.dialog.open(LoanFacilityTakeOverHistoryComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.facilityTakeOver = [...this.facilityTakeOver, res];
        this.facilityTakeOver = [...this.parsedAttr.previousHistory.facilityTakeOver, res];
      }
    });
  }
  // Delete Confirmation
  public facilityTakeOver: any;
  public onDelete(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Facility Takeover',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const dataGridTake = this.parsedAttr.previousHistory.facilityTakeOver.filter(({ id }) => id !== element.id);
        this.facilityTakeOver = dataGridTake;
        this.parsedAttr.previousHistory.facilityTakeOver = dataGridTake;
      }
    });
  }

  // public facilityTakeOver: any;
  // public onDelete(element: ICreditProposal) {
  //   const dataGridTake = this.parsedAttr.previousHistory.facilityTakeOver.filter(({ id }) => id !== element.id);
  //   this.facilityTakeOver = dataGridTake;
  //   this.parsedAttr.previousHistory.facilityTakeOver = dataGridTake;
  // }
}
