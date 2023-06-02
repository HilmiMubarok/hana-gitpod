import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { uiUpdate } from '@syncfusion/ej2-angular-grids';
import { ICreditProposal } from '../../credit-proposal.model';
import { IApplicationProductTakeOverBank } from 'app/entities/credit-proposal/loan-facility/application-product-take-over-after-bank/application-product-take-over-after-bank.model';
import * as uuid from 'uuid';
import { CreditProposalTabLoanFacilityTakeOverAfterComponent } from '../../loan-facility/take-over-after/credit-proposal-tab-loan-facility-take-over-after.component';

@Component({
  selector: 'jhi-loan-facility-take-over-after-history',
  templateUrl: './credit-proposal-tab-loan-facility-take-over-after.component.html',
  styleUrls: ['../grid/loan.scss'],
})
export class LoanFacilityTakeOverAfterHistoryComponent implements OnInit {
  public _creditProposal: ICreditProposal;
  public dataFacilityType = [];
  public logoCcy;
  view: boolean;
  facilityTakeOverAfterBank: IApplicationProductTakeOverBank;
  public periodTypeList: any = ['Week', 'Month', 'Year'];

  public lock: boolean;
  public lihat = true;
  public idFacilityTakeOver: any = [];

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: ICreditProposal;
      facilityTakeOverAfterBank: IApplicationProductTakeOverBank;
      view: false;
    },
    private _dialog: MatDialogRef<CreditProposalTabLoanFacilityTakeOverAfterComponent>
  ) {
    this.creditProposal = this.data.object;
    this.view = this.data.view;
    this.facilityTakeOverAfterBank = this.data.facilityTakeOverAfterBank;
  }

  ngOnInit(): void {
    this.getFacilityTypeTakeOver();

    // Code Lama
    // if (this.creditProposal.products.length > 0) {
    //   for (let i = 0; i < this.creditProposal.products.length; i++) {
    //     if (this._creditProposal.products[i].attributes['facilityType'] !== '') {
    //       this.dataFacilityType.push({
    //         id: this._creditProposal.products[i].attributes['nomorUrutFasilitas'],
    //         label: this._creditProposal.products[i].attributes['facilityType'],
    //       });
    //     }
    //   }
    // }

    // this.changeLogo(this.facilityTakeOverAfterBank.currency);
    // this.changeLogo(this.)

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
      }

      this.idFacilityTakeOver = element;

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

  // Code Lama
  // public changeFacility(event) {
  //   if (event !== undefined || event !== '') {
  //     const result = this._creditProposal.products.find(obj => obj.attributes['nomorUrutFasilitas'] === event.value.id);
  //     if (result !== undefined) {
  //       this.lock = false;
  //       this.facilityTakeOverAfterBank.maturityBankOver = result.attributes['initialLimit'];
  //       this.facilityTakeOverAfterBank.initialLimitBankOver = result.attributes['maturity'];
  //       this.facilityTakeOverAfterBank.outstandingBankOver = result.attributes['outstanding'];
  //       this.facilityTakeOverAfterBank.maturityPeriodType = result.attributes['maturityPeriodType'];
  //       this.facilityTakeOverAfterBank.changes = result.attributes['changes'];
  //       this.facilityTakeOverAfterBank.currency = result.attributes['currency'];
  //       // this.changeLogo(result.attributes.currency);
  //     } else {
  //       this.lock = true;
  //     }
  //   }
  // }

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

  // public changeLogo(data: string) {
  //   if (data) {
  //     if (data === 'USD') {
  //       this.logoCcy = {};
  //     }
  //     if (data === 'IDR') {
  //       this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
  //     }
  //   }
  // }
}
