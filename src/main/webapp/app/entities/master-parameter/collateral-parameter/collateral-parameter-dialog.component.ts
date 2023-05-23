import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralParameter } from './collateral-parameter.model';
import { MessageService } from 'primeng/api';
import { CollateralParameterService } from './collateral-parameter.service';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { MatSelectChange } from '@angular/material/select';
import lodash from 'lodash';
import { STATUS_LOV_PARAMETER } from 'app/shared/constants/status.constants';

@Component({
  selector: 'jhi-collateral-parameter-dialog',
  templateUrl: './collateral-parameter-dialog.component.html',
})
export class CollateralParameterDialogComponent implements OnInit {
  public listCollateralType: any;
  public collateralParameter: ICollateralParameter;
  public view: boolean;
  public collateralCode: ICollateralParameter[];
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
      collateralParameter: ICollateralParameter;
      view: false;
    },
    private _dialog: MatDialogRef<CollateralParameterDialogComponent>,
    protected collateralParameterService: CollateralParameterService,
    protected collateralTypeService: CollateralTypeService,
    protected messageService: MessageService
  ) {
    this.collateralParameter = this.data.collateralParameter;
    this.view = this.data.view;
  }
  ngOnInit(): void {
    this.getCollateralType();
    // this.getchangeTypeCollateral();
  }
  public getCollateralType() {
    this.collateralTypeService.query().subscribe(res => {
      this.listCollateralType = res.body.filter(obj => obj.id !== 'CASH');
    });
  }

  public onSave(): void {
    this.validate().then(() => this.save());
  }

  public save() {
    if (this.collateralParameter.id) {
      // update
      this.collateralParameterService.update(this.collateralParameter).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.collateralParameterService.create(this.collateralParameter).subscribe(res => {
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
      collateralTypeCode: true,
      collateralTypeCodeDescription: true,
      collateralDetailTypeCode: true,
      collateralDetailTypeDescription: true,
    };

    if (!this.collateralParameter.collateralTypeCode) {
      this._showNotification('error', 'Masukkan Collateral Code terlebih dahulu');
      mustValidate.collateralTypeCode = false;
    }

    if (!this.collateralParameter.collateralTypeCodeDescription) {
      this._showNotification('error', 'Masukkan Collateral Code Description terlebih dahulu');
      mustValidate.collateralTypeCodeDescription = false;
    }

    if (!this.collateralParameter.collateralDetailTypeCode) {
      this._showNotification('error', 'Masukkan Collateral Detail Code terlebih dahulu');
      mustValidate.collateralDetailTypeCode = false;
    }

    if (!this.collateralParameter.collateralDetailTypeDescription) {
      this._showNotification('error', 'Masukkan Collateral Detail Code terlebih dahulu');
      mustValidate.collateralDetailTypeDescription = false;
    }

    // if (!this.generalParameter.value) {
    //   this._showNotification('error', 'Masukkan Description terlebih dahulu');
    //   mustValidate.value = false;
    // }

    return this._validateProcess(mustValidate);
  }

  public validateMasterCollateral(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Master Product Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateMasterCollateral().then(() => resolve(true));
    });
  }
}
