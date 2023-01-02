import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { uiUpdate } from '@syncfusion/ej2-angular-grids';
import { ICreditProposal } from '../../credit-proposal.model';
import { IApplicationProductTakeOverBank } from '../application-product-take-over-after-bank/application-product-take-over-after-bank.model';
import * as uuid from 'uuid';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-take-over-after',
  templateUrl: './credit-proposal-tab-loan-facility-take-over-after.component.html',
  styleUrls: ['../grid/loan.scss'],
})
export class CreditProposalTabLoanFacilityTakeOverAfterComponent implements OnInit {
  public _creditProposal: ICreditProposal;
  public dataFacilityType = [];
  view: boolean;
  facilityTakeOverAfterBank: IApplicationProductTakeOverBank;
  public periodTypeList: any = ['Week', 'Month', 'Year'];

  public lock: boolean;
  public lihat = true;
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
    if (this.creditProposal.products.length > 0) {
      for (let i = 0; i < this.creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].attributes['facilityType'] !== '') {
          this.dataFacilityType.push({
            id: this._creditProposal.products[i].attributes['nomorUrutFasilitas'],
            label: this._creditProposal.products[i].attributes['facilityType'],
          });
        }
      }
    }

    this.lock = true;
    console.log(this.dataFacilityType);
    console.log(this.facilityTakeOverAfterBank.facilityTypeOverBank);
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
      const result = this._creditProposal.products.find(obj => obj.attributes['nomorUrutFasilitas'] === event.value.id);
      if (result !== undefined) {
        this.lock = false;
        this.facilityTakeOverAfterBank.maturityBankOver = result.attributes['initialLimit'];
        this.facilityTakeOverAfterBank.initialLimitBankOver = result.attributes['maturity'];
        this.facilityTakeOverAfterBank.outstandingBankOver = result.attributes['outstanding'];
        this.facilityTakeOverAfterBank.maturityPeriodType = result.attributes['maturityPeriodType'];
      } else {
        this.lock = true;
      }
    }
    console.log('inievent', event);
  }

  print() {
    console.log(this.creditProposal.products);
    console.log(this.facilityTakeOverAfterBank);
    console.log('maturity ', this.facilityTakeOverAfterBank.maturityPeriodType);
  }
}
