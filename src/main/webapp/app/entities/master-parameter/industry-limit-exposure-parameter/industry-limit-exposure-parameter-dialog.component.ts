import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STATUS_PARAMETER } from 'app/shared/constants/status.constants';
import { IIndustryLimitExposureParameter } from './industry-limit-exposure-parameter.model';

@Component({
  selector: 'jhi-industry-limit-exposure-parameter-dialog',
  templateUrl: './industry-limit-exposure-parameter-dialog.component.html',
})
export class MasterParameterIndustryLimitExposureDialogComponent {
  public industryLimitExposure: IIndustryLimitExposureParameter;
  public statuses: any;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      industryLimitExposure: IIndustryLimitExposureParameter;
    },
    private _dialog: MatDialogRef<MasterParameterIndustryLimitExposureDialogComponent>
  ) {
    this.industryLimitExposure = this.data.industryLimitExposure;
    this.statuses = STATUS_PARAMETER;
  }

  public save(): void {
    this._dialog.close(this.industryLimitExposure);
  }
}
