import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ICollateralParameter } from './collateral-parameter.model';
import { MessageService } from 'primeng/api';
import { CollateralParameterService } from './collateral-parameter.service';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-collateral-parameter-dialog',
  templateUrl: './collateral-parameter-dialog.component.html',
  styleUrls: ['./master-collateral.css'],
})
export class CollateralParameterDialogComponent implements OnInit {
  public listCollateralType: any;
  public collateralParameter: ICollateralParameter;
  public view: boolean;
  public mode: string;
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
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralParameter: ICollateralParameter;
      view: false;
      mode: string;
    },
    private _dialog: MatDialogRef<CollateralParameterDialogComponent>,
    protected collateralParameterService: CollateralParameterService,
    protected collateralTypeService: CollateralTypeService,
    protected messageService: MessageService
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.collateralParameter = this.data.collateralParameter;
    this.view = this.data.view;
    this.mode = this.data.mode;
  }
  ngOnInit(): void {
    this.getCollateralType();
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
  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
