import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { uiUpdate } from '@syncfusion/ej2-angular-grids';
import { ICreditProposal } from '../../credit-proposal.model';
import { IApplicationProductTakeOverBank } from '../application-product-take-over-after-bank/application-product-take-over-after-bank.model';
import * as uuid from 'uuid';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import lodash, { forEach } from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-take-over-after',
  templateUrl: './credit-proposal-tab-loan-facility-take-over-after.component.html',
  styleUrls: ['../grid/loan.scss'],
})
export class CreditProposalTabLoanFacilityTakeOverAfterComponent implements OnInit {
  public _creditProposal: ICreditProposal;
  public dataFacilityType = [];
  public logoCcy;
  view: boolean;
  facilityTakeOverAfterBank: IApplicationProductTakeOverBank;
  public periodTypeList: any = ['Week', 'Month', 'Year'];

  public lock: boolean;
  public lihat = true;
  public idFacilityTakeOver: any = [];

  parentPath: any;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: ICreditProposal;
      facilityTakeOverAfterBank: IApplicationProductTakeOverBank;
      view: false;
    },
    public router: Router,
    private _dialog: MatDialogRef<CreditProposalTabLoanFacilityTakeOverAfterComponent>
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.creditProposal = this.data.object;
    this.view = this.data.view;
    this.facilityTakeOverAfterBank = this.data.facilityTakeOverAfterBank;
    this.parentPath = this.router.url.split('/')[1];
  }

  ngOnInit(): void {
    this.getFacilityTypeTakeOver();
    this.changeLogo(this.facilityTakeOverAfterBank.currency);
    this.lock = true;
  }

  public selectFacility(): void {
    if (this.creditProposal.products.length > 0) {
      const element = [];
      for (let i = 0; i < this.creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].productTypeId !== '') {
          element.push({
            id: this._creditProposal.products[i].nomorUrutFasilitas,
            label: this._creditProposal.products[i].productTypeId,
          });
        }
        this.dataFacilityType = element.filter(idFacility => !this.idFacilityTakeOver.includes(idFacility.id));
        console.log('facility Type', this.dataFacilityType);
      }
    }
  }

  public getFacilityTypeTakeOver(): void {
    const element: any = [];
    if (
      this.creditProposal.attributes['facilityTakeOverAfterBank'].length > 0 ||
      this.creditProposal.attributes['facilityTakeOverAfterBank'] !== null
    ) {
      for (let i = 0; i < this.creditProposal.attributes['facilityTakeOverAfterBank'].length; i++) {
        element.push(this.creditProposal.attributes['facilityTakeOverAfterBank'][i].facilityTypeOverBank['id']);
        console.log('element', element);
      }

      this.idFacilityTakeOver = element;
      console.log('facility Take Over', this.idFacilityTakeOver);

      this.selectFacility();
    }
  }

  public Onsave(): void {
    this._dialog.close(this.facilityTakeOverAfterBank);
  }
  public buttonSaveDisable() {
    let lock: boolean;
    lock = true;
    if (this.facilityTakeOverAfterBank.facilityTypeOverBank !== undefined) {
      lock = false;
    }
    return lock;
  }
  public changeFacility(event) {
    if (event !== undefined || event !== '') {
      const result = this._creditProposal.products.find(obj => obj.nomorUrutFasilitas === event.value.id);
      console.log('xxxx', result);
      if (result !== undefined) {
        this.lock = false;
        this.facilityTakeOverAfterBank.maturityBankOver = result.initialLimit;
        this.facilityTakeOverAfterBank.initialLimitBankOver = result.maturity;
        this.facilityTakeOverAfterBank.outstandingBankOver = result.outstanding;
        this.facilityTakeOverAfterBank.maturityPeriodType = result.periodType;
        this.facilityTakeOverAfterBank.changes = result.changes;
        this.facilityTakeOverAfterBank.currency = result.currencyId;
        // this.changeLogo(result.attributes.currency);
      } else {
        this.lock = true;
      }
    }
  }

  public changeLogo(data: string) {
    if (data) {
      if (data === 'IDR') {
        this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
      }
      if (data === 'USD') {
        this.logoCcy = {};
      }
    }
  }

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20vw',
      data: {
        title: '',
        message: 'Are you sure to cancel?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
