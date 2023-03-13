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
import { IDocumentType } from 'app/entities/document-type/document-type.model';
import { MatSelectChange } from '@angular/material/select';

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
  public typeData: IDocumentType;
  public categoryType = [];
  public itemData: string;
  public status: string[] = [];
  public bucket: string;
  public setStatusCurrenValue = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      view: string;
      files: any;
      bucket: string;
      partyId: number;
      typeData: IDocumentType[];
      item: string;
    },
    private _dialog: MatDialogRef<DebtorDataDocumentChecklistDialogComponent>,
    private storageService: StorageService,
    private messageService: MessageService,
    private accountService: AccountService,
    public reportUtilService: ReportUtilService
  ) {
    this.view = this.data.view;

    this.files = this.data.files;

    this.itemData = this.data.item;
    this.category();
    this.setStatus();
    this.getMinIOData();
  }

  public getMinIOData() {
    this.getBucket().then(res => {
      this.getFiles(this.data.partyId);
    });
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  public lengthMinIO = [];

  private getFiles(id: number): void {
    const predicate: Object = {
      key: `/idd/${id}/document/${this.files.id}/`,
    };
    this.storageService.getObjects(this.bucket, predicate).subscribe((res: any) => {
      if (res.body.length > 0) {
        this.files.remarks = res.body[0].tags.remarks;
        this.files.status = res.body[0].tags.status;
        this.files.dueDate = res.body[0].tags.dueDate;
      }
      this.lengthMinIO = res.body;
      for (let index = 0; index < res.body.length; index++) {
        this.file = [
          ...this.file,
          {
            url: res.body[index].url,
            name: res.body[index].key,
            remarks: res.body[index].tags.remarks,
            status: res.body[0].tags.status,
            dueDate: res.body[0].tags.dueDate,
          },
        ];
      }
    });
  }

  public setStatus() {
    if (this.data.files.category === 'A' || this.data.files.category === 'B') {
      this.status = ['Available', 'TBO', 'Waived'];
    } else {
      this.status = ['Available', 'TBO', 'Waived', 'Not Available'];
    }
  }

  public category() {
    for (let index = 0; index < this.data.typeData.length; index++) {
      this.categoryType = [...this.categoryType, this.data.typeData[index].description];
    }
  }

  public doUpload(formData: FormData, metaData: object): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe({
        next: res => resolve(),
        error: err => reject(),
      });
    });
  }

  public deleteTBO(status) {
    this.setStatusCurrenValue.push(status.value);
    if (this.setStatusCurrenValue.length > 2) {
      this.setStatusCurrenValue.shift();
    }
    if (this.setStatusCurrenValue[0] !== 'Available' && this.setStatusCurrenValue[1] === undefined) {
      this.isTBO();
    } else if (this.setStatusCurrenValue[0] === 'Available' && this.setStatusCurrenValue[1] === 'TBO') {
      this.isTBO();
    } else if (this.setStatusCurrenValue[0] === 'TBO' && this.setStatusCurrenValue[1] === 'Available') {
      this.handleImage();
    } else if (this.setStatusCurrenValue[0] === 'Waived' && this.setStatusCurrenValue[1] === 'Available') {
      this.handleImage();
    } else if (this.setStatusCurrenValue[0] === 'Available' && this.setStatusCurrenValue[1] === 'Waived') {
      this.isTBO();
    } else if (this.setStatusCurrenValue[0] === 'TBO' && this.setStatusCurrenValue[1] === undefined) {
      this.handleImage();
    } else if (this.setStatusCurrenValue[0] === 'Waived' && this.setStatusCurrenValue[1] === undefined) {
      this.handleImage();
    } else if (this.files.status === 'Available') {
      this.handleImage();
    } else if (this.files.status === 'Not Available') {
      this.handleImage();
    } else if (this.files.status === 'TBO') {
      for (let i = 0; i < this.file.length; i++) {
        if (this.file[i].name.indexOf('los_logo.png') > -1) {
          this.handleImage().then(() => {
            this.isTBO();
          });
        } else {
          this.isTBO();
        }
      }
    } else if (this.files.status === 'Waived') {
      for (let i = 0; i < this.file.length; i++) {
        if (this.file[i].name.indexOf('los_logo.png') > -1) {
          this.handleImage().then(() => {
            this.isTBO();
          });
        } else {
          this.isTBO();
        }
      }
    }
  }

  public save(): void {
    if (this.files.category === 'A' || this.files.category === 'B') {
      if (this.files.status === 'Available') {
        if (this.file.length > 0) {
          this.preSave().then((res: any) => {
            if (this.lengthMinIO.length > 0) {
              if (
                this.lengthMinIO[0].remarks !== this.files.remarks ||
                this.lengthMinIO[0].status !== this.files.status ||
                this.lengthMinIO[0].dueDate !== this.files.dueDate
              ) {
                this.preUpdate();
              }
            }
          });
        } else {
          this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Status Available tidak boleh mengkosongkan file' });
        }
      } else {
        if (this.file.length > 0) {
          this.preSave().then((res: any) => {
            if (this.lengthMinIO.length > 0) {
              if (
                this.lengthMinIO[0].remarks !== this.files.remarks ||
                this.lengthMinIO[0].status !== this.files.status ||
                this.lengthMinIO[0].dueDate !== this.files.dueDate
              ) {
                this.preUpdate();
              }
            }
          });
        }
      }
    } else {
      if (this.files.status === 'Not Available') {
        if (this.file.length > 0) {
          if (this.lengthMinIO.length > 0) {
            if (
              this.lengthMinIO[0].remarks !== this.files.remarks ||
              this.lengthMinIO[0].status !== this.files.status ||
              this.lengthMinIO[0].dueDate !== this.files.dueDate
            ) {
              this.preUpdate();
            }
          }
        } else {
          this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Status Not Available tidak boleh mengkosongkan file' });
        }
      } else {
        this.messageService.add({ severity: 'info', summary: 'Warning', detail: 'Category C hanya bisa save status Not Available' });
      }
    }
  }

  public preUpdate() {
    const files: any[] = this.lengthMinIO;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file: any = files[i];
        this.accountService.identity().subscribe(resAccount => {
          file.tags['dueDate'] =
            this.files.dueDate === 'null' || this.files.dueDate === null ? 'null' : new Date(this.files.dueDate).toISOString();
          file.tags['status'] = this.files.status;
          file.tags['remarks'] = this.files.remarks.replace('&', 'codeSpecialDan');

          file.tags['createdBy'] = resAccount.login;
        });

        this.storageService.update(this.bucket, file.tags, { key: file.key }).subscribe(res => {
          const predicate: Object = {
            key: `/idd/${this.data.partyId}/document/${this.files.id}/`,
          };
          this.storageService.getObjects(this.bucket, predicate).subscribe((rep: any) => {
            this.lengthMinIO = rep.body;
            this._dialog.close(res);
          });
        });
      }
    }
  }

  public convertDan(value: string): any {
    if (value !== null && value !== undefined) {
      return value.replace('codeSpecialDan', '&');
    } else {
      return '';
    }
  }

  public setModel(event: any) {
    this.documentChecklist.remarks = event.target.value;
  }

  public onSelect(event: any) {
    this.file.push(...event.addedFiles);
    if (this.file.length > 1) {
      this.handleImage().then();
    }
  }

  public onRemove(element: any) {
    if (element.url === undefined) {
      this.file.splice(this.file.indexOf(event), 1);
    } else {
      this.storageService.deleteFile(this.bucket, element.name).subscribe(data => {
        this.file = this.file.filter(item => item.name !== element.name);
      });
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
            if (this.file[i].url === undefined) {
              this.file.splice(this.file.indexOf(this.file[i]), 1);
            } else {
              this.storageService.deleteFile(this.bucket, this.file[i].name).subscribe(data => {
                this.file = this.file.filter(item => item.name !== this.file[i].name);
              });
            }
          }
        }
      }
      resolve();
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

  public preSave(): Promise<void> {
    return new Promise((resolve, reject) => {
      const promises = [];
      for (let i = 0; i < this.file.length; i++) {
        if (this.file[i].url === undefined) {
          const metaData = {
            objectName: null,
            entityId: null,
            id: null,
            status: null,
            dueDate: null,
            remarks: null,
            createdBy: null,
          };
          const files = new Date() + '-' + this.file[i].name.replace('&', '');
          metaData.objectName = `/idd/${this.data.partyId}/document/${this.files.id}/${files}`;
          metaData.entityId = this.data.partyId;
          metaData.id = this.files.id;
          metaData.status = this.files.status;
          metaData.dueDate =
            this.files.dueDate === null || this.files.dueDate === 'null' ? null : new Date(this.files.dueDate).toISOString();
          metaData.remarks = this.files.remarks.replace('&', 'codeSpecialDan');

          const formData = new FormData();
          formData.append('file', this.file[i]);

          this.accountService.identity().subscribe(resAccount => {
            metaData.createdBy = resAccount.login;
            promises.push(this.doUpload(formData, metaData));
          });

          if (promises.length > 0) {
            this.getFiles(this.data.partyId);
            this._dialog.close();
          }
        }
      }
      resolve();
    });
  }
}
