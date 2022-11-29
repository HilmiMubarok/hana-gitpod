import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IIndustryLimitExposureParameter } from './industry-limit-exposure-parameter.model';

@Component({
  selector: 'jhi-industry-limit-exposure-parameter-dialog',
  templateUrl: './industry-limit-exposure-parameter-dialog.component.html',
})
export class MasterParameterIndustryLimitExposureDialogComponent {
  public industryLimitExposure;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      industryLimitExposure: IIndustryLimitExposureParameter;
    },
    private _dialog: MatDialogRef<MasterParameterIndustryLimitExposureDialogComponent>
  ) {
    this.industryLimitExposure = this.data.industryLimitExposure;
  }

  public save(): void {
    this._dialog.close(this.industryLimitExposure);
  }
}
