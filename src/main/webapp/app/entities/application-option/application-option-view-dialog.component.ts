import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { IApplicationOption } from './application-option.model';
import lodash from 'lodash';

@Component({
  selector: 'jhi-application-option-view-dialog',
  templateUrl: './application-option-view-dialog.component.html',
  providers: [
	{provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ] 
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
