import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
// import { DocumentLegalDpdl, IDocumentLegalDpdl } from '../document-dpdl.model';
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
import { DocumentLegalDpdl, IDocumentLegalDpdl } from 'app/entities/dpdl-finalize/dpdl-document/document-dpdl.model';
import { ITboLegalMonitoring, TboLegalMonitoring } from '../tbo-legal-monitoring.model';

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
  selector: 'jhi-tbo-legal-monitoring-detail',
  templateUrl: './tbo-legal-monitoring-detail.component.html',
  styleUrls: ['../tbo-legal-monitoring.style.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class TboLegalMonitoringDetailComponent implements OnInit {
  public datas = [];
  public files: File[] = [];
  public file: File;
  public document: ITboLegalMonitoring;
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
  public proposedStatus: string[] = ['Available', 'TBO', 'Waived'];

  public categoryValue = ['A', 'B', 'C'];

  public parentPath = this.router.url.split('/')[1];
  public selectedMenu: string;

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
    private _dialog: MatDialogRef<TboLegalMonitoringDetailComponent>,
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
      this.document = {
        id: dataDoc.id,
        documentDate: new Date(dataDoc.files[0].tags.documentDate),
        rootId: dataDoc.files[0].tags.rootId,
        parentId: dataDoc.files[0].tags.parentId,
        documentId: dataDoc.files[0].tags.documentId,
        category: dataDoc.files[0].tags.category,
        status: dataDoc.files[0].tags.status,
        // proposedStatus: dataDoc.files[0].tags.proposedStatus,

        attributes: {
          remarks:
            typeof dataDoc.files[0].tags.attributes === 'string'
              ? JSON.parse(this.changeCharacter(dataDoc.files[0].tags.attributes)).remarks
              : this.changeCharacter(dataDoc.files[0].tags.attributes.remarks),
          remarksTbo:
            typeof dataDoc.files[0].tags.attributes === 'string'
              ? JSON.parse(this.changeCharacter(dataDoc.files[0].tags.attributes)).remarksTbo
              : this.changeCharacter(dataDoc.files[0].tags.attributes.remarksTbo),
          proposedDate:
            typeof dataDoc.files[0].tags.attributes === 'string'
              ? dataDoc.files[0].tags.attributes.includes('proposedDate') // Cek apakah ada 'proposedDate' dalam string
                ? new Date(JSON.parse(this.changeCharacter(dataDoc.files[0].tags.attributes)).proposedDate)
                : new Date() // Nilai default jika tidak ada 'proposedDate'
              : dataDoc.files[0].tags.attributes.proposedDate
              ? new Date(dataDoc.files[0].tags.attributes.proposedDate)
              : new Date(), // Nilai default jika undefined atau tidak valid
          proposedStatus:
            typeof dataDoc.files[0].tags.attributes === 'string'
              ? JSON.parse(this.changeCharacter(dataDoc.files[0].tags.attributes)).proposedStatus
              : this.changeCharacter(dataDoc.files[0].tags.attributes.proposedStatus),
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
      };
    } else {
      this.document = new TboLegalMonitoring();

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

    this.checkObject();
  }

  public checkObject() {
    if (this.folder !== undefined) {
      this.previousObject = {
        id: this.folder['files'][0]['tags']['id'],
        documentDate: new Date(this.folder['files'][0]['tags']['documentDate']),
        parentId: this.folder['files'][0]['tags']['parentId'],
        rootId: this.folder['files'][0]['tags']['rootId'],
        documentId: this.folder['files'][0]['tags']['documentId'],
        category: this.folder['files'][0]['tags']['category'],
        status: this.folder['files'][0]['tags']['status'],
        // proposedStatus: this.folder['files'][0]['tags']['proposedStatus'],
        attributes: {
          proposedDate: this.folder['files'][0]['tags']['attributes']['proposedDate']
            ? new Date(this.folder['files'][0]['tags']['attributes']['proposedDate'])
            : null,
          prosedStatus: this.folder['files'][0]['tags']['proposedStatus'],
          remarks: this.changeCharacter(this.folder['files'][0]['tags']['attributes']['remarks']),
          remarksTbo: this.changeCharacter(this.folder['files'][0]['tags']['attributes']['remarksTbo']),
          description: this.changeCharacter(this.folder['files'][0]['tags']['attributes']['description']),
          total: this.folder['files'][0]['tags']['attributes']['total'],
          notaryNumber: this.folder['files'][0]['tags']['attributes']['notaryNumber'],
          notaryName: this.folder['files'][0]['tags']['attributes']['notaryName'],
          batasWaktuPenyelesaian: this.folder['files'][0]['tags']['attributes']['batasWaktuPenyelesaian'],
        },
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
      this.document.id = this.folder['files'][0]['tags']['id'];
      this.document.documentDate = new Date(this.folder['files'][0]['tags']['documentDate']);
      this.document.rootId = this.folder['files'][0]['tags']['rootId'];
      this.document.parentId = this.folder['files'][0]['tags']['parentId'];
      this.document.documentId = this.folder['files'][0]['tags']['documentId'];
      this.document.category = this.folder['files'][0]['tags']['category'];
      this.document.status = this.folder['files'][0]['tags']['status'];
      this.document.proposedStatus = this.folder['files'][0]['tags']['attributes']['proposedStatus'];
      this.document.attributes.remarks = this.changeCharacter(this.folder['files'][0]['tags']['attributes']['remarks']);
      this.document.attributes.remarksTbo = this.changeCharacter(this.folder['files'][0]['tags']['attributes']['remarksTBO']);
      this.document.attributes.description = this.changeCharacter(this.folder['files'][0]['tags']['attributes']['description']);
      this.document.attributes.total = this.folder['files'][0]['tags']['attributes']['total'];
      this.document.attributes.notaryNumber = this.folder['files'][0]['tags']['attributes']['notaryNumber'];
      this.document.attributes.notaryName = this.folder['files'][0]['tags']['attributes']['notaryName'];
      this.document.attributes.batasWaktuPenyelesaian = this.folder['files'][0]['tags']['attributes']['batasWaktuPenyelesaian'];
      const proposedDateString = this.folder['files'][0]['tags']['attributes']['proposedDate'];
      if (proposedDateString) {
        this.document.proposedDate = new Date(proposedDateString);
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

    this.currentObject = {
      id: this.document.id,
      rootId: this.documentRootId,
      documentDate: formattedDate,
      documentId: this.document.documentId,
      parentId: this.document.parentId,

      category: this.document.category,
      status: this.document.status,
      // proposedStatus: this.document.proposedStatus,
      attributes: {
        proposedDate:
          typeof this.document.attributes === 'string'
            ? this.datePipe.transform(JSON.parse(this.document.attributes).proposedDate, 'yyyy/MM/dd')
            : this.document.attributes.proposedDate
            ? this.datePipe.transform(this.document.attributes.proposedDate, 'yyyy/MM/dd')
            : null,
        proposedStatus:
          typeof this.document.attributes === 'string'
            ? JSON.parse(this.changeCharacter(this.document.attributes)).proposedStatus
            : this.changeCharacter(this.document.attributes.proposedStatus),
        remarks:
          typeof this.document.attributes === 'string'
            ? JSON.parse(this.changeCharacter(this.document.attributes)).remarks
            : this.changeCharacter(this.document.attributes.remarks),
        // remarks: this.changeCharacter(this.document.attributes.remarks),
        remarksTbo:
          typeof this.document.attributes === 'string'
            ? JSON.parse(this.changeCharacter(this.document.attributes)).remarksTbo
            : this.changeCharacter(this.document.attributes.remarksTbo),
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
            proposedDate:
              typeof this.document.attributes === 'string'
                ? this.datePipe.transform(JSON.parse(this.document.attributes).proposedDate, 'yyyy/MM/dd')
                : this.document.attributes.proposedDate
                ? this.datePipe.transform(this.document.attributes.proposedDate, 'yyyy/MM/dd')
                : null,
            proposedStatus:
              typeof this.document.attributes === 'string'
                ? JSON.parse(this.changeCharacter(this.document.attributes)).proposedStatus
                : this.changeCharacter(this.document.attributes.proposedStatus),
            remarks:
              typeof this.document.attributes === 'string'
                ? JSON.parse(this.changeCharacter(this.document.attributes)).remarks
                : this.changeCharacter(this.document.attributes.remarks),
            // remarks: this.changeCharacter(this.document.attributes.remarks),
            remarksTbo:
              typeof this.document.attributes === 'string'
                ? JSON.parse(this.changeCharacter(this.document.attributes)).remarksTbo
                : this.changeCharacter(this.document.attributes.remarksTbo),
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
          // proposedStatus: this.document.proposedStatus,
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

  changeCharacter(inputString: string): string {
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
      proposedStatus: true,
      proposedDate: true,
      parentId: true,
      documentId: true,
      date: true,
      files: true,
      total: true,
      remarks: true,
      remarksTbo: true,
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
    if (!this.document.attributes.proposedStatus) {
      this._showNotification('error', 'Masukkan Proposed Status Document terlebih dahulu');
      mustValidateDocument.proposedStatus = false;
    }
    if (!this.document.attributes.proposedDate) {
      this._showNotification('error', 'Masukkan Proposed Date Document terlebih dahulu');
      mustValidateDocument.proposedDate = false;
    }
    if (!this.document.attributes['remarks']) {
      this._showNotification('error', 'Masukkan Remarks Document terlebih dahulu');
      mustValidateDocument.remarks = false;
    }
    if (!this.document.attributes['remarksTbo']) {
      this._showNotification('error', 'Masukkan Remarks TBO Document terlebih dahulu');
      mustValidateDocument.remarksTbo = false;
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

  isDisabled(): boolean {
    if (
      this.parentPath === 'finalize-dppk' ||
      this.parentPath === 'review-dpdl' ||
      this.parentPath === 'loan-ops-distribution' ||
      this.parentPath === 'loan-ops-checking' ||
      this.parentPath === 'loan-ops-review' ||
      this.parentPath === 'review-dppk' ||
      this.parentPath === 'tbo-checking'
      // this.creditProposal.statusId === 'DPDL_REVIEW_LEAD' ||
      // this.creditProposal.statusId === 'DPDL_REVIEW_HEAD' ||
      // this.creditProposal.statusId === 'DPDL_REVIEW_TEAMLEAD' ||
      // this.creditProposal.statusId === 'DPDL_RETURN_TO_RM'
    ) {
      return true;
    }
    return false;
  }
}
