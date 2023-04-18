/* eslint-disable no-unsafe-optional-chaining */
import { Component, ViewChild, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ICreditProposal, CreditProposal } from '../../credit-proposal.model';

import { MatDialog } from '@angular/material/dialog';

import { LoanFacilityTakeOverAfterHistoryComponent } from './credit-proposal-tab-loan-facility-take-over-after.component';
import { IApplicationProductTakeOver } from 'app/entities/credit-proposal/loan-facility/application-product-take-over/application-product-take-over.model';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { ApplicationProductTakeOverBank } from 'app/entities/credit-proposal/loan-facility/application-product-take-over-after-bank/application-product-take-over-after-bank.model';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-loan-facility-take-over-after-grid-history',
  templateUrl: './credit-proposal-tab-loan-facility-take-over-after.grid.component.html',
  styleUrls: ['../grid/loan.scss'],
})
export class LoanFacilityTakeOverAfterGridHistoryComponent implements OnChanges, OnInit {
  private _creditProposal: ICreditProposal;
  @Input() isViewMode: Boolean = false;

  @Input() isViewLoan: Boolean = false;
  facilityTakeOverAfterBank: any;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public displayColumns: string[] = ['no', 'facilityType1', 'changes', 'outstanding', 'tenor', 'action'];

  public numericFormatOptions: Object;
  public loading: boolean;
  private loanApplication: ILoanApplication;
  constructor(public dialog: MatDialog, public router: Router, private loanApplicationService: LoanApplicationService) {
    this.loading = false;
  }
  ngOnInit(): void {
    this.parsedAttr = parsePreviousAtrribute(this.creditProposal);
    this.facilityTakeOverAfterBank = this.parsedAttr.previousHistory.facilityTakeOverAfterBank;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      this.getLoanApplication();
    }
    // this.historyGet();
  }

  private getLoanApplication(): void {
    this.loanApplicationService.find(this.creditProposal.id).subscribe(res => {
      this.loanApplication = res.body;
    });
  }
  public parsedAttr: any;
  // Di Matiin dulu sama moyo
  // public historyGet(){
  //   if (this.router.url.split('/').indexOf('loan-committee-approval') > -1 || this.router.url.split('/').indexOf('dar-notif') > -1 || this.router.url.split('/').indexOf('dar-final') > -1) {
  //     if (this.router.url.split('=').indexOf('loan-facility') > -1) {

  //       this.parsedAttr = parsePreviousAtrribute(this.creditProposal);
  //       if (this.parsedAttr.previousHistory) {
  //         this.facilityTakeOverAfterBank = this.parsedAttr.previousHistory.facilityTakeOverAfterBank;

  //       } else {
  //         this.facilityTakeOverAfterBank = this.creditProposal.attributes['facilityTakeOverAfterBank'];
  //     }
  //   }else{
  //     this.facilityTakeOverAfterBank = this.creditProposal.attributes['facilityTakeOverAfterBank'];

  //   }

  //   }else{
  //     this.facilityTakeOverAfterBank = this.creditProposal.attributes['facilityTakeOverAfterBank'];

  //   }
  // }
  // Add And Detail
  public openDialog(element: IApplicationProductTakeOver = null): void {
    console.log(element);

    const predicate = { width: '80vw', data: { object: this.creditProposal, creditProposaldata: this.creditProposal } };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['facilityTakeOverAfterBank'] = element;
      predicate.data['view'] = true;
      console.log('element dikirim', element);
    } else {
      predicate.data['facilityTakeOverAfterBank'] = new ApplicationProductTakeOverBank();
    }
    const dialogRef = this.dialog.open(LoanFacilityTakeOverAfterHistoryComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.facilityTakeOverAfterBank = [...this.facilityTakeOverAfterBank, res];
        this.facilityTakeOverAfterBank = [...this.parsedAttr.previousHistory.facilityTakeOverAfterBank, res];
      }
    });
  }
  // Delete Confirmation
  public onDelete(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '40vw',
      data: {
        title: 'Delete Facility Takeover After',
        message: 'Are you sure to delete ' + element.facilityTypeOverBank.label + ' this data?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const dataGridTakeOver = this.parsedAttr.previousHistory.facilityTakeOverAfterBank.filter(({ id }) => id !== element.id);
        // const dataGridTakeOver = this.creditProposal.attributes['facilityTakeOverAfterBank'];
        if (dataGridTakeOver === undefined) {
          return dataGridTakeOver.length;
        }

        this.parsedAttr.previousHistory.facilityTakeOverAfterBank = dataGridTakeOver;
      }
    });
  }

  // public onDelete(element: ICreditProposal) {
  //   const dataGridTakeOver = this.parsedAttr.previousHistory.facilityTakeOverAfterBank.filter(({ id }) => id !== element.id);
  //   // const dataGridTakeOver = this.creditProposal.attributes['facilityTakeOverAfterBank'];
  //   if (dataGridTakeOver === undefined) {
  //     return dataGridTakeOver.length;
  //   }

  //   this.parsedAttr.previousHistory.facilityTakeOverAfterBank = dataGridTakeOver;
  // }
}
