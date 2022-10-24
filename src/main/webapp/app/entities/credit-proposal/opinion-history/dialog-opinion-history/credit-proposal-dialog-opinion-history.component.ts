import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-credit-proposal-dialog-opinion-history',
  templateUrl: './credit-proposal-dialog-opinion-history.component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css']
})
export class CreditProposalDialogOpinionHistoryComponent {
  public notes: any;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataNotes: {
      notes: any;
    },
    _dialog: MatDialogRef<CreditProposalDialogOpinionHistoryComponent>
  ){ this.notes = this.dataNotes.notes; }
}