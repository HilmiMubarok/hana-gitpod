import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { MessageService } from 'primeng/api';
import { MasterCompanyTypeDialogComponent } from '../master-company-type/master-company-type-dialog.component';
import { IMasterCompanyType } from '../master-company-type/master-company-type.model';
import { MasterCompanyTypeService } from '../master-company-type/master-company-type.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'jhi-master-document-term-dialog',
  templateUrl: './master-document-term-dialog.component.html',
  styleUrls: ['../master-company-type/master-company-type.css'],
})
export class MasterDocumentTermDialogComponent implements OnInit {
  public masterCompanyType: IMasterCompanyType;

  constructor(
    private fb: FormBuilder,
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
    this.masterDocumentTerm = this.fb.group({
      reminderType: [this.data.masterCompanyType.code],
      dpd: [this.data.masterCompanyType.abbreviation],
      schedulerEmail: [this.data.masterCompanyType.name],
      schedulerType: ['Inan'],
      schedulerDate: [this.data.masterCompanyType.createdDate],
      status: ['Status1'],
    });
  }

  masterDocumentTerm: FormGroup;

  ngOnInit(): void {
    console.log('xxx');
  }

  public onSave(): void {
    console.log(this.masterDocumentTerm.getRawValue());
    // this.validate().then(() => this.save());
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
