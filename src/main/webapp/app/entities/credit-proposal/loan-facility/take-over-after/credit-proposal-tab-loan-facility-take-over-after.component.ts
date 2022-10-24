import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import lodash from 'lodash';
import { IApplicationProduct } from '../../../application-product/application-product.model';
import { ICreditProposal } from '../../credit-proposal.model';
import { IApplicationProductTakeOverBank } from '../application-product-take-over-after-bank/application-product-take-over-after-bank.model';
import { IApplicationProductTakeOver } from '../application-product-take-over/application-product-take-over.model';
import { CreditProposalTabLoanFacilityTakeOverComponent } from '../take-over/credit-proposal-tab-loan-facility-take-over.component';

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
  // dataTakeOver: any;
  // public facilityTypeOver = [];

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
    for (let i = 0; i < this._creditProposal.attributes['facilityTakeOver'].length; i++) {
      this.dataFacilityType.push({
        id: this._creditProposal.attributes['facilityTakeOver'][i].id,
        label: this._creditProposal.attributes['facilityTakeOver'][i].facilityTypeBank,
      });
    }
  }

  public changeFacility(event) {
    const result = this._creditProposal.attributes['facilityTakeOver'].find(obj => obj.id === event.value.id);
    console.log(result);
    this.facilityTakeOverAfterBank.maturityBankOver = result.maturityBank;
    this.facilityTakeOverAfterBank.initialLimitBankOver = result.initialLimitBank;
    this.facilityTakeOverAfterBank.outstandingBankOver = result.outstandingBank;
  }

  public Onsave(): void {
    this._dialog.close(this.facilityTakeOverAfterBank);
  }

  public print() {
    console.log(this._creditProposal.attributes['facilityTakeOver']);
  }
}
