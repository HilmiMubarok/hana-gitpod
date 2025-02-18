import { Component, Inject, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
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
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
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
  styleUrls: ['./document.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DocumentChecklistDialogTempComponent {
  public documentChecklist: IDocumentChecklistDebtorData;
  datePipe: DatePipe = new DatePipe('en-US');
  public file = [];
  public files: any;
  public key: string;
  public view: string;
  public typeData: IDocumentType;
  public categoryType = [];
  public itemData: string;
  public status: string[] = [];
  public bucket: string;
  public fileTbo = [];
  public setStatusCurrenValue = [];
  public memoryFiles = [];
  public fileDeleted = [];

  public filesStatus: string;
  public filesdueDate: string;
  public filesRemarks: string;
  public filesDescription: string;

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
      cp: ICreditProposal;
      clonedPredicate: any;
    },
    private _dialog: MatDialogRef<DocumentChecklistDialogTempComponent>,
    private storageService: StorageService,
    private messageService: MessageService,
    private accountService: AccountService,
    public reportUtilService: ReportUtilService,
    private router: Router
  ) {
    this.view = this.data.view;

    this.files = this.data.files;

    this.itemData = this.data.item;
    this.category();
    this.setStatus();
    this.getMinIOData();

    this.filesStatus = this.files.status;
    if (this.files.dueDate === undefined || this.files.dueDate === null || this.files.dueDate === '' || this.files.dueDate === 'null') {
      this.filesdueDate = '';
    } else if (
      this.files.dueDate !== undefined &&
      this.files.dueDate !== null &&
      this.files.dueDate !== '' &&
      this.files.dueDate !== 'null'
    ) {
      this.filesdueDate = this.files.dueDate;
    }

    if (this.files.remarks === null || this.files.remarks === undefined || this.files.remarks === '' || this.files.remarks === 'null') {
      this.filesRemarks = '';
    } else if (
      this.files.remarks !== null &&
      this.files.remarks !== undefined &&
      this.files.remarks !== '' &&
      this.files.remarks !== 'null'
    ) {
      this.filesRemarks = this.files.remarks;
    }
    this.filesDescription = this.files.description;
    this.isTBO();
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
    const retrieveDataCpDuplicateIdd: Object = {
      key: `/cp/${this.data.cpId}/document/file-idd/${this.files.id}`,
    };
    const dataCpOnly: Object = {
      key: `/cp/${this.data.cpId}/document/file-cp/${this.files.id}`,
    };
    const retrieveIDDNotDuplicated: Object = {
      key: `/idd/${this.data.partyId}/document/${this.files.id}`,
    };

    this.storageService.getObjects(this.bucket, retrieveIDDNotDuplicated).subscribe((res: any) => {
      if (res.body.length > 0) {
        this.prosesGetDataByID(res);
        this.storageService.getObjects(this.bucket, dataCpOnly).subscribe((res1: any) => {
          this.prosesGetDataByID(res1);
        });
      } else {
        this.storageService.getObjects(this.bucket, retrieveDataCpDuplicateIdd).subscribe((res2: any) => {
          this.prosesGetDataByID(res2);
          this.storageService.getObjects(this.bucket, dataCpOnly).subscribe((res1: any) => {
            this.prosesGetDataByID(res1);
          });
        });
      }
    });

    if (this.router.url.includes('dppk')) {
      const dataDPPK: Object = {
        key: `/DPPK/${this.data.cpId}/file-dppk/${this.files.id}`,
      };

      this.storageService.getObjects(this.bucket, dataDPPK).subscribe((res: any) => {
        if (res.body.length > 0) {
          this.prosesGetDataByID(res);
        } else {
          this.storageService.getObjects(this.bucket, dataDPPK).subscribe((res2: any) => {
            this.prosesGetDataByID(res2);
          });
        }
      });
    }
  }

  filesBefore$ = new BehaviorSubject<any>(null);
  filesBefore = this.filesBefore$.asObservable();

  public prosesGetDataByID(res: any) {
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
      this.filesBefore$.next(this.file);
      this.filbefor = this.file.length;
    }
  }

  filbefor: any;

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

  public progressSave = false;

  public save(): void {
    this.filesdueDate = this.datePipe.transform(this.filesdueDate, 'yyyy-MM-dd');
    if (this.filesStatus === null || this.filesStatus === undefined || this.filesStatus === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'status is required' });
    } else {
      if (this.files.category === 'C') {
        if (this.file.length > 0) {
          this.files.status = this.filesStatus;
          this.files.dueDate = this.filesdueDate;
          this.files.remarks = this.filesRemarks;
          this.files.description = this.filesDescription;

          this.approvedDeleted().then(() => {
            this.preSave().then(() => {
              this._dialog.close();
            });
            this.preUpdate().then(() => {
              this._dialog.close();
            });
          });
        } else {
          this.file = this.fileTbo;
          this.files.status = this.filesStatus;
          this.files.dueDate = this.filesdueDate;
          this.files.remarks = this.filesRemarks;
          this.files.description = this.filesDescription;

          this.approvedDeleted().then(() => {
            this.preSave().then(() => {
              this._dialog.close();
            });
            this.preUpdate().then(() => {
              this._dialog.close();
            });
          });
        }
      } else {
        if (this.file.length < 1) {
          if (this.filesStatus === 'TBO' || this.filesStatus === 'Waived') {
            this.file = this.fileTbo;
            this.files.status = this.filesStatus;
            this.files.dueDate = this.filesdueDate;
            this.files.remarks = this.filesRemarks;
            this.files.description = this.filesDescription;

            this.approvedDeleted().then(() => {
              this.preSave().then(() => {
                this._dialog.close();
              });
              this.preUpdate().then(() => {
                this._dialog.close();
              });
            });
          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'Data Selain Waived dan TBO tidak boleh kosong',
            });
          }
        } else {
          this.files.status = this.filesStatus;
          this.files.dueDate = this.filesdueDate;
          this.files.remarks = this.filesRemarks;
          this.files.description = this.filesDescription;

          this.approvedDeleted().then(() => {
            this.approvedDeleted().then(() => {
              this.preSave().then(() => {
                this._dialog.close();
              });
              this.preUpdate().then(() => {
                this._dialog.close();
              });
            });
          });
        }
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

  getStatusAppeal(dataBefore: any, dataAfter: any, filesBefore: any, filesAfter: any) {
    const hasPreviousOfferingLetter = this.data.cp.attributes['previousOfferingLetter'];
    const isFilesLengthDifferent = filesBefore !== filesAfter;
    const isDataEqual = _.isEqual(dataBefore, dataAfter);
    const isDataLengthIncreased = dataBefore.length < dataAfter.length;

    if (hasPreviousOfferingLetter) {
      if (isFilesLengthDifferent) {
        return 'Changed';
      }

      if (!isDataEqual) {
        return 'Changed';
      }

      return 'Not Changed';
    } else {
      return null;
    }
  }

  public preUpdate(): Promise<void> {
    const fromDppk = this.router.url.includes('dppk');
    return new Promise((resolve, reject) => {
      const dataBefore = this.data.clonedPredicate;
      const statusAppeal = this.getStatusAppeal(dataBefore.data.files, this.data.files, this.lengthMinIO.length, this.file.length);

      const files: any[] = this.lengthMinIO;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file: any = files[i];
          this.accountService.identity().subscribe(resAccount => {
            file.tags['dueDate'] =
              this.files.dueDate === 'null' || this.files.dueDate === '' || this.files.dueDate === undefined || this.files.dueDate === null
                ? null
                : new Date(this.files.dueDate).toISOString();
            file.tags['status'] = this.files.status;
            file.tags['remarks'] =
              this.files.remarks === null || this.files.remarks === undefined || this.files.remarks === '' || this.files.remarks === 'null'
                ? null
                : this.files.remarks.replace('&', 'codeSpecialDan');
            file.tags['appealStatus'] = statusAppeal;
            file.tags['createdBy'] = resAccount.login;
          });

          this.storageService.update(this.bucket, file.tags, { key: file.key }).subscribe(res => {
            const predicate: Object = fromDppk
              ? { key: `/DPPK/${this.data.cpId}/file-dppk/${this.files.id}/` }
              : {
                  key: `/idd/${this.data.cpId}/document/${this.files.id}/`,
                };
            this.storageService.getObjects(this.bucket, predicate).subscribe((rep: any) => {
              this.lengthMinIO = rep.body;
            });
            resolve();
          });
        }
      }
    });
  }

  public convertDan(value: string): any {
    if (value !== null && value !== undefined) {
      return value.replace(/codeSpecialDan/g, '&');
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
  }

  public donwload(event: any, name: any) {
    this.reportUtilService.downloadFileBYName(event, name.nameFIle);
  }

  public changeStatus(event: any) {
    this.filesStatus = event.value;
    if (this.filesStatus === 'Available') {
      this.handleImage();
    }
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
          this.fileTbo.push(file);
          resolve();
        }, 'image/png');
      };
    });
  }

  public cancel(): void {
    this._dialog.close('cancel');
  }

  public preSave(): Promise<void> {
    const fromDppk = this.router.url.includes('dppk');
    const dataBefore = this.data.clonedPredicate;
    const statusAppeal = this.getStatusAppeal(dataBefore.data.files, this.data.files, this.lengthMinIO.length, this.file.length);

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
            appealStatus: null,
          };
          const files = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-' + this.file[i].name.replace('&', '');
          if (files.split('').length > 254) {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'Nama file tidak boleh lebih dari 255 karakter',
            });
          } else {
            metaData.objectName = fromDppk
              ? `/DPPK/${this.data.cpId}/file-dppk/${this.files.id}/${files}`
              : `/cp/${this.data.cpId}/document/file-cp/${this.files.id}/${files}`;
            metaData.entityId = this.data.cpId;
            metaData.id = this.files.id;
            metaData.status = this.files.status;
            metaData.dueDate =
              this.files.dueDate === '' || this.files.dueDate === undefined || this.files.dueDate === 'null' || this.files.dueDate === null
                ? null
                : new Date(this.files.dueDate).toISOString();
            metaData.remarks =
              this.files.remarks === null || this.files.remarks === 'null' || this.files.remarks === undefined || this.files.remarks === ''
                ? null
                : this.files.remarks.replace('&', 'codeSpecialDan');
            metaData.appealStatus = statusAppeal;
            const formData = new FormData();
            formData.append('file', this.file[i]);

            this.accountService.identity().subscribe(resAccount => {
              metaData.createdBy = resAccount.login;
              this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe(() => {
                resolve();
              });
            });
          }
        } else {
          resolve();
        }
      }
    });
  }
}
