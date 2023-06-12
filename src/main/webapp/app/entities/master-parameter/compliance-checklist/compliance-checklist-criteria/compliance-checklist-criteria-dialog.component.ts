import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IComplianceChecklistCriteria } from './compliance-checklist-criteria.model';
import { IMasterComplianceChecklist } from '../master-compliance-checklist.model';
import { ComplianceChecklistCriteriaService } from './compliance-checklist-criteria.service';
import { MasterComplianceChecklistService } from '../master-compliance-checklist.service';
import { MessageService } from 'primeng/api';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-compliance-checklist-criteria-dialog-add',
  templateUrl: './compliance-checklist-criteria-dialog.component.html',
})
export class ComplianceChecklistCriteriaDialogAddComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  public complianceChecklistCriteria: IComplianceChecklistCriteria;
  public dataRegulationCompliance: IMasterComplianceChecklist;
  public view: boolean;
  public mode: string;

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
      complianceChecklistCriteria: IComplianceChecklistCriteria;
      dataRegulationCompliance: IMasterComplianceChecklist;
      view: false;
      mode: string;
    },
    private _dialog: MatDialogRef<ComplianceChecklistCriteriaDialogAddComponent>,
    protected masterComplianceChecklistService: MasterComplianceChecklistService,
    protected complianceChecklistCriteriaService: ComplianceChecklistCriteriaService,
    protected messageService: MessageService
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.complianceChecklistCriteria = this.data.complianceChecklistCriteria;
    this.dataRegulationCompliance = this.data.dataRegulationCompliance;
    this.view = this.data.view;
    this.mode = this.data.mode;
  }

  ngOnInit(): void {
    if (this.mode !== 'edit') {
      this.getComplianceCriteria();
    }
  }

  // Untuk Mendapatkan Item No Selanjutnya Ketika Add Criteria

  public getComplianceCriteria() {
    this.complianceChecklistCriteriaService
      .queryFilterBy({
        page: 0,
        size: 9999,
        sort: ['id', 'desc'],
      })
      .subscribe(res => {
        if (res.body.length > 0) {
          const lastItem = res.body[res.body.length - 1];
          this.complianceChecklistCriteria.itemNo = lastItem.itemNo + 1;
          this.complianceChecklistCriteria.regulationId = this.dataRegulationCompliance.id;

          console.log('ID terakhir:', this.complianceChecklistCriteria.itemNo);
        }
      });
  }

  public save() {
    // create
    if (this.complianceChecklistCriteria.id) {
      // update
      this.complianceChecklistCriteriaService.update(this.complianceChecklistCriteria).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.complianceChecklistCriteriaService.create(this.complianceChecklistCriteria).subscribe(res => {
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
      criteria: true,
      statusDescription: true,
    };

    if (!this.complianceChecklistCriteria.criteria) {
      this._showNotification('error', 'Masukkan Criteria terlebih dahulu');
      mustValidate.criteria = false;
    }

    if (!this.complianceChecklistCriteria.statusDescription) {
      this._showNotification('error', 'Masukkan Status terlebih dahulu');
      mustValidate.statusDescription = false;
    }

    return this._validateProcess(mustValidate);
  }

  public validateMasterComplianceCriteria(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Master Product Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateMasterComplianceCriteria().then(() => resolve(true));
    });
  }

  public onSave(): void {
    this.validate().then(() => this.save());
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
