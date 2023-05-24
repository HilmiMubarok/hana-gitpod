import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STATUS_PARAMETER } from 'app/shared/constants/status.constants';
import { IIndustryLimitExposureParameter } from './industry-limit-exposure-parameter.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-industry-limit-exposure-parameter-dialog',
  templateUrl: './industry-limit-exposure-parameter-dialog.component.html',
})
export class MasterParameterIndustryLimitExposureDialogComponent {
  public industryLimitExposure: IIndustryLimitExposureParameter;
  public statuses: any;
  public statusValue = [
    {
      statusId: 'ACTIVE',
      statusDescription: 'Active',
      statusCode: 'ACTIVE',
    },
    {
      statusId: 'NON_ACTIVE',
      statusDescription: 'Non Active',
      statusCode: 'NON_ACTIVE',
    },
  ];
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      industryLimitExposure: IIndustryLimitExposureParameter;
    },
    private _dialog: MatDialogRef<MasterParameterIndustryLimitExposureDialogComponent>
  ) {
    _dialog.disableClose = true;
    this.industryLimitExposure = this.data.industryLimitExposure;
    this.statuses = STATUS_PARAMETER;
  }

  public save(): void {
    this._dialog.close(this.industryLimitExposure);
  }

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20vw',
      data: {
        title: '',
        message: 'Are you sure to cancel?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
