import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentChecklist, IDocumentChecklist } from './document-checklist.model';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { StorageService } from 'app/entities/storage/storage.service';
import moment from 'moment';
import { ICreditProposal } from '../credit-proposal.model';
import { AccountService } from 'app/core/auth/account.service';
import { MessageService } from 'primeng/api';
import { IDocumentNode } from 'app/entities/document-node/document-node.model';
import { ReportUtilService } from 'app/shared/base/report-util.service';

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
  selector: 'jhi-document-checklist-dialog',
  templateUrl: './document-checklist-dialog.component.html',
  styleUrls: ['./document.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DocumentChecklistDialogComponent implements OnInit {
  public documentChecklist: IDocumentChecklist;
  public file = [];
  public files: any;
  public object: ICreditProposal;
  public key: string;
  public view: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      creditProposal: ICreditProposal;
      documentChecklist: any;
      view: string;
      files: any;
      bucket: string;
    },
    public reportUtilService: ReportUtilService,
    private _dialog: MatDialogRef<DocumentChecklistDialogComponent>,
    private storageService: StorageService,
    private messageService: MessageService,
    private accountService: AccountService
  ) {
    this.view = this.data.view;
    this.view ? (this.documentChecklist = this.data.documentChecklist) : (this.documentChecklist = new DocumentChecklist());
    this.view ? (this.file = []) : (this.file = []);
    this.view ? (this.key = this.data.documentChecklist.key) : (this.key = null);
    this.files = this.data.files;
  }

  public onChange(el) {
    el === 'TBO' && this.isTBO();
  }

  ngOnInit() {
    this.object = this.data.creditProposal;
  }
  public copyDeviation = [];
  public save(): void {
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
      const currentDate = moment().format('YYYYMMDDHHMMSSMS');
      const files = this.file[i].name.replace('&', '');

      metaData.objectName = `/credit_proposal/${this.data.creditProposal.id}/document/${currentDate}-${files}`;
      metaData.entityId = this.data.creditProposal.id;
      metaData.documentType = this.documentChecklist.documentType;
      metaData.document = this.documentChecklist.document;
      metaData.category = this.documentChecklist.category;
      metaData.dueDate = new Date(this.documentChecklist.dueDate).toISOString();
      metaData.status = this.documentChecklist.status;
      metaData.remarks = this.documentChecklist.remarks;
      metaData.createdDate = new Date();

      const formData = new FormData();
      formData.append('file', this.file[i]);
      console.log('meta', metaData);
      console.log('data-file', this.file[i]);
      console.log('files', files);
      console.log('formData', formData);

      this.accountService.identity().subscribe(resAccount => {
        metaData.createdBy = resAccount.login;
        if (metaData.status === 'Waived') {
          this.setConvenant(metaData);
          this.storageService.getBucketName().subscribe((a: any) => {
            console.log('ok', a.body.bucket);
            if (a.body.bucket !== null) {
              this.storageService.uploadMeta(String(a.body.bucket), formData, metaData).subscribe(res => {
                this._dialog.close(this.copyDeviation);
              });
            }
          });
        } else {
          this.storageService.getBucketName().subscribe((a: any) => {
            this.storageService.uploadMeta(a.body.bucket, formData, metaData).subscribe(res => {
              this._dialog.close();
            });
          });
        }
      });
    }
  }

  public setConvenant(data: any) {
    const convenantObject = {
      no: this.data.creditProposal.attributes['convenant'].standardDataGridAbove.length + 1,
      covenant: data.document,
      status: data.status,
      deviation: data.category,
      formGroub: true,
      justification: '',
    };
    this.copyDeviation.push(convenantObject);
  }

  public edit(): void {
    const files: IDocumentNode[] = this.documentChecklist['files'];
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file: IDocumentNode = files[i];
        this.accountService.identity().subscribe(resAccount => {
          file.tags['dueDate'] = new Date(this.documentChecklist.dueDate).toISOString();
          file.tags['status'] = this.documentChecklist.status;
          file.tags['remarks'] = this.documentChecklist.remarks;

          file.tags['createdBy'] = resAccount.login;
        });

        this.storageService.update(this.data.bucket, file.tags, { key: file.key }).subscribe(res => {
          this._dialog.close(res);
        });
      }
    }
  }

  public onSelect(event: any) {
    this.file.push(...event.addedFiles);
    console.log(this.file);
  }

  private isTBO() {
    const img = new Image();
    img.src = 'content/images/los_logo.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        const file = new File([blob], 'los_logo.png', { type: 'image/png' });
        this.file.push(file);
      }, 'image/png');
    };
  }

  public onRemove(event: any) {
    this.file.splice(this.files.indexOf(event), 1);
  }

  public donwload(event: any) {
    this.reportUtilService.downloadFileBYName(event);
  }
}
