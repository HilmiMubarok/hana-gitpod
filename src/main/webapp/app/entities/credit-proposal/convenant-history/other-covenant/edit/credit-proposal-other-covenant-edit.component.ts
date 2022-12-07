import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IOtherCovenant } from '../other-convenant.model';

@Component({
  selector: 'jhi-other-covenant-edit-history',
  templateUrl: './credit-proposal-other-covenant-edit.component.html',
  styleUrls: ['../other-covenant.css'],
})
export class CreditProposalOtherCovenantEditHistoryComponent {
  public otherCovenant: IOtherCovenant;
  public edit: boolean;
  item: ICreditProposal;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      otherCovenant: IOtherCovenant;
      edit: boolean;
      item: ICreditProposal;
    },
    private _dialog: MatDialogRef<CreditProposalOtherCovenantEditHistoryComponent>
  ) {
    this.edit = this.data.edit;
    this.otherCovenant = this.data.otherCovenant;
    this.item = this.data.item;
  }

  public save(): void {
    this._dialog.close(this.otherCovenant);
  }
}
