import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { IMasterCompanyType } from './master-company-type.model';
import { MasterCompanyTypeService } from './master-company-type.service';

@Component({
  selector: 'jhi-credit-agreement-clausal-dialog',
  templateUrl: './master-company-type-dialog.component.html',
  styleUrls: ['./master-company-type.css'],
})
export class MasterCompanyTypeDialogComponent implements OnInit {
  public masterCompanyType: IMasterCompanyType;
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
    protected messageService: MessageService,
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      masterCompanyType: IMasterCompanyType;
    },
    private _dialog: MatDialogRef<MasterCompanyTypeDialogComponent>,
    protected masterCompanyTypeService: MasterCompanyTypeService
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.masterCompanyType = this.data.masterCompanyType;
  }
  ngOnInit(): void {
    console.log('xxx');
  }

  public onSave(): void {
    this.validate().then(() => this.save());
  }

  public save() {
    if (this.masterCompanyType.id) {
      // update
      this.masterCompanyTypeService.update(this.masterCompanyType).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.masterCompanyTypeService.create(this.masterCompanyType).subscribe(res => {
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

    if (!this.masterCompanyType.code) {
      this._showNotification('error', 'Masukkan Code terlebih dahulu');
      mustValidate.code = false;
    }

    if (!this.masterCompanyType.name) {
      this._showNotification('error', 'Masukkan Name terlebih dahulu');
      mustValidate.value = false;
    }

    if (!this.masterCompanyType.abbreviation) {
      this._showNotification('error', 'Masukkan Abbreviation terlebih dahulu');
      mustValidate.value = false;
    }

    return this._validateProcess(mustValidate);
  }

  public validateMasterCompanyType(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Master Company Type Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateMasterCompanyType().then(() => resolve(true));
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
