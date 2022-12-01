import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STATUS_PARAMETER } from 'app/shared/constants/status.constants';
import { IGeneralParameter } from '../general-parameter/general-parameter.model';

@Component({
  selector: 'jhi-legal-lending-limit-parameter-dialog',
  templateUrl: './legal-lending-limit-parameter-dialog.component.html',
})
export class MasterParameterLegalLendingLimitDialogComponent {
  public statuses: any;
  public generalParameter: IGeneralParameter;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      generalParameter: IGeneralParameter;
    },
    private _dialog: MatDialogRef<MasterParameterLegalLendingLimitDialogComponent>
  ) {
    this.generalParameter = this.data.generalParameter;
    this.statuses = STATUS_PARAMETER;
  }

  public save(): void {
    this._dialog.close(this.generalParameter);
  }
}
