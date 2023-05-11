import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STATUS_LOV_PARAMETER, STATUS_PARAMETER } from 'app/shared/constants/status.constants';
import { IGeneralParameter } from '../general-parameter/general-parameter.model';
import { GeneralParameterService } from '../general-parameter/general-parameter.service';
import { MasterParameterLegalLendingLimitDialogComponent } from '../legal-lending-limit-parameter/legal-lending-limit-parameter-dialog.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-master-lov-parameter-dialog',
  templateUrl: './master-lov-parameter-dialog.component.html',
})
export class MasterLovParameterDialogComponent implements OnInit {
  public statuses: any;
  public listGeneralLov: any;
  public generalParameter: IGeneralParameter;
  public view: boolean;
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
    @Inject(MAT_DIALOG_DATA)
    public data: {
      generalParameter: IGeneralParameter;
      view: false;
    },
    protected messageService: MessageService,

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
    this.validate().then(() => this.save());
    // this._dialog.close(this.generalParameter);
  }

  public save() {
    if (this.generalParameter.id) {
      // update
      this.generalParameterService.update(this.generalParameter).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.generalParameterService.create(this.generalParameter).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(res.body);
      });
    }
  }

  private _validateProcess(toValidate: object) {
    let isAllTrue = true;
    for (const key in toValidate) {
      if (Object.prototype.hasOwnProperty.call(toValidate, key)) {
        if (toValidate[key] === false) {
          isAllTrue = false;
          break;
        }
      }
    }

    return isAllTrue;
  }

  private _showNotification(severity: string, message: string): void {
    const severityCaptitalized = severity.charAt(0).toUpperCase() + severity.slice(1);
    this.messageService.add({ severity, summary: severityCaptitalized, detail: message, life: 3000 });
  }

  public checkMustValidated() {
    const mustValidate = {
      code: true,
      value: true,
    };

    if (!this.generalParameter.code) {
      this._showNotification('error', 'Masukkan Code terlebih dahulu');
      mustValidate.code = false;
    }

    if (!this.generalParameter.value) {
      this._showNotification('error', 'Masukkan Description terlebih dahulu');
      mustValidate.value = false;
    }

    return this._validateProcess(mustValidate);
  }

  public validateMasterLov(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Master Product Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateMasterLov().then(() => resolve(true));
    });
  }
}
