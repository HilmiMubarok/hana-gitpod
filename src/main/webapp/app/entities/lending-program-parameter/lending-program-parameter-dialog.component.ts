import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STATUS_PARAMETER } from 'app/shared/constants/status.constants';
import { ILendingProgramParameter } from './lending-program-parameter.model';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';

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
    @Inject(MAT_DIALOG_DATA)
    public data: {
      lendingProgramParameter: ILendingProgramParameter;
    },
    private _dialog: MatDialogRef<LendingProgramParameterDialogComponent>,
    protected messageService: MessageService
  ) {
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
}
