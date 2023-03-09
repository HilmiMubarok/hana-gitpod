import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STATUS_PARAMETER } from 'app/shared/constants/status.constants';
import { IGeneralParameter } from '../general-parameter/general-parameter.model';
import { GeneralParameterService } from '../general-parameter/general-parameter.service';
import { MasterParameterLegalLendingLimitDialogComponent } from '../legal-lending-limit-parameter/legal-lending-limit-parameter-dialog.component';

@Component({
  selector: 'jhi-master-lov-parameter-dialog',
  templateUrl: './master-lov-parameter-dialog.component.html',
})
export class MasterLovParameterDialogComponent {
  public statuses: any;
  public listGeneralLov;
  public generalParameter: IGeneralParameter;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      generalParameter: IGeneralParameter;
    },
    private _dialog: MatDialogRef<MasterParameterLegalLendingLimitDialogComponent>,
    protected generalParameterService: GeneralParameterService
  ) {
    this.generalParameter = this.data.generalParameter;
    this.statuses = STATUS_PARAMETER;
  }

  public save(): void {
    this._dialog.close(this.generalParameter);
  }

  public getListType() {
    this.generalParameterService.getListTypeGeneral().subscribe(res => {
      this.listGeneralLov = res.body;
    });
  }

  public onSelect(element: any) {
    const paramType = element;
    this.generalParameterService.setPrameterType(paramType);
  }
}
