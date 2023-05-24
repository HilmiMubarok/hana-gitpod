import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STATUS_PARAMETER } from 'app/shared/constants/status.constants';
import { IGeneralParameter } from '../general-parameter/general-parameter.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-legal-lending-limit-parameter-dialog',
  templateUrl: './legal-lending-limit-parameter-dialog.component.html',
})
export class MasterParameterLegalLendingLimitDialogComponent {
  public statuses: any;
  public generalParameter: IGeneralParameter;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      generalParameter: IGeneralParameter;
    },
    private _dialog: MatDialogRef<MasterParameterLegalLendingLimitDialogComponent>
  ) {
    _dialog.disableClose = true;
    this.generalParameter = this.data.generalParameter;
    this.statuses = STATUS_PARAMETER;
  }

  public save(): void {
    this._dialog.close(this.generalParameter);
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
