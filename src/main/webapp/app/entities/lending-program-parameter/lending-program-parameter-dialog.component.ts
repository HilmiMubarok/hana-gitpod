import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STATUS_PARAMETER } from 'app/shared/constants/status.constants';
import { ILendingProgramParameter } from './lending-program-parameter.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'jhi-lending-program-parameter-dialog',
  templateUrl: './lending-program-parameter-dialog.component.html',
})
export class LendingProgramParameterDialogComponent {
  public lendingProgramParameter: ILendingProgramParameter;
  public statuses: any;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      lendingProgramParameter: ILendingProgramParameter;
    },
    private _dialog: MatDialogRef<LendingProgramParameterDialogComponent>
  ) {
    this.lendingProgramParameter = this.data.lendingProgramParameter;
    this.statuses = STATUS_PARAMETER;
  }

  public save(): void {
    this._dialog.close(this.lendingProgramParameter);
  }
}
