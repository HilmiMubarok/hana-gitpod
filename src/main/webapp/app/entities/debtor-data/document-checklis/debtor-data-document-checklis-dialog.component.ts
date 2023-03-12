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
import { IDocumentNode } from 'app/entities/document-node/document-node.model';

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
  public view: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      documentChecklist: any;
      view: string;
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
    this.view ? (this.file = []) : (this.file = []);
    this.view ? (this.key = this.data.documentChecklist.key) : (this.key = null);
    this.files = this.data.files;
  }

  public onChange(el) {
    el === 'TBO' && this.isTBO();
    this.deleteTBO(el)
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
          const files = new Date +'-'+this.file[i].name.replace('&', '');
          metaData.objectName = `/cif/${this.data.partyId}/document/${files}`;
          metaData.entityId = this.data.partyId;
          metaData.documentType = this.documentChecklist.documentType
          metaData.document = this.documentChecklist.document.replace('&', 'codeSpecialDan');
          metaData.category = this.documentChecklist.category
          metaData.dueDate = this.documentChecklist.dueDate === null || this.documentChecklist.dueDate === 'null' ? null : new Date(this.documentChecklist.dueDate).toISOString();
          metaData.status = this.documentChecklist.status
          metaData.remarks = this.documentChecklist.remarks.replace('&', 'codeSpecialDan');
          metaData.createdDate = new Date();

          const formData = new FormData();
          formData.append('file', this.file[i]);

          this.accountService.identity().subscribe(resAccount => {
            metaData.createdBy = resAccount.login;

            this.storageService.uploadMeta(this.data.bucket, formData, metaData).subscribe((res: any) => {
              promises.push(res)
              if (promises.length === this.file.length) {
                 this._dialog.close(res);
              }
             
            });
         

        })
    
  }
}

  public convertDan(value: string): any{
    if(value !== null && value !== undefined){
      return value.replace('codeSpecialDan', '&')
    }else{
      return ''
    }
   
  }

  public setModel(event: any){
    this.documentChecklist.remarks = event.target.value
  }

  public edit(): void {
    const files: IDocumentNode[] = this.documentChecklist['files'];
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file: IDocumentNode = files[i];
        this.accountService.identity().subscribe(resAccount => {
          file.tags['dueDate'] = this.documentChecklist.dueDate === 'null' || this.documentChecklist.dueDate=== null ?  'null' : new Date(this.documentChecklist.dueDate).toISOString();
          file.tags['status'] = this.documentChecklist.status
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

  public onRemove(event: any) {
    this.file.splice(this.file.indexOf(event), 1);
    if (this.file.length < 1 && this.documentChecklist.status !== 'Available') {
      this.isTBO()
    }
    
  }


  public donwload(event: any, name: any) {
    this.reportUtilService.downloadFileBYName(event, name.name);
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
}
