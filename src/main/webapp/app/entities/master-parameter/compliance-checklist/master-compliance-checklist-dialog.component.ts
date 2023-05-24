import { Component, Inject, OnInit } from '@angular/core';
import { IMasterComplianceChecklist } from './master-compliance-checklist.model';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { MasterComplianceChecklistService } from './master-compliance-checklist.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-master-compliance-checklist-dialog',
  templateUrl: './master-compliance-checklist-dialog.component.html',
})
export class MasterComplianceChecklistDialogComponent implements OnInit {
  public masterComplianceCheklist: IMasterComplianceChecklist;

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
      masterComplianceCheklist: IMasterComplianceChecklist;
    },
    private _dialog: MatDialogRef<MasterComplianceChecklistDialogComponent>,
    protected masterComplianceChecklistService: MasterComplianceChecklistService,
    protected messageService: MessageService
  ) {
    _dialog.disableClose = true;
    this.masterComplianceCheklist = this.data.masterComplianceCheklist;
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public onSave(): void {
    this.validate().then(() => this.save());
  }

  public save() {
    if (this.masterComplianceCheklist.id) {
      // update
      this.masterComplianceChecklistService.update(this.masterComplianceCheklist).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.masterComplianceChecklistService.create(this.masterComplianceCheklist).subscribe(res => {
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
      regulationName: true,
      statusDescription: true,
    };

    if (!this.masterComplianceCheklist.regulationName) {
      this._showNotification('error', 'Masukkan Regulation Name terlebih dahulu');
      mustValidate.regulationName = false;
    }

    if (!this.masterComplianceCheklist.statusDescription) {
      this._showNotification('error', 'Masukkan Status terlebih dahulu');
      mustValidate.statusDescription = false;
    }

    return this._validateProcess(mustValidate);
  }

  public validateMasterCompliance(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Master Product Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateMasterCompliance().then(() => resolve(true));
    });
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
