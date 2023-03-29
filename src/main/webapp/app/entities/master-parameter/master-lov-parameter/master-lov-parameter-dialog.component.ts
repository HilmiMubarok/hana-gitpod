import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STATUS_LOV_PARAMETER, STATUS_PARAMETER } from 'app/shared/constants/status.constants';
import { IGeneralParameter } from '../general-parameter/general-parameter.model';
import { GeneralParameterService } from '../general-parameter/general-parameter.service';
import { MasterParameterLegalLendingLimitDialogComponent } from '../legal-lending-limit-parameter/legal-lending-limit-parameter-dialog.component';

@Component({
  selector: 'jhi-master-lov-parameter-dialog',
  templateUrl: './master-lov-parameter-dialog.component.html',
})
export class MasterLovParameterDialogComponent implements OnInit {
  public statuses: any;
  public listGeneralLov: any;
  public generalParameter: IGeneralParameter;
  public view: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      generalParameter: IGeneralParameter;
      view: false;
    },
    private _dialog: MatDialogRef<MasterParameterLegalLendingLimitDialogComponent>,
    protected generalParameterService: GeneralParameterService
  ) {
    this.generalParameter = this.data.generalParameter;
    this.statuses = STATUS_LOV_PARAMETER;
    this.view = this.data.view;
  }
  ngOnInit(): void {
    this.getListType();
  }

  public getListType() {
    this.generalParameterService
      .getListTypeGeneral({
        page: 0,
        size: 9999,
        sort: ['desc'],
      })
      .subscribe(res => {
        this.listGeneralLov = res.body;
      });
  }

  public onSelect(element: any) {
    const paramType = element;
    this.generalParameterService.setPrameterType(paramType);
  }

  public onSave(): void {
    this._dialog.close(this.generalParameter);
  }
}
