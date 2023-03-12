import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentChecklist, IDocumentChecklist } from './document-checklist.model';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { StorageService } from 'app/entities/storage/storage.service';
import moment from 'moment';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { AccountService } from 'app/core/auth/account.service';
import { MessageService } from 'primeng/api';
import { IDocumentNode } from 'app/entities/document-node/document-node.model';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { Router } from '@angular/router';

export const MY_DATE_FORMAT = {
  parse: { dateInput: { month: 'numeric', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'numeric', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'numeric' },
  },
};
@Injectable()
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
  selector: 'jhi-document-checklist-dialog-temp',
  templateUrl: './document-checklist-dialog.component.html',
  styleUrls: ['../../../../entities/credit-proposal/css/credit-proposal-basic-information.css'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DocumentChecklistDialogTempComponent implements OnInit {
  public documentChecklist: IDocumentChecklist;
  public file = [];
  public files: any;
  public object: ICreditProposal;
  public key: string;
  public view: string;

  public isDarFinalization: Boolean =
    this.router.url.split('/')[1] === 'dar-final' || this.router.url.split('/')[1] === 'loan-committee-approval' ? false : true;

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
    private _dialog: MatDialogRef<DocumentChecklistDialogTempComponent>,
    private storageService: StorageService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.view = this.data.view;
    this.view ? (this.documentChecklist = this.data.documentChecklist) : (this.documentChecklist = new DocumentChecklist());
    this.view ? (this.file = []) : (this.file = []);
    this.view ? (this.key = this.data.documentChecklist.key) : (this.key = null);
    this.files = this.data.files;
  }

  public onChange(el) {
    if (el === 'TBO' || el === 'Waived') {
      this.isTBO();
    }
  }

  public convertDan(value: string): any {
    if (value !== null && value !== undefined) {
      return value.replace('codeSpecialDan', '&');
    } else {
      return '';
    }
  }

  ngOnInit() {
    this.object = this.data.creditProposal;
  }
  public copyDeviation = [];
  public save(): void {
    const promises = []
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
      const files = new Date() + '-' + this.file[i].name.replace('&', '');

      metaData.objectName = `/credit_proposal/${this.data.creditProposal.id}/document/${files}`;
      metaData.entityId = this.data.creditProposal.id;
      metaData.documentType = this.documentChecklist.documentType;
      metaData.document = this.documentChecklist.document.replace('&', 'codeSpecialDan');
      metaData.category = this.documentChecklist.category;
      metaData.dueDate = this.documentChecklist.dueDate === null ? null : new Date(this.documentChecklist.dueDate).toISOString();
      metaData.status = this.documentChecklist.status;
      metaData.remarks = this.documentChecklist.remarks.replace('&', 'codeSpecialDan');
      metaData.createdDate = new Date();

      const formData = new FormData();
      formData.append('file', this.file[i]);

      this.accountService.identity().subscribe(resAccount => {
        metaData.createdBy = resAccount.login;
        if (metaData.status === 'Waived') {
          this.setConvenant(metaData);
          this.storageService.getBucketName().subscribe((a: any) => {
            if (a.body.bucket !== null) {
              this.storageService.uploadMeta(String(a.body.bucket), formData, metaData).subscribe(res => {
                promises.push(res)
                  if (promises.length === this.file.length) {
                    this._dialog.close(this.copyDeviation);
                  }
              });
            }
          });
        } else {
          this.storageService.getBucketName().subscribe((a: any) => {
            this.storageService.uploadMeta(a.body.bucket, formData, metaData).subscribe(res => {
              promises.push(res)
              if (promises.length === this.file.length) {
                this._dialog.close(null);
              }
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

  public setModel(event: any) {
    this.documentChecklist.remarks = event.target.value;
  }

   public deleteTBO(status: any){
    if (status.value === 'Available') {
      this.handleImage().then()
    }else{
      this.handleImage().then(()=> {
        if (this.file.length < 1) {
          this.isTBO()
        }
        
      })
      
    }
    
    // if (status.value !== 'TBO') {
    //   this.file = []
    // }
  }

 

  public edit(): void {
    const files: IDocumentNode[] = this.documentChecklist['files'];

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file: IDocumentNode = files[i];
        this.accountService.identity().subscribe(resAccount => {
          file.tags['dueDate'] =
            this.documentChecklist.dueDate === null || this.documentChecklist.dueDate === 'null'
              ? 'null'
              : new Date(this.documentChecklist.dueDate).toISOString();
          file.tags['status'] = this.documentChecklist.status;
          file.tags['remarks'] = this.documentChecklist.remarks.replace('&', 'codeSpecialDan');

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
    if (this.file.length > 1) {
      this.handleImage().then()
    }
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
    this.file.splice(this.file.indexOf(event), 1);
    if (this.file.length < 1 && this.documentChecklist.status !== 'Available') {
      this.isTBO()
    }
    
  }

  public handleImage(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.file.length > 0) {
        for (let i = 0; i < this.file.length; i++) {
          if (this.file[i].name.indexOf('los_logo.png') > -1) {
            this.file.splice(this.file.indexOf(this.file[i]), 1);
          }
          
        }
      }
    resolve()
   
    });
  }

  public donwload(event: any, name: any) {
    this.reportUtilService.downloadFileBYName(event, name.name);
  }
}
