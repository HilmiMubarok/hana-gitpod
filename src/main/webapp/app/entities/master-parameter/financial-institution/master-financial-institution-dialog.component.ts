import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterFinancialInstitutionService } from './master-financial-institution.service';
import { IMasterFinancialInstitution } from './master-financial-institution.model';

@Component({
  selector: 'jhi-master-financial-institution-dialog',
  templateUrl: './master-financial-institution-dialog.component.html',
  styleUrls: ['./master-financial-institution.css'],
})
export class MasterFinancialInstitutionDialogComponent implements OnInit {
  public masterFinancialInstitution: IMasterFinancialInstitution;
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
      masterFinancialInstitution: IMasterFinancialInstitution;
    },
    private _dialog: MatDialogRef<MasterFinancialInstitutionDialogComponent>,
    protected masterFinancialInstitutionService: MasterFinancialInstitutionService
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.masterFinancialInstitution = this.data.masterFinancialInstitution;
  }
  ngOnInit(): void {
    console.log('xxx');
  }

  public onSave(): void {
    this.validate().then(() => this.save());
  }

  public save() {
    if (this.masterFinancialInstitution.id) {
      // update
      this.masterFinancialInstitutionService.update(this.masterFinancialInstitution).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.masterFinancialInstitutionService.create(this.masterFinancialInstitution).subscribe(res => {
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

    if (!this.masterFinancialInstitution.code) {
      this._showNotification('error', 'Masukkan Code terlebih dahulu');
      mustValidate.code = false;
    }

    if (!this.masterFinancialInstitution.name) {
      this._showNotification('error', 'Masukkan Name terlebih dahulu');
      mustValidate.value = false;
    }

    if (!this.masterFinancialInstitution.description) {
      this._showNotification('error', 'Masukkan Description terlebih dahulu');
      mustValidate.value = false;
    }

    return this._validateProcess(mustValidate);
  }

  public validateMasterFinancialInstitution(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Master Financial Institution Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateMasterFinancialInstitution().then(() => resolve(true));
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
