import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOtherCovenant } from '../other-convenant.model';

@Component({
  selector: 'jhi-other-covenant-dialog',
  templateUrl: './credit-proposal-other-covenant-dialog.component.html',
  styleUrls: ['../other-covenant.css'],
})
export class CreditProposalOtherCovenantDialogComponent {
  public otherCovenant: IOtherCovenant;
  public view: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      otherCovenant: IOtherCovenant;
      view: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalOtherCovenantDialogComponent>
  ) {
    this.view = this.data.view;
    this.otherCovenant = this.data.otherCovenant;
  }

  public save(): void {
    this._dialog.close(this.otherCovenant);
  }
}
