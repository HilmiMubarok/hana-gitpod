import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOtherCovenant } from '../other-convenant.model';

@Component({
  selector: 'jhi-other-covenant-edit',
  templateUrl: './credit-proposal-other-covenant-edit.component.html',
  styleUrls: ['../other-covenant.css'],
})
export class CreditProposalOtherCovenantEditComponent {
  public otherCovenant: IOtherCovenant;
  public edit: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      otherCovenant: IOtherCovenant;
      edit: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalOtherCovenantEditComponent>
  ) {
    this.edit = this.data.edit;
    this.otherCovenant = this.data.otherCovenant;
  }

  public save(): void {
    this._dialog.close(this.otherCovenant);
  }
}
