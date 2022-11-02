import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOtherCovenant } from '../other-convenant.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

@Component({
  selector: 'jhi-other-covenant-dialog',
  templateUrl: './credit-proposal-other-covenant-dialog.component.html',
  styleUrls: ['../other-covenant.css'],
})
export class CreditProposalOtherCovenantDialogComponent {
  public otherCovenant: IOtherCovenant;
  public view: boolean;

  item: ICreditProposal;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      otherCovenant: IOtherCovenant;
      item: ICreditProposal;
      view: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalOtherCovenantDialogComponent>
  ) {
    this.view = this.data.view;
    this.otherCovenant = this.data.otherCovenant;
    this.item = this.data.item;
  }

  public save(): void {
    this._dialog.close(this.otherCovenant);
  }
}
