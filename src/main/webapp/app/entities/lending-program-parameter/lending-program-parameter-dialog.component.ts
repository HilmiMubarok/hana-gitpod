import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { STATUS_PARAMETER } from 'app/shared/constants/status.constants';
import { ILendingProgramParameter } from './lending-program-parameter.model';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-lending-program-parameter-dialog',
  templateUrl: './lending-program-parameter-dialog.component.html',
})
export class LendingProgramParameterDialogComponent {
  public lendingProgramParameter: ILendingProgramParameter;
  public statusValue = [
    {
      id: 'ACTIVE',
      description: 'Active',
    },
    {
      id: 'NON_ACTIVE',
      description: 'Non Active',
    },
  ];

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      lendingProgramParameter: ILendingProgramParameter;
    },
    private _dialog: MatDialogRef<LendingProgramParameterDialogComponent>,
    protected messageService: MessageService
  ) {
    _dialog.disableClose = true;
    this.lendingProgramParameter = this.data.lendingProgramParameter;
  }

  public save(): void {
    if (this.lendingProgramParameter.fromDate > this.lendingProgramParameter.thruDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot Start Date Larger Than End Date',
      });
    } else {
      this._dialog.close(this.lendingProgramParameter);
    }
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
