import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
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
import { ApplicationDocument, IApplicationDocument } from 'app/entities/application-document/application-document.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { IGeneralParameter } from 'app/entities/master-parameter/general-parameter/general-parameter.model';
import { MatTable } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  @ViewChild(MatTable) covernoteTaskTable: MatTable<any>;

  public datas = [];
  public files: File[] = [];
  public file: File;
  // public document: ITboLegalMonitoring;
  public document: IApplicationDocument;
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
  public disabledStatus: boolean;

  public statusValue = [
    {
      statusId: 'AVAILABLE',
      statusDescription: 'Available',
      statusCode: 'AVAILABLE',
    },
    {
      statusId: 'TBO',
      statusDescription: 'TBO',
      statusCode: 'TBO',
    },
    {
      statusId: 'WAIVED',
      statusDescription: 'Waived',
      statusCode: 'WAIVED',
    },
    {
      statusId: 'NOT_AVAILABLE',
      statusDescription: 'Not Available',
      statusCode: 'NOT_AVAILABLE',
    },
  ];

  public categoryValue = ['A', 'B', 'C'];

  public parentPath = this.router.url.split('/')[1];
  public selectedMenu: string;

  public legalCovernoteTypeDdl: IGeneralParameter[] = [];
  public legalCovernoteTaskDataList: IGeneralParameter[] = [];
  public legalCovernoteTaskDataSource: any[] = [];
  public pristine = true;
  public selectedCovernoteTask: string;
  public selectedCovernoteDate: Date;
  public index: any;

  public tempVal: any;

  public docForm: FormGroup;

  dateControl = new FormControl();

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
      obj: any;
      change: any;
    },
    private _dialog: MatDialogRef<TboLegalMonitoringDetailComponent>,
    private storageService: StorageService,
    private _snackBar: MatSnackBar,
    private documentTypeService: DocumentTypeService,
    private router: Router,
    public reportUtilService: ReportUtilService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.view = this.data.view;
    const dataDoc: any = this.data.obj;

    let legalDocIdx: any;
    if (dataDoc.docId === undefined) {
      legalDocIdx = obj => obj.id === dataDoc.attributes.docId;
    } else {
      legalDocIdx = obj => obj.docId === dataDoc.docId;
    }

    this.indeks = JSON.parse(this.data.creditProposal.attributes.legalCovernote).findIndex(legalDocIdx);
    this.folder = this.data.obj;

    this.tempVal = this.data.obj.dueDate;

    // this.docForm = this.fb.group({
    //   dueDate: [new Date(this.tempVal)],
    // });

    this.document = {
      id: dataDoc.id,
      docIdTags: dataDoc.attributes['docId'],
      date: dataDoc.date,
      dueDate: dataDoc.dueDate,
      documentTypeParent: dataDoc.documentTypeParent,
      documentTypeId: dataDoc.documentTypeId,
      category: dataDoc.category,
      statusAppDocId: dataDoc.statusAppDocId,
      files: dataDoc.files,
      initialStatusId: dataDoc.initialStatusId,
      name: dataDoc.name,

      attributes: {
        docId:
          typeof dataDoc.attributes === 'string'
            ? JSON.parse(this.changeCharacter(dataDoc.attributes)).docId
            : this.changeCharacter(dataDoc.attributes.docId),
        remarks:
          typeof dataDoc.attributes === 'string'
            ? JSON.parse(this.changeCharacter(dataDoc.attributes)).remarks
            : this.changeCharacter(dataDoc.attributes.remarks),
        remarksTbo:
          typeof dataDoc.attributes === 'string'
            ? JSON.parse(this.changeCharacter(dataDoc.attributes)).remarksTbo
            : this.changeCharacter(dataDoc.attributes.remarksTbo),
        proposedDate:
          typeof dataDoc.attributes === 'string'
            ? dataDoc.attributes.includes('proposedDate') // Cek apakah ada 'proposedDate' dalam string
              ? new Date(JSON.parse(this.changeCharacter(dataDoc.attributes)).proposedDate)
              : new Date() // Nilai default jika tidak ada 'proposedDate'
            : dataDoc.attributes.proposedDate
            ? new Date(dataDoc.attributes.proposedDate)
            : new Date(), // Nilai default jika undefined atau tidak valid
        proposedStatus:
          typeof dataDoc.attributes === 'string'
            ? JSON.parse(this.changeCharacter(dataDoc.attributes)).proposedStatus || ''
            : this.changeCharacter(dataDoc.attributes.proposedStatus) || '',
        description:
          typeof dataDoc.attributes === 'string'
            ? JSON.parse(this.changeCharacter(dataDoc.attributes)).description || ''
            : this.changeCharacter(dataDoc.attributes.description) || '',
        total:
          typeof dataDoc.attributes === 'string'
            ? JSON.parse(this.changeCharacter(dataDoc.attributes)).total || ''
            : this.changeCharacter(dataDoc.attributes.total) || '',
        notaryNumber:
          typeof dataDoc.attributes === 'string'
            ? JSON.parse(this.changeCharacter(dataDoc.attributes)).notaryNumber || ''
            : this.changeCharacter(dataDoc.attributes.notaryNumber) || '',
        notaryName:
          typeof dataDoc.attributes === 'string'
            ? JSON.parse(this.changeCharacter(dataDoc.attributes)).notaryName || ''
            : this.changeCharacter(dataDoc.attributes.notaryName) || '',
        batasWaktuPenyelesaian:
          typeof dataDoc.attributes === 'string'
            ? dataDoc.attributes.includes('batasWaktuPenyelesaian') // Cek apakah ada 'proposedDate' dalam string
              ? new Date(JSON.parse(this.changeCharacter(dataDoc.attributes)).batasWaktuPenyelesaian)
              : new Date() // Nilai default jika tidak ada 'proposedDate'
            : dataDoc.attributes.batasWaktuPenyelesaian
            ? new Date(dataDoc.attributes.batasWaktuPenyelesaian)
            : new Date(),
        covernoteType:
          this.indeks === -1 ? '' : JSON.parse(this.data.creditProposal.attributes.legalCovernote)[this.indeks].attributes.covernoteType,
      },
    };

    // if (this.data.view === 'edit') {

    // } else {
    //   this.document = new ApplicationDocument();

    //   if (this.data.view === 'add') {
    //     if (
    //       this.document.documentTypeParent === 'DOC_DPDL_LEGAL_COVERNOTE' ||
    //       this.document.documentTypeParent === 'DOC_DPDL_LEGAL_LAMPIRAN'
    //     ) {
    //       this.document.documentTypeId = ''; // atau this.document.documentId = null; sesuai kebutuhan Anda
    //     }
    //   }
    // }

    this.file = null;
    this.bucket = this.data.bucket;
    this.documents = this.data.documents;
    this.view = this.data.view;
    // this.folder = this.data.obj;
    if (this.folder !== undefined) {
      this.folderFiles = this.folder['files'];
    }

    this.changefield = false;

    console.log('folder', this.folder);
    console.log('document', this.document);
  }

  convertToDate(isoDate: string): Date {
    return new Date(isoDate);
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
        parentId: this.document.documentTypeParent,
        page: 0,
        size: 9999,
        sort: ['id', 'desc'],
      })
      .subscribe(res => {
        this.documentTypes = res.body;
        if (this.documentTypes.length > 0) {
          for (let i = 0; i < this.documentTypes.length; i++) {
            this.document.name = this.documentTypes[i].description;
          }
        }
      });
  }

  startDate = new FormControl(new Date());
  minDate = new Date();

  ngOnInit(): void {
    // this.docForm.get('dueDate').setValue(new Date(this.data.obj.dueDate));

    // this.docForm.get('dueDate').valueChanges.subscribe(val => {
    //   this.document.dueDate = val;

    // });

    this.changeDocumentType();
    if (this.data.creditProposal) {
      this.object = this.data.creditProposal;
    }

    this.loadCovernoteTypeDdl();
    this.getLegalCovernoteTaskDataList();

    this.checkObject();
    this.isDisabledReview();
  }

  public checkObject() {
    if (this.folder !== undefined) {
      this.previousObject = {
        id: this.folder['id'],
        docIdTags: this.folder['attributes']['docId'],
        date: new Date(this.folder['date']),
        documentTypeParent: this.folder['attributes']['documentTypeParent'],
        initialStatusId: this.folder['initialStatusId'],
        dueDate: new Date(this.folder['dueDate']),

        // rootId: this.folder['files'][0]['tags']['rootId'],
        documentTypeId: this.folder['documentTypeId'],
        category: this.folder['category'],
        statusAppDocId: this.folder['statusAppDocId'],
        // proposedStatus: this.folder['files'][0]['tags']['proposedStatus'],
        attributes: {
          docId: this.folder['attributes']['docId'],
          proposedDate: this.folder['attributes']['proposedDate'] ? new Date(this.folder['attributes']['proposedDate']) : null,
          prosedStatus: this.folder['attributes']['proposedStatus'],
          remarks: this.changeCharacter(this.folder['remarks']),
          covernoteType: this.folder['attributes']['covernoteType'],
          // remarksTbo: this.changeCharacter(this.folder['files'][0]['tags']['attributes']['remarksTbo']),
          description: this.changeCharacter(this.folder['attributes']['description']),
          total: this.folder['attributes']['total'],
          notaryNumber: this.folder['attributes']['notaryNumber'],
          notaryName: this.folder['attributes']['notaryName'],
          batasWaktuPenyelesaian: this.folder['attributes']['batasWaktuPenyelesaian'],
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
      this.document.documentTypeParent === 'DOC_DPDL_LEGAL_COVERNOTE'
        ? this.datePipe.transform(this.document.date, 'yyyy/MM/dd')
        : this.datePipe.transform(this.document.date, 'yyyy/MM/dd');

    const documentName = this.documentTypes.find(type => type.id === this.document.documentTypeId);
    const resultDocName = documentName ? documentName.description : this.document.documentTypeId;
    const DocName =
      this.document.documentTypeId === 'DOC_DPDL_LEGAL_COVERNOTE' || this.document.documentTypeId === 'DOC_DPDL_LEGAL_LAMPIRAN'
        ? this.document.name
        : resultDocName;
    this.currentObject = {
      date: this.document.date,
      documentTypeId: this.document.documentTypeId,
      documentTypeParent: this.document.documentTypeParent,
      category: this.document.category,
      statusAppDocId: this.document.statusAppDocId,
      initialStatusId: this.document.initialStatusId,
      name: DocName,
      path: this.folderFiles.length > 0 ? this.folderFiles[0].Key : null,
      docIdTags: this.document.attributes['docId'],
      id: this.document.id,
      dueDate: this.document.dueDate,

      attributes: {
        docId:
          typeof this.document.attributes === 'string'
            ? JSON.parse(this.changeCharacter(this.document.attributes)).docId
            : this.changeCharacter(this.document.attributes.docId),
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
            : this.document.attributes.batasWaktuPenyelesaian
            ? this.datePipe.transform(this.document.attributes.batasWaktuPenyelesaian, 'yyyy/MM/dd')
            : null,
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
    if (this.documents === 'document-tbo/document-legal') {
      const predicate: Object = {
        key: `/document-tbo/document-legal/${id}/legal/`,
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

  public saveAndUpdate() {
    this.validate().then(() =>
      this.save().then((res: any) => {
        this._dialog.close(res);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document saved successfully.' });
      })
    );
  }

  public save(): Promise<any> {
    // const formattedDate =
    //   typeof this.document.date === 'string' ? this.datePipe.transform(JSON.parse(this.document.date), 'yyyy/MM/dd') : this.document.date;
    // this.document.documentTypeParent === 'DOC_DPDL_LEGAL_COVERNOTE'
    // ? this.datePipe.transform(this.document.date, 'yyyy/MM/dd')
    // : this.datePipe.transform(this.document.date, 'yyyy/MM/dd');
    const documentName = this.documentTypes.find(type => type.id === this.document.documentTypeId);
    const resultDocName = documentName ? documentName.description : this.document.documentTypeId;
    const DocName =
      this.document.documentTypeId === 'DOC_DPDL_LEGAL_COVERNOTE' || this.document.documentTypeId === 'DOC_DPDL_LEGAL_LAMPIRAN'
        ? this.document.name
        : resultDocName;

    const convTempVal = new Date(this.document.dueDate).toISOString();
    return new Promise((resolve, reject) => {
      if (this.data.creditProposal !== null) {
        const data = {
          existingIds: this.existingIds,
          view: this.view,
          files: this.files,
          datePipe: this.datePipe,
          documentTypeId: this.document.documentTypeId,
          creditProposal: {
            applicationId: this.data.creditProposal.id,
            applicationNumber: this.data.creditProposal.applicationNumber,
          },
          name: DocName,
          category: this.document.category,
          statusAppDocId: this.document.statusAppDocId,
          initialStatusId: this.document.initialStatusId,
          date: this.document.date,
          dueDate: convTempVal,

          path: this.folderFiles.length > 0 ? this.folderFiles[0].Key : null,
          docIdTags: this.document.attributes['docId'],
          id: this.document.id,

          attributes: {
            docId:
              typeof this.document.attributes === 'string'
                ? JSON.parse(this.changeCharacter(this.document.attributes)).docId
                : this.changeCharacter(this.document.attributes.docId),
            // documentDate:
            //   typeof this.document.attributes === 'string'
            //     ? this.datePipe.transform(JSON.parse(this.document.attributes).documentDate, 'yyyy/MM/dd')
            //     : this.document.attributes.documentDate
            //     ? this.datePipe.transform(this.document.attributes.documentDate, 'yyyy/MM/dd')
            //     : null,
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
                : this.document.attributes.batasWaktuPenyelesaian
                ? this.datePipe.transform(this.document.attributes.batasWaktuPenyelesaian, 'yyyy/MM/dd')
                : null,
          },

          // proposedStatus: this.document.proposedStatus,
          folderFiles: this.folderFiles,
        };
        console.log('data save :', data);
        resolve(data);
      }
    });
  }

  public setModel(event: any) {
    this.document.name = event.target.value;
  }

  public onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  // public onRemove(event: any) {
  //   if (event.url === undefined) {
  //     this.document.files.splice(this.document.files.indexOf(event), 1);
  //   } else {
  //     this.document.files['files'] = this.document.files['files'].filter((data: any) => data.key !== event.key);

  //     this.removeFile.push(event.key);
  //   }
  // }

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
      statusAppDocId: true,
      dueDate: true,
      documentTypeParent: true,
      documentTypeId: true,
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

    if (!this.document.documentTypeParent) {
      this._showNotification('error', 'Masukkan Document Type terlebih dahulu');
      mustValidateDocument.documentTypeParent = false;
    }
    if (!this.document.documentTypeId) {
      this._showNotification('error', 'Masukkan Document Name terlebih dahulu');
      mustValidateDocument.documentTypeId = false;
    }
    if (!this.document.date) {
      this._showNotification('error', 'Masukkan Tanggal Document terlebih dahulu');
      mustValidateDocument.date = false;
    }
    if (!this.document.category) {
      this._showNotification('error', 'Masukkan Category Document terlebih dahulu');
      mustValidateDocument.category = false;
    }
    if (!this.document.statusAppDocId) {
      this._showNotification('error', 'Masukkan Status Document terlebih dahulu');
      mustValidateDocument.status = false;
    }
    if (!this.document.statusAppDocId) {
      this._showNotification('error', 'Masukkan Proposed Status Document terlebih dahulu');
      mustValidateDocument.statusAppDocId = false;
    }
    if (!this.document.dueDate) {
      this._showNotification('error', 'Masukkan Proposed Date Document terlebih dahulu');
      mustValidateDocument.dueDate = false;
    }
    if (!this.document.attributes['remarks']) {
      this._showNotification('error', 'Masukkan Remarks Document terlebih dahulu');
      mustValidateDocument.remarks = false;
    }
    // if (!this.document.attributes['remarksTbo']) {
    //   this._showNotification('error', 'Masukkan Remarks TBO Document terlebih dahulu');
    //   mustValidateDocument.remarksTbo = false;
    // }
    if (this.document.documentTypeParent === 'DOC_DPDL_LEGAL_COVERNOTE' || this.document.documentTypeParent === 'DOC_DPDL_LEGAL_AKAD') {
      if (!this.document.attributes['description']) {
        this._showNotification('error', 'Masukkan Deskripsi Document terlebih dahulu');
        mustValidateDocument.description = false;
      }
    }
    if (this.document.documentTypeParent === 'DOC_DPDL_LEGAL_BIAYA') {
      if (!this.document.attributes['total']) {
        this._showNotification('error', 'Masukkan Total terlebih dahulu');
        mustValidateDocument.total = false;
      }
    }
    if (this.document.documentTypeParent === 'DOC_DPDL_LEGAL_COVERNOTE') {
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
      this.parentPath === 'tbo-legal-checking' ||
      this.parentPath === 'tbo-legal-review'
      // this.creditProposal.statusId === 'DPDL_REVIEW_LEAD' ||
      // this.creditProposal.statusId === 'DPDL_REVIEW_HEAD' ||
      // this.creditProposal.statusId === 'DPDL_REVIEW_TEAMLEAD' ||
      // this.creditProposal.statusId === 'DPDL_RETURN_TO_RM'
    ) {
      return true;
    }
    return false;
  }

  isDisabledReview(): boolean {
    if (this.data.obj.documentStatusId === 'ACTIVE' || this.data.obj.statusAppDocId === 'AVAILABLE') {
      return true;
    } else if (this.parentPath === 'tbo-legal-review') {
      return true;
    } else {
      return false;
    }
  }

  // isDisabledStatus(): boolean {
  //   if (this.data.obj.documentStatusId === 'ACTIVE') {
  //     return true;
  //   }
  //   return false;
  // }

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

  public getLegalCovernoteTaskDataList() {
    if (this.document.attributes['covernoteType'] !== null || this.document.attributes['covernoteType'] !== undefined) {
      let idParamType = '';
      switch (true) {
        case this.document.attributes['covernoteType'] === '02':
          idParamType = 'COVERNOTE_DEVELOPER';

          break;
        case this.document.attributes['covernoteType'] === '03':
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
          this.legalCovernoteTaskDataList = res.body;
          this.prepTaskDataSource(this.legalCovernoteTaskDataList);
          this.pristine = false;
        });
    }
  }

  public prepTaskDataSource(legalCovernoteTaskDataList): void {
    JSON.parse(this.data.creditProposal.attributes.legalCovernote)[this.indeks].attributes.covernoteTask.forEach(task => {
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
    this.covernoteTaskTable.renderRows();
  }
}
