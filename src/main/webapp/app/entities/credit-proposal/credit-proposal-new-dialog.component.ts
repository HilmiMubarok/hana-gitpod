import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPartyCif } from '../party-cif/party-cif.model';

@Component({
  selector: 'jhi-credit-proposal-new-dialog',
  templateUrl: './credit-proposal-new-dialog.component.html',
})
export class CreditProposalNewDialogComponent {
  public partyCif: IPartyCif;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      partyCif: IPartyCif;
    },
    private _dialog: MatDialogRef<CreditProposalNewDialogComponent>
  ) {
    this.partyCif = this.data.partyCif;
  }

  public submit(): void {
    this._dialog.close(this.partyCif);
  }
}
