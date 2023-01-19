import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { IApplicationOption } from './application-option.model';
import * as _moment from 'moment';


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
  public moment: any;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      applicationOption: IApplicationOption;
    },
    private _dialog: MatDialogRef<ApplicationOptionViewDialogComponent>
  ) {
	this.moment = _moment;
    this.applicationOption = lodash.cloneDeep(this.data.applicationOption);
  }

  public updateDate(): void {
	this.applicationOption.value = this.moment(this.applicationOption.value);
  }

  public save(): void {
    this._dialog.close(this.applicationOption);
  }
}
