import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { DocumentLegalDpdl, IDocumentLegalDpdl, ILegalCovernote } from '../document-dpdl.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TemplateService } from 'app/layouts/template/template.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { Router } from '@angular/router';
import lodash from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { MatTable } from '@angular/material/table';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { IGeneralParameter } from 'app/entities/master-parameter/general-parameter/general-parameter.model';

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
      return formatDate(date, 'YYYY/MM/dd', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'jhi-document-legal-dialog',
  templateUrl: './document-legal-dialog.component.html',
  styleUrls: ['../document.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DocumentLegalDialogComponent implements OnInit {
  @ViewChild(MatTable) covernoteTaskTable: MatTable<any>;

  public datas = [];
  public files: File[] = [];
  public file: File;
  public document: IDocumentLegalDpdl;
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
  documentRootId = 'DOC_DPDL_LEGAL';
  public status: string[] = ['Available', 'TBO', 'Waived', 'Not Available'];

  public categoryValue = ['A', 'B', 'C'];

  public selectedCovernoteTask: string;
  public selectedCovernoteDate: Date;
  public legalCovernoteTypeDdl: IGeneralParameter[] = [];
  public legalCovernoteTaskDataList: IGeneralParameter[] = [];
  public legalCovernoteTaskDataSource: any[] = [];
  public pristine: boolean;

  constructor(
    private templateService: TemplateService,
    private dialog: MatDialog,
    protected generalParameterService: GeneralParameterService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      creditProposal: ICreditProposal;
      bucket: string;
      documents: string;
      view: string;
      obj: object;
      change: any;
    },
    private _dialog: MatDialogRef<DocumentLegalDialogComponent>,
    private storageService: StorageService,
    private _snackBar: MatSnackBar,
    private documentTypeService: DocumentTypeService,
    private router: Router,
    public reportUtilService: ReportUtilService,
    private messageService: MessageService
  ) {
    this.view = this.data.view;
    const dataDoc: any = this.data.obj;

    if (this.data.view === 'edit') {
      const LegalCovernote = this.legalCovernotePrep(dataDoc.id, dataDoc.files[0].tags.parentId);

      this.document = {
        id: dataDoc.id,
        documentDate: new Date(dataDoc.files[0].tags.documentDate),
        rootId: dataDoc.files[0].tags.rootId,
        parentId: dataDoc.files[0].tags.parentId,
        documentId: dataDoc.files[0].tags.documentId,
        category: dataDoc.files[0].tags.category,
        status: dataDoc.files[0].tags.status,

        attributes: {
          remarks:
            typeof dataDoc.files[0].tags.attributes === 'string'
              ? JSON.parse(this.changeCharacter(dataDoc.files[0].tags.attributes)).remarks
              : this.changeCharacter(dataDoc.files[0].tags.attributes.remarks),
          description:
            typeof dataDoc.files[0].tags.attributes === 'string'
              ? JSON.parse(this.changeCharacter(dataDoc.files[0].tags.attributes)).description
              : this.changeCharacter(dataDoc.files[0].tags.attributes.description),
          total:
            typeof dataDoc.files[0].tags.attributes === 'string'
              ? JSON.parse(this.changeCharacter(dataDoc.files[0].tags.attributes)).total
              : this.changeCharacter(dataDoc.files[0].tags.attributes.total),
          notaryNumber:
            typeof dataDoc.files[0].tags.attributes === 'string'
              ? JSON.parse(this.changeCharacter(dataDoc.files[0].tags.attributes)).notaryNumber
              : this.changeCharacter(dataDoc.files[0].tags.attributes.notaryNumber),
          notaryName:
            typeof dataDoc.files[0].tags.attributes === 'string'
              ? JSON.parse(this.changeCharacter(dataDoc.files[0].tags.attributes)).notaryName
              : this.changeCharacter(dataDoc.files[0].tags.attributes.notaryName),
          batasWaktuPenyelesaian:
            typeof dataDoc.files[0].tags.attributes === 'string'
              ? new Date(JSON.parse(this.changeCharacter(dataDoc.files[0].tags.attributes)).batasWaktuPenyelesaian)
              : new Date(dataDoc.files[0].tags.attributes.batasWaktuPenyelesaian),
        },
        legalCovernote:
          LegalCovernote !== null
            ? {
                id: LegalCovernote[0]?.id,
                documentId: LegalCovernote[0]?.documentId,
                attributes: {
                  covernoteType: LegalCovernote[0]?.attributes.covernoteType,
                  covernoteTask: LegalCovernote[0]?.attributes.covernoteTask,
                },
              }
            : {},
      };
      this.pristine = true;
    } else {
      this.document = new DocumentLegalDpdl();

      if (this.data.view === 'add') {
        if (this.document.parentId === 'DOC_DPDL_LEGAL_COVERNOTE' || this.document.parentId === 'DOC_DPDL_LEGAL_LAMPIRAN') {
          this.document.documentId = ''; // atau this.document.documentId = null; sesuai kebutuhan Anda
        }
      }
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

  public legalCovernotePrep(docId, parentId): ILegalCovernote {
    let data: ILegalCovernote = {};
    const legalCovernoteList = this.data.creditProposal.attributes.legalCovernote;
    data = parentId === 'DOC_DPDL_LEGAL_COVERNOTE' ? legalCovernoteList.filter(obj => obj.id === docId) : null;
    return data;
  }

  public parentIdValue = [];
  public changeDocumentType(): void {
    const value = this.documentRootId;
    this.documentTypeService.listDocumentType(value).subscribe(res => {
      this.parentIdValue = res.body;
    });
    this.loadAll();
  }

  public doSearch(value: string): void {
    if (value) {
      this.loadAll();
      if (value === 'DOC_DPDL_LEGAL_COVERNOTE') {
        this.loadCovernoteTypeDdl();
      }
    } else {
      this.parentIdValue = [];
    }
  }

  private loadAll(): void {
    this.documentTypeService
      .filterTableData({
        lvl2: true,
        parentId: this.document.parentId,
        page: 0,
        size: 9999,
        sort: ['id', 'desc'],
      })
      .subscribe(res => {
        this.documentTypes = res.body;
        if (this.documentTypes.length > 0) {
          for (let i = 0; i < this.documentTypes.length; i++) {
            this.document.documentName = this.documentTypes[i].description;
          }
        }
      });
  }
  public setOwnerCollateral() {
    if (this.data.creditProposal !== null) {
      if (this.documents === 'dpdl') {
        this.getFilesId(this.data.creditProposal.id);
      }
    }

    if (this.folder !== undefined) {
      if (this.documents === 'dpdl') {
        this.getFiles(this.data.creditProposal.id);
      }
    }
  }

  ngOnInit(): void {
    this.changeDocumentType();
    if (this.data.creditProposal) {
      this.object = this.data.creditProposal;
    }

    if (this.document.parentId === 'DOC_DPDL_LEGAL_COVERNOTE') {
      this.loadCovernoteTypeDdl();
      this.getLegalCovernoteTaskDataList();
    }

    this.checkObject();
  }

  public checkObject() {
    if (this.folder !== undefined) {
      const LegalCovernote = this.legalCovernotePrep(this.folder['files'][0]['tags']['id'], this.folder['files'][0]['tags']['parentId']);
      this.previousObject = {
        id: this.folder['files'][0]['tags']['id'],
        documentDate: new Date(this.folder['files'][0]['tags']['documentDate']),
        parentId: this.folder['files'][0]['tags']['parentId'],
        rootId: this.folder['files'][0]['tags']['rootId'],
        documentId: this.folder['files'][0]['tags']['documentId'],
        category: this.folder['files'][0]['tags']['category'],
        status: this.folder['files'][0]['tags']['status'],
        attributes: {
          remarks: this.changeCharacter(this.folder['files'][0]['tags']['attributes']['remarks']),
          description: this.changeCharacter(this.folder['files'][0]['tags']['attributes']['description']),
          total: this.folder['files'][0]['tags']['attributes']['total'],
          notaryNumber: this.folder['files'][0]['tags']['attributes']['notaryNumber'],
          notaryName: this.folder['files'][0]['tags']['attributes']['notaryName'],
          batasWaktuPenyelesaian: this.folder['files'][0]['tags']['attributes']['batasWaktuPenyelesaian'],
        },
        legalCovernote:
          LegalCovernote !== null
            ? {
                id: LegalCovernote[0]['id'],
                documentId: LegalCovernote[0]['documentId'],
                attributes: {
                  covernoteType: LegalCovernote[0]['attributes']['covernoteType'],
                  covernoteTask: LegalCovernote[0]['attributes']['covernoteTask'],
                },
              }
            : {},
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
    if (this.documents === 'dpdl') {
      const predicate: Object = {
        key: `/dpdl/${id}/legal/${this.document.rootId}/${this.document.parentId}` + this.folder['files'][0]['tags']['id'],
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
        this.groupByFolder(res.body);
      });
    }
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
      const legalCovernote = this.legalCovernotePrep(this.folder['files'][0]['tags']['id'], this.folder['files'][0]['tags']['parentId']);
      this.document.id = this.folder['files'][0]['tags']['id'];
      this.document.documentDate = new Date(this.folder['files'][0]['tags']['documentDate']);
      this.document.rootId = this.folder['files'][0]['tags']['rootId'];
      this.document.parentId = this.folder['files'][0]['tags']['parentId'];
      this.document.documentId = this.folder['files'][0]['tags']['documentId'];
      this.document.category = this.folder['files'][0]['tags']['category'];
      this.document.status = this.folder['files'][0]['tags']['status'];
      this.document.attributes.remarks = this.changeCharacter(this.folder['files'][0]['tags']['attributes']['remarks']);
      this.document.attributes.description = this.changeCharacter(this.folder['files'][0]['tags']['attributes']['description']);
      this.document.attributes.total = this.folder['files'][0]['tags']['attributes']['total'];
      this.document.attributes.notaryNumber = this.folder['files'][0]['tags']['attributes']['notaryNumber'];
      this.document.attributes.notaryName = this.folder['files'][0]['tags']['attributes']['notaryName'];
      this.document.attributes.batasWaktuPenyelesaian = this.folder['files'][0]['tags']['attributes']['batasWaktuPenyelesaian'];
      if (legalCovernote !== null) {
        this.document.legalCovernote.id = this.data.creditProposal['attributes']['legalCovernote']['id'];
        this.document.legalCovernote.documentId = this.data.creditProposal['attributes']['legalCovernote']['documentId'];
        this.document.legalCovernote.attributes.covernoteType =
          this.data.creditProposal['attributes']['legalCovernote']['attributes']['covernoteType'];
        this.document.legalCovernote.attributes.covernoteTask =
          this.data.creditProposal['attributes']['legalCovernote']['attributes']['covernoteTask'];
      }
    }
  }

  private doUpload(frmData: FormData, metaData: object): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.uploadMeta(this.bucket, frmData, metaData).subscribe({
        next: res => resolve(),
        error: err => reject(),
      });
    });
  }

  public preSave(): void {
    const formattedDate =
      this.document.parentId === 'DOC_DPDL_LEGAL_COVERNOTE'
        ? this.datePipe.transform(this.document.documentDate, 'yyyy/MM/dd')
        : this.datePipe.transform(this.document.documentDate, 'yyyy/MM/dd');

    const coverNoteTask = [];
    if (this.legalCovernoteTaskDataSource.length > 0) {
      this.legalCovernoteTaskDataSource.forEach(obj =>
        coverNoteTask.push({
          code: obj.covernoteCode,
          date: this.datePipe.transform(obj.covernoteDate, 'yyyy/MM/dd'),
        })
      );
    }

    this.document.attributes['covernoteTask'] = coverNoteTask;

    this.currentObject = {
      id: this.document.id,
      rootId: this.documentRootId,
      documentDate: formattedDate,
      documentId: this.document.documentId,
      parentId: this.document.parentId,

      category: this.document.category,
      status: this.document.status,
      attributes: {
        remarks:
          typeof this.document.attributes === 'string'
            ? JSON.parse(this.changeCharacter(this.document.attributes)).remarks
            : this.changeCharacter(this.document.attributes.remarks),
        // remarks: this.changeCharacter(this.document.attributes.remarks),
        description:
          typeof this.document.attributes === 'string'
            ? JSON.parse(this.changeCharacter(this.document.attributes)).description
            : this.changeCharacter(this.document.attributes.description),
        total:
          typeof this.document.attributes === 'string'
            ? JSON.parse(this.changeCharacter(this.document.attributes)).total
            : this.changeCharacter(this.document.attributes.total),
        notaryNumber:
          typeof this.document.attributes === 'string'
            ? JSON.parse(this.changeCharacter(this.document.attributes)).notaryNumber
            : this.changeCharacter(this.document.attributes.notaryNumber),
        notaryName:
          typeof this.document.attributes === 'string'
            ? JSON.parse(this.changeCharacter(this.document.attributes)).notaryName
            : this.changeCharacter(this.document.attributes.notaryName),
        batasWaktuPenyelesaian:
          typeof this.document.attributes === 'string'
            ? this.datePipe.transform(JSON.parse(this.document.attributes).batasWaktuPenyelesaian, 'yyyy/MM/dd')
            : this.datePipe.transform(this.document.attributes.batasWaktuPenyelesaian, 'yyyy/MM/dd'),
      },

      legalCovernote:
        this.document.parentId === 'DOC_DPDL_LEGAL_COVERNOTE'
          ? {
              covernoteType:
                typeof this.document.attributes === 'string'
                  ? JSON.parse(this.changeCharacter(this.document.attributes)).covernoteType
                  : this.changeCharacter(this.document.attributes.covernoteType),
              covernoteTask:
                typeof this.document.attributes === 'string'
                  ? JSON.parse(this.changeCharacter(this.document.attributes)).covernoteTask
                  : this.changeCharacter(this.document.attributes.covernoteTask),
            }
          : {},
    };

    this.checkChanges();
    if (this.folder === undefined) {
      if (this.files.length === 0) {
        this._snackBar.open('Choose file for upload', null, {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        });
      }
    }

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
    if (this.documents === 'dpdl') {
      const predicate: Object = {
        key: `/dpdl/${id}/legal/`,
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
        if (res.body.length > 0) {
          this.loopId(res.body);
        }
      });
    }
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
    const formattedDate =
      this.document.parentId === 'DOC_DPDL_LEGAL_COVERNOTE'
        ? this.datePipe.transform(this.document.documentDate, 'yyyy/MM/dd')
        : this.datePipe.transform(this.document.documentDate, 'yyyy/MM/dd');

    const coverNoteTask = [];
    if (this.legalCovernoteTaskDataSource.length > 0) {
      this.legalCovernoteTaskDataSource.forEach(obj =>
        coverNoteTask.push({
          code: obj.covernoteCode,
          date: this.datePipe.transform(obj.covernoteDate, 'yyyy/MM/dd'),
        })
      );
    }

    this.document.attributes['covernoteTask'] = coverNoteTask;

    return new Promise((resolve, reject) => {
      if (this.data.creditProposal !== null) {
        const data = {
          existingIds: this.existingIds,
          view: this.view,
          files: this.files,
          datePipe: this.datePipe,
          rootId: this.documentRootId,
          id: this.document.id,
          documentId: this.document.documentId,
          parentId: this.document.parentId,
          creditProposal: {
            id: this.data.creditProposal.id,
          },

          documentDate: formattedDate,
          attributes: {
            remarks:
              typeof this.document.attributes === 'string'
                ? JSON.parse(this.changeCharacter(this.document.attributes)).remarks
                : this.changeCharacter(this.document.attributes.remarks),
            // remarks: this.changeCharacter(this.document.attributes.remarks),
            description:
              typeof this.document.attributes === 'string'
                ? JSON.parse(this.changeCharacter(this.document.attributes)).description
                : this.changeCharacter(this.document.attributes.description),
            total:
              typeof this.document.attributes === 'string'
                ? JSON.parse(this.changeCharacter(this.document.attributes)).total
                : this.changeCharacter(this.document.attributes.total),
            notaryNumber:
              typeof this.document.attributes === 'string'
                ? JSON.parse(this.changeCharacter(this.document.attributes)).notaryNumber
                : this.changeCharacter(this.document.attributes.notaryNumber),
            notaryName:
              typeof this.document.attributes === 'string'
                ? JSON.parse(this.changeCharacter(this.document.attributes)).notaryName
                : this.changeCharacter(this.document.attributes.notaryName),
            batasWaktuPenyelesaian:
              typeof this.document.attributes === 'string'
                ? this.datePipe.transform(JSON.parse(this.document.attributes).batasWaktuPenyelesaian, 'yyyy/MM/dd')
                : this.datePipe.transform(this.document.attributes.batasWaktuPenyelesaian, 'yyyy/MM/dd'),
          },

          category: this.document.category,
          status: this.document.status,
          folderFiles: this.folderFiles,

          legalCovernote:
            this.document.parentId === 'DOC_DPDL_LEGAL_COVERNOTE'
              ? {
                  covernoteType:
                    typeof this.document.attributes === 'string'
                      ? JSON.parse(this.changeCharacter(this.document.attributes)).covernoteType
                      : this.changeCharacter(this.document.attributes.covernoteType),
                  covernoteTask:
                    typeof this.document.attributes === 'string'
                      ? JSON.parse(this.changeCharacter(this.document.attributes)).covernoteTask
                      : this.changeCharacter(this.document.attributes.covernoteTask),
                }
              : {},
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

  public changeCharacter(inputString: string): string {
    if (typeof inputString === 'string') {
      // Replace '&' with a specific letter, for example 'X'
      return inputString.replace(/&/g, 'dan');
    }
    return inputString;
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
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
      description: true,
      category: true,
      status: true,
      parentId: true,
      documentId: true,
      date: true,
      files: true,
      total: true,
      remarks: true,
      notaryNumber: true,
      notaryName: true,
      batasWaktuPenyelesaian: true,
    };
    if (this.folder === undefined) {
      if (this.files.length === 0) {
        this._showNotification('error', 'Upload file terlebih dahulu');
        mustValidateDocument.files = false;
      }
    }

    if (!this.document.parentId) {
      this._showNotification('error', 'Masukkan Document Type terlebih dahulu');
      mustValidateDocument.parentId = false;
    }
    if (!this.document.documentId) {
      this._showNotification('error', 'Masukkan Document Name terlebih dahulu');
      mustValidateDocument.documentId = false;
    }
    if (!this.document.documentDate) {
      this._showNotification('error', 'Masukkan Tanggal Document terlebih dahulu');
      mustValidateDocument.date = false;
    }
    if (!this.document.category) {
      this._showNotification('error', 'Masukkan Category Document terlebih dahulu');
      mustValidateDocument.category = false;
    }
    if (!this.document.status) {
      this._showNotification('error', 'Masukkan Status Document terlebih dahulu');
      mustValidateDocument.status = false;
    }
    if (!this.document.attributes['remarks']) {
      this._showNotification('error', 'Masukkan Remarks Document terlebih dahulu');
      mustValidateDocument.remarks = false;
    }
    if (this.document.parentId === 'DOC_DPDL_LEGAL_COVERNOTE' || this.document.parentId === 'DOC_DPDL_LEGAL_AKAD') {
      if (!this.document.attributes['description']) {
        this._showNotification('error', 'Masukkan Deskripsi Document terlebih dahulu');
        mustValidateDocument.description = false;
      }
    }
    if (this.document.parentId === 'DOC_DPDL_LEGAL_BIAYA') {
      if (!this.document.attributes['total']) {
        this._showNotification('error', 'Masukkan Total terlebih dahulu');
        mustValidateDocument.total = false;
      }
    }
    if (this.document.parentId === 'DOC_DPDL_LEGAL_COVERNOTE') {
      if (!this.document.attributes['notaryNumber']) {
        this._showNotification('error', 'Masukkan Notary Number Document terlebih dahulu');
        mustValidateDocument.notaryNumber = false;
      }
      if (!this.document.attributes['notaryName']) {
        this._showNotification('error', 'Masukkan Notary Name Document terlebih dahulu');
        mustValidateDocument.notaryName = false;
      }
      if (!this.document.attributes['batasWaktuPenyelesaian']) {
        this._showNotification('error', 'Masukkan Batas Waktu Penyelesaian Document terlebih dahulu');
        mustValidateDocument.batasWaktuPenyelesaian = false;
      }
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

  public getLegalCovernoteTaskDataList() {
    if (
      this.document.legalCovernote.attributes['covernoteType'] !== null ||
      this.document.legalCovernote.attributes['covernoteType'] !== undefined
    ) {
      let idParamType = '';
      switch (true) {
        case this.document.legalCovernote.attributes['covernoteType'] === '02':
          idParamType = 'COVERNOTE_DEVELOPER';

          break;
        case this.document.legalCovernote.attributes['covernoteType'] === '03':
          idParamType = 'COVERNOTE_LAINNYA';
          break;

        default:
          idParamType = 'COVERNOTE_NOTARIS';
          break;
      }

      this.generalParameterService
        .queryFilterBy({
          idParameterType: idParamType,
          page: 0,
          size: 9999,
        })
        .subscribe(res => {
          if (this.legalCovernoteTaskDataSource.length > 0) {
            const usedTaskList: any[] = [];
            this.legalCovernoteTaskDataSource.forEach(dataSource => usedTaskList.push(dataSource.covernoteCode));

            this.legalCovernoteTaskDataList = res.body.filter(task => !usedTaskList.includes(task.code));
          } else {
            this.legalCovernoteTaskDataList = res.body;
          }
          if (this.data.view === 'edit') {
            if (this.pristine === true) {
              this.prepTaskDataSource(this.legalCovernoteTaskDataList);
              this.pristine = false;
            }
          }
        });
    }
  }

  public prepTaskDataSource(legalCovernoteTaskDataList): void {
    this.document.legalCovernote.attributes['covernoteTask'].forEach(task => {
      const filteredData = legalCovernoteTaskDataList.filter(obj => obj.code === task.code);
      filteredData.forEach(item => {
        if (item.code === task.code) {
          this.legalCovernoteTaskDataSource.push({
            covernoteTask: item.value,
            covernoteDate: task.date,
            covernoteCode: item.code,
          });
        }
      });
    });
    this.getLegalCovernoteTaskDataList();
    this.covernoteTaskTable.renderRows();
  }

  public addCovernoteTask(selectedCovernoteTask: any, selectedCovernoteDate: Date): void {
    this.legalCovernoteTaskDataSource.push({
      covernoteTask: selectedCovernoteTask.value,
      covernoteDate: selectedCovernoteDate,
      covernoteCode: selectedCovernoteTask.code,
    });
    this.selectedCovernoteTask = '';
    this.getLegalCovernoteTaskDataList();
    this.covernoteTaskTable.renderRows();
  }

  public removeCovernoteTask(row: any): void {
    const index = this.legalCovernoteTaskDataSource.indexOf(row, 0);
    if (index > -1) {
      this.legalCovernoteTaskDataSource.splice(index, 1);
    }
    this.getLegalCovernoteTaskDataList();
    this.covernoteTaskTable.renderRows();
  }

  public loadCovernoteTypeDdl(): void {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COVERNOTE_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.legalCovernoteTypeDdl = res.body;
      });
  }

  public resetTaskDataSource(): void {
    if (this.legalCovernoteTaskDataSource.length > 0) {
      this.legalCovernoteTaskDataSource = [];
      this.covernoteTaskTable.renderRows();
    }
  }
}
