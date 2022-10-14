import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocumentChecklistDebtorData, DocumentChecklistDebtorData } from './debtor-data-document-checklist';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { StorageService } from 'app/entities/storage/storage.service';
import moment from 'moment';

import { AccountService } from 'app/core/auth/account.service';
import { MessageService } from 'primeng/api';

export const MY_DATE_FORMAT = {
  parse: { dateInput: { month: 'numeric', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'numeric', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'numeric' },
  },
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'yyy/MM/dd', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'jhi-document-checklist-dialog-party-cif',
  templateUrl: './debtor-data-document-checklis-dialog.component.html',
  //   styleUrls: ['../css/credit-proposal-basic-information.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DebtorDataDocumentChecklistDialogComponent {
  public documentChecklist: IDocumentChecklistDebtorData;

  public file: File;
  public files: any;
  public key: string;
  public view: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      documentChecklist: any;
      view: boolean;
      files: any;
      bucket: string;
      partyId: number;
    },
    private _dialog: MatDialogRef<DebtorDataDocumentChecklistDialogComponent>,
    private storageService: StorageService,
    private messageService: MessageService,
    private accountService: AccountService
  ) {
    this.view = this.data.view;
    this.view ? (this.documentChecklist = this.data.documentChecklist.tags) : (this.documentChecklist = new DocumentChecklistDebtorData());
    this.view ? (this.file = this.data.documentChecklist) : (this.file = null);
    this.view ? (this.key = this.data.documentChecklist.key) : (this.key = null);
    this.files = this.data.files;
  }

  public save(): void {
    const currentDate = moment().format('YYYYMMDDHHMMSSMS');
    const metaData = {
      objectName: null,
      entityId: null,
      documentType: null,
      document: null,
      category: null,
      dueDate: null,
      status: null,
      remarks: null,
      createdDate: null,
      createdBy: null,
    };
    metaData.objectName = `/cif/${this.data.partyId}/document/${currentDate}-${this.file.name}`;
    metaData.entityId = this.data.partyId;
    metaData.documentType = this.documentChecklist.documentType;
    metaData.document = this.documentChecklist.document;
    metaData.category = this.documentChecklist.category;
    metaData.dueDate = new Date(this.documentChecklist.dueDate).toISOString();
    metaData.status = this.documentChecklist.status;
    metaData.remarks = this.documentChecklist.remarks;
    metaData.createdDate = new Date();
    const formData = new FormData();
    formData.append('file', this.file);
    this.accountService.identity().subscribe(resAccount => {
      metaData.createdBy = resAccount.login;
      this.storageService.uploadMeta(this.data.bucket, formData, metaData).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(this.documentChecklist);
      });
    });
  }

  public onSelect(event: any) {
    this.file = event['addedFiles'][0];
  }

  public onRemove(event: any) {
    this.file = null;
  }
}
