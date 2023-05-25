import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IOtherCovenant } from '../other-convenant.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-other-covenant-edit',
  templateUrl: './credit-proposal-other-covenant-edit.component.html',
  styleUrls: ['../other-covenant.css'],
})
export class CreditProposalOtherCovenantEditComponent {
  public otherCovenant: IOtherCovenant;
  public edit: boolean;
  item: ICreditProposal;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      otherCovenant: IOtherCovenant;
      edit: boolean;
      item: ICreditProposal;
    },
    private _dialog: MatDialogRef<CreditProposalOtherCovenantEditComponent>
  ) {
    _dialog.disableClose = true;
    this.edit = this.data.edit;
    this.otherCovenant = this.data.otherCovenant;
    this.item = this.data.item;
  }

  public save(): void {
    this._dialog.close(this.otherCovenant);
  }
  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20vw',
      data: {
        title: '',
        message: 'Are you sure to cancel?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
