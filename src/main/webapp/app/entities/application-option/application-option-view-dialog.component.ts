import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApplicationOption } from './application-option.model';
import lodash from 'lodash';

@Component({
  selector: 'jhi-application-option-view-dialog',
  templateUrl: './application-option-view-dialog.component.html',
})
export class ApplicationOptionViewDialogComponent {
  public applicationOption: IApplicationOption;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      applicationOption: IApplicationOption;
    },
    private _dialog: MatDialogRef<ApplicationOptionViewDialogComponent>
  ) {
    this.applicationOption = lodash.cloneDeep(this.data.applicationOption);
  }

  public save(): void {
    this._dialog.close(this.applicationOption);
  }
}
