import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocumentChecklistDebtorData, DocumentChecklistDebtorData } from './debtor-data-document-checklist';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { StorageService } from 'app/entities/storage/storage.service';
import moment from 'moment';
import { ReportUtilService } from 'app/shared/base/report-util.service';
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
  styleUrls: ['./document.scss'],
  //   styleUrls: ['../css/credit-proposal-basic-information.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DebtorDataDocumentChecklistDialogComponent {
  public documentChecklist: IDocumentChecklistDebtorData;
  public file = [];
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
    private accountService: AccountService,
    public reportUtilService: ReportUtilService
  ) {
    this.view = this.data.view;
    this.view ? (this.documentChecklist = this.data.documentChecklist) : (this.documentChecklist = new DocumentChecklistDebtorData());
    this.view ? (this.file = [this.data.documentChecklist]) : (this.file = []);
    this.view ? (this.key = this.data.documentChecklist.key) : (this.key = null);
    this.files = this.data.files;
  }

  public doUpload(formData: FormData, metaData: object): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.uploadMeta(this.data.bucket, formData, metaData).subscribe({
        next: res => resolve(),
        error: err => reject(),
      });
    });
  }

  public save(): void {
    const promises = [];
    const currentDate = moment().format('YYYYMMDDHHMMSSMS');
    for (let i = 0; i < this.file.length; i++) {
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
      metaData.objectName = `/cif/${this.data.partyId}/document/${currentDate}-${this.file[i].name}`;
      metaData.entityId = this.data.partyId;
      metaData.documentType = this.documentChecklist.documentType;
      metaData.document = this.documentChecklist.document;
      metaData.category = this.documentChecklist.category;
      metaData.dueDate = new Date(this.documentChecklist.dueDate).toISOString();
      metaData.status = this.documentChecklist.status;
      metaData.remarks = this.documentChecklist.remarks;
      metaData.createdDate = new Date();

      const formData = new FormData();
      formData.append('file', this.file[i]);

      this.accountService.identity().subscribe(resAccount => {
        metaData.createdBy = resAccount.login;
        promises.push(this.doUpload(formData, metaData));
      });

      if (promises.length > 0) {
        Promise.all(promises).then(res => {
          this._dialog.close(res);
        });
      } else {
        this._dialog.close();
      }
    }
  }

  public onSelect(event: any) {
    this.file.push(...event.addedFiles);
  }

  public onRemove(event: any) {
    this.file.splice(this.file.indexOf(event), 1);
  }

  public donwload(event: any) {
    this.reportUtilService.viewFile(event);
  }
}
