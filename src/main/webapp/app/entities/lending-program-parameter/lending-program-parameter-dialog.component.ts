import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ILendingProgramParameter } from './lending-program-parameter.model';

@Component({
  selector: 'jhi-lending-program-parameter-dialog',
  templateUrl: './lending-program-parameter-dialog.component.html',
})
export class LendingProgramParameterDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      lendingProgramParameter: ILendingProgramParameter;
    },
    private _dialog: MatDialogRef<LendingProgramParameterDialogComponent>
  ) {}
}
