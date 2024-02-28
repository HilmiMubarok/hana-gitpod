import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IInternalMemoDocument, InternalMemoDocument } from 'app/entities/dpdl-finalize/internal memo/internal-memo.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { TemplateService } from 'app/layouts/template/template.service';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import lodash from 'lodash';
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
@Injectable()
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'yyyy/MM/dd', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'jhi-internal-memo-dppk-loan-operation-dialog',
  templateUrl: './internal-memo-dppk-loan-operation-dialog.component.html',
  styleUrls: [
    '../../../dppk-finalize/dppk-preparation/dppk-preparation-internal-memo/dppk-preparation-internal-memo-dialog.component.scss',
  ],
})
export class InternalMemoDppkLoanOperationDialogComponent implements OnInit {
  public datas = [];
  public files: File[] = [];
  public file: File;
  public document: IInternalMemoDocument;
  public id: string;
  public documentTypes = [];
  public object: ICreditProposal;
  public multiple: Boolean = false;
  public indeks = 0;
  public booleanRouter: boolean;
  datePipe: DatePipe = new DatePipe('en-US');
  private bucket: string;
  public categoryType = [];
  public collateralView: boolean;

  public documents: string;
  public view: string;
  public folder: object;
  public removeFile = [];
  public currentObject: any;
  public previousObject: any;
  public changefield: boolean;
  public existingIds = [];
  public folders = [];
  public folders2 = [];
  public folderFiles = [];
  public filesStatus: string;
  public parentPath = this.router.url.split('/')[1];

  constructor(
    private templateService: TemplateService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      creditProposal: ICreditProposal;
      bucket: string;
      documents: string;
      view: string;
      obj: object;
      change: any;
    },
    private _dialog: MatDialogRef<InternalMemoDppkLoanOperationDialogComponent>,
    private storageService: StorageService,
    private _snackBar: MatSnackBar,

    private router: Router,
    public reportUtilService: ReportUtilService,
    private messageService: MessageService
  ) {
    this.view = this.data.view;
    const dataDoc: any = this.data.obj;

    if (this.data.view === 'edit') {
      this.document = {
        id: dataDoc.id,
        documentDate: new Date(dataDoc.files[0].tags.documentDate),

        documentName: dataDoc.files[0].tags.documentName,

        remarks: this.changeCharacter(dataDoc.files[0].tags.remarks),
      };
    } else {
      this.document = new InternalMemoDocument();
    }

    this.file = null;
    this.bucket = this.data.bucket;
    this.documents = this.data.documents;
    this.view = this.data.view;
    this.folder = this.data.obj;
    if (this.folder !== undefined) {
      this.folderFiles = this.folder['files'];
    }

    this.changefield = false;
  }

  public setInternalMemoOwner() {
    if (this.data.creditProposal !== null) {
      this.getFilesId(this.data.creditProposal.id);
    }

    if (this.folder !== undefined) {
      this.getFiles(this.data.creditProposal.id);
    }
  }

  ngOnInit(): void {
    if (this.data.creditProposal) {
      this.object = this.data.creditProposal;
    }

    this.checkObject();
  }

  public checkObject() {
    if (this.folder !== undefined) {
      this.previousObject = {
        id: this.folder['files'][0]['tags']['id'],
        documentDate: new Date(this.folder['files'][0]['tags']['documentDate']),
        documentName: this.changeCharacter(this.folder['files'][0]['tags']['documentName']),
        remarks: this.changeCharacter(this.folder['files'][0]['tags']['remarks']),
      };

      this.currentObject = this.previousObject;
      this.checkChanges();
    } else {
      this.previousObject = {};
      this.currentObject = {};
      this.checkChanges();
    }
  }

  private getFiles(id: number): void {
    const predicate: Object = {
      key: `/dppk/${id}/internal-memo/` + this.folder['files'][0]['tags']['id'],
    };
    this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
      this.groupByFolder(res.body);
    });
  }

  public checkChanges() {
    if (this.previousObject && this.currentObject) {
      const keys1 = Object.keys(this.previousObject);
      const keys2 = Object.keys(this.currentObject);

      // Periksa apakah jumlah properti sama
      if (keys1.length !== keys2.length) {
        this.changefield = false;
      } else {
        let hasChanges = false;

        // Periksa apakah setiap properti memiliki nilai yang sama
        for (const key of keys1) {
          if (this.previousObject[key] !== this.currentObject[key]) {
            hasChanges = true;
            break;
          }
        }

        if (hasChanges) {
          this.changefield = true;
        } else {
          this.changefield = false;
        }
      }
    }
  }

  public getField() {
    if (this.folder !== undefined) {
      this.document.id = this.folder['files'][0]['tags']['id'];
      this.document.documentDate = new Date(this.folder['files'][0]['tags']['documentDate']);
      this.document.documentName = this.changeCharacter(this.folder['files'][0]['tags']['documentName']);
      this.document.remarks = this.changeCharacter(this.folder['files'][0]['tags']['remarks']);
    }
  }

  public preSave(): void {
    const formattedDate = this.datePipe.transform(this.document.documentDate, 'yyyy/MM/dd');

    this.currentObject = {
      id: this.document.id,
      documentDate: formattedDate,
      documentName: this.changeCharacter(this.document.documentName),
      remarks: this.changeCharacter(this.document.remarks),
    };

    this.checkChanges();

    if (this.removeFile.length > 1) {
      for (let i = 0; i < this.removeFile.length; i++) {
        this.storageService.deleteFile(this.bucket, this.removeFile[i]).subscribe(data => {
          this.saveAndUpdate();
        });
      }
    } else if (this.removeFile.length === 1) {
      this.storageService.deleteFile(this.bucket, this.removeFile[0]).subscribe(data => {
        this.saveAndUpdate();
      });
    } else {
      this.saveAndUpdate();
    }
  }

  private getFilesId(id: number): void {
    const predicate: Object = {
      key: `/dppk/${id}/internal-memo/`,
    };
    this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
      if (res.body.length > 0) {
        this.loopId(res.body);
      }
    });
  }

  public loopId(data: any) {
    for (let i = 0; i < data.length; i++) {
      this.existingIds.push(data[i]['tags']['id']);
    }
  }

  private groupByFolder(param: Object[]): void {
    this.folders = [];
    if (param.length > 0) {
      this.folders = lodash
        .chain(param)
        .groupBy('tags.id')
        .map((val, key) => ({
          folder: key,
          date: val[0]['tags']['documentDate'],
          files: val,
          nameFile: val[0]['name'],
        }))
        .value();

      this.folder = this.folders[0];
      this.folders2 = this.folders;
      this.getField();
      this.id = this.folder['files'][0]['tags']['id'];
    }
  }

  public saveAndUpdate() {
    this.validate().then(() =>
      this.save().then((res: any) => {
        this._dialog.close(res);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document saved successfully.' });
      })
    );
  }

  public save(): Promise<any> {
    const formattedDate = this.datePipe.transform(this.document.documentDate, 'yyyy/MM/dd');

    return new Promise((resolve, reject) => {
      if (this.data.creditProposal !== null) {
        const data = {
          existingIds: this.existingIds,
          view: this.view,
          files: this.files,
          datePipe: this.datePipe,
          id: this.document.id,
          documentName: this.changeCharacter(this.document.documentName),
          creditProposal: {
            id: this.data.creditProposal.id,
          },
          documentDate: formattedDate,
          remarks: this.changeCharacter(this.document.remarks),
          folderFiles: this.folderFiles,
        };

        resolve(data);
      }
    });
  }

  public setModel(event: any) {
    this.document.documentName = event.target.value;
  }

  public onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  public onRemove(event: any) {
    if (event.url === undefined) {
      this.files.splice(this.files.indexOf(event), 1);
    } else {
      this.folder['files'] = this.folder['files'].filter((data: any) => data.key !== event.key);

      this.removeFile.push(event.key);
    }
  }

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

  public generateRandomId(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }

    return randomId;
  }

  public checkIdExists(id: string, existingIds: string[]): boolean {
    return existingIds.includes(id);
  }

  public generateUniqueRandomId(length: number, existingIds: string[]): string {
    let randomId = this.generateRandomId(length);

    while (this.checkIdExists(randomId, existingIds)) {
      randomId = this.generateRandomId(length);
    }

    return randomId;
  }

  // Validasi
  private _showNotification(severity: string, message: string): void {
    const severityCaptitalized = severity.charAt(0).toUpperCase() + severity.slice(1);
    this.messageService.add({ severity, summary: severityCaptitalized, detail: message, life: 3000 });
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

  public checkMustValidated() {
    const mustValidateDocument = {
      remarks: true,
      documentName: true,
      date: true,
      files: true,
    };
    if (this.folder === undefined) {
      if (this.files.length === 0) {
        mustValidateDocument.files = false;
      }
    }

    if (!this.document.documentName) {
      this._showNotification('error', 'Masukkan Document Name terlebih dahulu');
      mustValidateDocument.documentName = false;
    }
    if (!this.document.documentDate) {
      this._showNotification('error', 'Masukkan Tanggal Document terlebih dahulu');
      mustValidateDocument.date = false;
    }

    if (!this.document.remarks) {
      this._showNotification('error', 'Masukkan Remarks Document terlebih dahulu');
      mustValidateDocument.remarks = false;
    }

    return this._validateProcess(mustValidateDocument);
  }

  public validateDocument(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Document Validated');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateDocument().then(() => resolve(true));
    });
  }

  changeCharacter(inputString: string): string {
    if (typeof inputString === 'string') {
      // Replace '&' with a specific letter, for example 'X'
      return inputString.replace(/&/g, 'dan');
    }
    return inputString;
  }

  conditionReviewDppk() {
    if (this.parentPath === 'review-dppk') {
      return true;
    }
    return false;
  }
}
