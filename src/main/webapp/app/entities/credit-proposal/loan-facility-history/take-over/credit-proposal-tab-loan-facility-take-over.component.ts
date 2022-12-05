import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import lodash from 'lodash';
import { IApplicationProduct } from '../../../application-product/application-product.model';
import { ICreditProposal } from '../../credit-proposal.model';
import { IApplicationProductTakeOver } from 'app/entities/credit-proposal/loan-facility/application-product-take-over/application-product-take-over.model';

@Component({
  selector: 'jhi-loan-facility-take-over-history',
  templateUrl: './credit-proposal-tab-loan-facility-take-over.component.html',
  styleUrls: ['../grid/loan.scss'],
})
export class LoanFacilityTakeOverHistoryComponent {
  public _creditProposal: ICreditProposal;
  view: boolean;
  facilityTakeOver: IApplicationProductTakeOver;

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
      facilityTakeOver: IApplicationProductTakeOver;
      view: boolean;
    },
    private _dialog: MatDialogRef<LoanFacilityTakeOverHistoryComponent>
  ) {
    this.creditProposal = this.data.object;
    this.view = this.data.view;
    this.facilityTakeOver = this.data.facilityTakeOver;
  }

  public Onsave(): void {
    this._dialog.close(this.facilityTakeOver);
  }
}
