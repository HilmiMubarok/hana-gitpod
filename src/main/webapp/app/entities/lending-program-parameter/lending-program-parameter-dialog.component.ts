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
    private _dialog: MatDialogRef<LendingProgramParameterDialogComponent>
  ) {
    this.lendingProgramParameter = this.data.lendingProgramParameter;
  }

  public save(): void {
    this._dialog.close(this.lendingProgramParameter);
  }
}
