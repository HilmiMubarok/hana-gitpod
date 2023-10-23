import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  IDocumentChecklistDebtorData,
  DocumentChecklistDebtorData,
} from 'app/entities/debtor-data/document-checklis/debtor-data-document-checklist';
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
  selector: 'jhi-document-checklist-dialog-history',
  templateUrl: './document-checklist-dialog-history.component.html',
  styleUrls: ['./document.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DocumentChecklistDialogHistoryComponent {
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
  public memoryFiles = [];
  public fileDeleted = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      view: string;
      files: any;
      bucket: string;
      partyId: number;
      cpId: string;
      typeData: IDocumentType[];
      item: string;
      parentId: string;
    },
    private _dialog: MatDialogRef<DocumentChecklistDialogHistoryComponent>,
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
    if (this.data.parentId !== 'DOC_IDD') {
      const retrieveIDDNotDuplicated: Object = {
        key: `/cp/${this.data.partyId}/document/history/file-cp/${this.files.key}`,
      };

      this.prosesGetDataByID(retrieveIDDNotDuplicated);
    } else {
      const retrieveIDDNotDuplicated: Object = {
        key: `/cp/${this.data.partyId}/document/history/file-idd/${this.files.key}`,
      };

      this.prosesGetDataByID(retrieveIDDNotDuplicated);
    }
  }

  public prosesGetDataByID(url: any) {
    this.storageService.getObjects(this.bucket, url).subscribe((res: any) => {
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
            nameFIle: res.body[index].name,
            remarks: res.body[index].tags.remarks,
            status: res.body[index].tags.status,
            dueDate: res.body[index].tags.dueDate,
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

  public deleteTBO(status) {
    this.setStatusCurrenValue.push(status.value);
    if (this.setStatusCurrenValue.length > 2) {
      this.setStatusCurrenValue.shift();
    }
    if (this.setStatusCurrenValue[0] === 'Available' && this.setStatusCurrenValue[1] === 'TBO') {
      this.handleImage();
    } else if (this.setStatusCurrenValue[0] === 'TBO' && this.setStatusCurrenValue[1] === 'Available') {
      this.handleImage();
    } else if (this.setStatusCurrenValue[0] === 'Waived' && this.setStatusCurrenValue[1] === 'Available') {
      this.handleImage();
    } else if (this.setStatusCurrenValue[0] === 'Available' && this.setStatusCurrenValue[1] === 'Waived') {
      this.handleImage();
    } else if (this.setStatusCurrenValue[0] === 'TBO' && this.setStatusCurrenValue[1] === undefined) {
      this.handleImage();
    } else if (this.setStatusCurrenValue[0] === 'Waived' && this.setStatusCurrenValue[1] === undefined) {
      this.handleImage();
    } else if (this.files.status === 'Available') {
      this.handleImage();
    } else if (this.files.status === 'Not Available') {
      this.handleImage();
    } else if (this.setStatusCurrenValue[0] === 'TBO' && this.setStatusCurrenValue[1] === 'Waived') {
      this.handleImage();
    } else if (this.setStatusCurrenValue[0] === 'Waived' && this.setStatusCurrenValue[1] === 'TBO') {
      this.handleImage();
    }

    if (status.value === 'TBO' || status.value === 'Waived') {
      if (this.file.length === 0) {
        this.isTBO();
      }
    }
  }

  public progressSave = false;

  public save(): void {
    if (this.files.category === 'C') {
      if (this.files.status === 'Not Available') {
        const deleteData = this.file.length - this.fileDeleted.length;
        this.approvedDeleted().then(() => {
          if (deleteData > 0) {
            this.preSave().then((res: any) => {
              if (this.fileDeleted.length > 0) {
                if (this.file.length === this.fileDeleted.length) {
                  this._dialog.close();
                }
              } else {
                this._dialog.close();
              }
            });
          }
        });
        if (deleteData > 0) {
          this.preUpdate().then(() => {
            this._dialog.close();
          });
        }
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Category C tidak boleh menginputkan selain status Not Available',
        });
      }
    } else {
      const deleteData = this.file.length - this.fileDeleted.length;
      this.approvedDeleted().then(() => {
        if (deleteData > 0) {
          this.preSave().then((res: any) => {
            if (this.fileDeleted.length > 0) {
              if (this.file.length === this.fileDeleted.length) {
                this._dialog.close();
              }
            } else {
              this._dialog.close();
            }
          });
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'File tidak boleh kosong jika available',
          });
        }
      });
      if (deleteData > 0) {
        this.preUpdate().then(() => {
          this._dialog.close();
        });
      }
    }
  }

  public approvedDeleted(): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileDeleted = [];
      for (let i = 0; i < this.memoryFiles.length; i++) {
        if (this.memoryFiles[i].url !== undefined) {
          this.storageService.deleteFile(this.bucket, this.memoryFiles[i].name).subscribe(data => {
            fileDeleted.push(data);
          });
        }
      }
      resolve();
    });
  }

  public preUpdate(): Promise<void> {
    return new Promise((resolve, reject) => {
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
              key: `/idd/${this.data.cpId}/document/${this.files.id}/`,
            };
            this.storageService.getObjects(this.bucket, predicate).subscribe((rep: any) => {
              this.lengthMinIO = rep.body;
            });
          });
        }
      }

      resolve();
    });
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
      this.handleImage();
    }
  }

  public onRemove(element: any) {
    this.memoryFiles.push(element);
    if (element.url === undefined) {
      this.file.splice(this.file.indexOf(event), 1);
    } else {
      this.file = this.file.filter(item => item.name !== element.name);
    }
    if (this.files.status === 'TBO' || this.files.status === 'Waived') {
      if (this.file.length === 0) {
        this.isTBO();
      }
    }
  }

  public donwload(event: any, name: any) {
    this.reportUtilService.downloadFileBYName(event, name.nameFIle);
  }

  public handleImage() {
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
  }

  private isTBO(): Promise<void> {
    return new Promise((resolve, reject) => {
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
          resolve();
        }, 'image/png');
      };
    });
  }

  public cancel(): void {
    this._dialog.close('cancel');
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
          metaData.objectName = `/cp/${this.data.partyId}/document/history/file-cp/${this.files.id}/${files}`;
          metaData.entityId = this.data.cpId;
          metaData.id = this.files.id;
          metaData.status = this.files.status;
          metaData.dueDate =
            this.files.dueDate === undefined || this.files.dueDate === null ? null : new Date(this.files.dueDate).toISOString();
          metaData.remarks = this.files.remarks.replace('&', 'codeSpecialDan');

          const formData = new FormData();
          formData.append('file', this.file[i]);

          this.accountService.identity().subscribe(resAccount => {
            metaData.createdBy = resAccount.login;
            this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe(() => {
              resolve();
            });
          });
        }
      }
    });
  }
}
