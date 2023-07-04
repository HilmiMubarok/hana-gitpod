import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DOCUMENT_TYPE_APPRAISAL } from 'app/shared/constants/base.constants';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { ICollateral } from '../collateral/collateral.model';
import { StorageService } from '../storage/storage.service';
import { Document, DocumentMetaData, IDocument } from './document.model';
import moment from 'moment';
import { AccountService } from 'app/core/auth/account.service';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { PartyCifService } from '../party-cif/party-cif.service';
import { IDocumentNode } from '../document-node/document-node.model';
import lodash from 'lodash';
import { DocumentTypeService } from '../document-type/document-type.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TemplateService } from 'app/layouts/template/template.service';
import { CollateralAppraisalService } from '../collateral-appraisal/collateral-appraisal.service';
@Component({
  selector: 'jhi-document-upload-dialog',
  templateUrl: './document-upload-dialog.component.html',
  styleUrls: ['./document.scss'],
})
export class DocumentUploadDialogComponent implements OnInit {
  public datas = [];
  public files: File[] = [];
  public file: File;
  public document: IDocument;
  public documentTypes = [];
  public object: ICollateral | ICollateralAppraisal;
  public multiple: Boolean = false;
  public indeks = 0;
  public booleanRouter: boolean;
  datePipe: DatePipe = new DatePipe('en-US');
  private bucket: string;
  public certiFicateTypeName = [];
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
  constructor(
    private templateService: TemplateService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      appraisal: ICollateralAppraisal;
      collateral: ICollateral;
      bucket: string;
      documents: string;
      view: string;
      obj: object;
      change: any;
    },
    private storageService: StorageService,
    private _dialog: MatDialogRef<DocumentUploadDialogComponent>,
    private _snackBar: MatSnackBar,
    private accountService: AccountService,
    public reportUtilService: ReportUtilService,
    protected partyCifService: PartyCifService,
    protected documentTypeService: DocumentTypeService,
    private router: Router,
    private collateralAppraisalService: CollateralAppraisalService
  ) {
    this.document = new Document();
    this.file = null;
    this.bucket = this.data.bucket;
    this.documents = this.data.documents;
    this.view = this.data.view;
    this.folder = this.data.obj;
    this.booleanRouter = this.router.url.includes('party-cif');
    this.changefield = false;
    this.setOwnerCollateral();
  }
  public collateralOrAppraisal: string;

  public setOwnerCollateral() {
    if (this.data.collateral !== null) {
      this.getFilesId('collateral', this.data.collateral.id);
    }
    if (this.documents === 'document-lainnya') {
      this.getFilesId('appraisal', this.data.appraisal.id);
    }
    if (this.documents === 'document-collateral') {
      this.getFilesId('appraisal', this.data.appraisal.id);
    }
    if (this.folder !== undefined) {
      if (this.data.collateral !== null) {
        this.getFiles('collateral', this.data.collateral.id);
      }

      if (this.documents === 'document-lainnya') {
        this.getFiles('appraisal', this.data.appraisal.id);
      }
      if (this.documents === 'document-collateral') {
        this.getFiles('appraisal', this.data.appraisal.id);
      }
    }
  }

  ngOnInit(): void {
    this.getLovDocumentCollateralIDD();
    if (this.data.collateral) {
      this.collateralOrAppraisal = 'collateral';
      this.object = this.data.collateral;
      // this.setCertificateType();
    }

    if (this.data.appraisal) {
      this.collateralOrAppraisal = 'appraisal';
      this.object = this.data.appraisal;
      // console.log('document type', this.documentTypes);
      // this.documentTypes = Object(DOCUMENT_TYPE_APPRAISAL);
    }
    this.getRole();

    this.checkObject();
  }

  public checkObject() {
    if (this.folder !== undefined) {
      this.previousObject = {
        documentDate: new Date(this.folder['files'][0]['tags']['docDate']),
        documentType: this.folder['files'][0]['tags']['docType'],
        documentNumber: this.folder['files'][0]['tags']['docNo'].replace('&', 'codeSpecialDan'),
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

  // ...

  public getField() {
    if (this.folder !== undefined) {
      this.document.documentDate = new Date(this.folder['files'][0]['tags']['docDate']);
      this.document.documentType = this.folder['files'][0]['tags']['docType'];
      this.document.documentNumber = this.folder['files'][0]['tags']['docNo'].replace('&', 'codeSpecialDan');
    }
  }

  public getRole() {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.checkRole(newPos.positionTypeId);
    });
  }

  public checkRole(param): void {
    if (param === 'RM' || param === 'ADMIN_APPRAISER' || param === 'SURVEYOR' || param === 'APR_DH') {
      this._dialog.disableClose = true;
      this._dialog.backdropClick().subscribe(_ => {
        this.openCancelDialog();
      });
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

  public convertDan(value: string): any {
    if (value !== null && value !== undefined) {
      return value.replace('codeSpecialDan', '&');
    } else {
      return '';
    }
  }

  public preSave(): void {
    this.currentObject = {
      documentDate: new Date(this.document.documentDate),
      documentType: this.document.documentType,
      documentNumber: this.document.documentNumber,
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

    if (!this.document.documentDate) {
      this._snackBar.open('Pilih tanggal dokumen', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    if (!this.document.documentType) {
      this._snackBar.open('Pilih dokumen jaminan', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    if (!this.document.documentNumber) {
      this._snackBar.open('Masukan nama dokumen', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (this.removeFile.length > 0) {
      for (let i = 0; i < this.removeFile.length; i++) {
        this.storageService.deleteFile(this.bucket, this.removeFile[i]).subscribe(data => {
          this.saveAndUpdate();
        });
      }
    } else {
      this.saveAndUpdate();
    }
  }

  private getFiles(owner: string, id: number): void {
    if (owner === 'collateral') {
      const predicate: Object = {
        key: `/collateral/${id}/document/` + this.folder['files'][0]['tags']['id'],
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
        this.groupByFolder(res.body);
        this.collateralAppraisalService.totalDataDocumentCollateral = res.body;
      });
    }

    if (owner === 'appraisal') {
      if (this.documents === 'document-collateral') {
        const predicate: Object = {
          key: `/appraisals/${id}/document-colateral/` + this.folder['files'][0]['tags']['id'],
        };
        this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
          this.groupByFolder(res.body);

          this.collateralAppraisalService.totalDataDocumentCollateral = res.body;
        });
      }
      if (this.documents === 'document-lainnya') {
        const predicate: Object = {
          key: `/appraisals/${id}/document-lainnya/` + this.folder['files'][0]['tags']['id'],
        };
        this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
          this.groupByFolder(res.body);
          this.collateralAppraisalService.totalDataDocumentLainya = res.body;
        });
      }
    }
  }

  private getFilesId(owner: string, id: number): void {
    if (owner === 'collateral') {
      const predicate: Object = {
        key: `/collateral/${id}/document`,
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
        if (res.body.length > 0) {
          this.loopId(res.body);
        }
      });
    }

    if (owner === 'appraisal') {
      if (this.documents === 'document-collateral') {
        const predicate: Object = {
          key: `/appraisals/${id}/document-colateral/`,
        };
        this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
          if (res.body.length > 0) {
            this.loopId(res.body);
          }
        });
      }
      if (this.documents === 'document-lainnya') {
        const predicate: Object = {
          key: `/appraisals/${id}/document-lainnya`,
        };
        this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
          if (res.body.length > 0) {
            this.loopId(res.body);
          }
        });
      }
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
          date: val[0]['tags']['docDate'],
          files: val,
          nameFile: val[0]['name'],
        }))
        .value();
      this.folder = this.folders[0];
      this.folders2 = this.folders;
      this.getField();
    }
  }

  public saveAndUpdate() {
    this.save().then(res => {
      this._dialog.close(res);
    });
    this.edit().then((res: any) => {
      this._dialog.close(res);
    });
  }

  public save(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.accountService.identity().subscribe(resAccount => {
        const id = this.view === 'add' ? this.generateUniqueRandomId(6, this.existingIds) : this.folder['files'][0]['tags']['id'];
        const promises: Array<any> = new Array<any>();
        for (let i = 0; i < this.files.length; i++) {
          const metaData = new DocumentMetaData();

          const files = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-' + this.files[i].name.replace('&', '');
          metaData.id = id;
          metaData.folder = this.document.documentNumber.replace('&', 'codeSpecialDan');
          metaData.docDate = this.document.documentDate;
          metaData.docNo = this.document.documentNumber.replace('&', 'codeSpecialDan');
          metaData.docType = this.document.documentType;
          metaData.createdDate = new Date();
          metaData.createdBy = resAccount.login;

          const formData = new FormData();
          formData.append('file', this.files[i]);
          if (this.data.collateral) {
            metaData.objectName = `/collateral/${this.data.collateral.id}/document/${id.replace('&', 'codeSpecialDan')}/${files}`;
            metaData.entityId = this.data.collateral.id;
          }

          if (this.data.appraisal) {
            if (this.documents === 'document-lainnya') {
              metaData.objectName = `/appraisals/${this.data.appraisal.id}/document-lainnya/${id}/${files}`;
              metaData.entityId = this.data.appraisal.id;
            }
            if (this.documents === 'document-collateral') {
              metaData.objectName = `/appraisals/${this.data.appraisal.id}/document-colateral/${id}/${files}`;
              metaData.entityId = this.data.appraisal.id;
            }
          }

          promises.push(this.doUpload(formData, metaData));
        }

        if (promises.length === this.files.length) {
          Promise.all(promises).then(res => {
            resolve(res);
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  public setModel(event: any) {
    this.document.documentNumber = event.target.value;
  }

  public edit(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.accountService.identity().subscribe(resAccount => {
        const promises: Array<any> = new Array<any>();
        const fileRes = [];
        const files: IDocumentNode[] = this.folder['files'];
        if (files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            const file: IDocumentNode = files[i];
            file.tags['id'] =
              this.view === 'add' ? this.generateUniqueRandomId(6, this.existingIds) : this.folder['files'][0]['tags']['id'];
            file.tags['docDate'] = new Date(this.document.documentDate);
            file.tags['docType'] = this.document.documentType;
            file.tags['docNo'] = this.document.documentNumber.replace('&', 'codeSpecialDan');
            file.tags['folder'] = this.document.documentNumber.replace('&', 'codeSpecialDan');
            file.tags['createdBy'] = resAccount.login;
            // console.log('ompuyy', file);
            this.storageService.update(this.bucket, file.tags, { key: file.key }).subscribe(res => {
              fileRes.push(res);
            });
          }
        }

        if (fileRes.length === files.length) {
          resolve(fileRes[0]);
        }
      });
    });
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

  // public setCertificateType() {
  //   this.partyCifService.getCertificate().subscribe(res => {
  //     this.certiFicateTypeName = res.body;
  //   });
  // }
  public getLovDocumentCollateralIDD() {
    this.documentTypeService
      .filterTableData({
        lvl2: true,

        page: 0,
        size: 9999,
        sort: ['id', 'asc'],
      })
      .subscribe(res => {
        if (this.collateralOrAppraisal === 'collateral') {
          this.certiFicateTypeName = lodash.filter(res.body, function (o) {
            return o.rootId === DOCUMENT_TYPE_APPRAISAL.DOCUMET_COLLATERAL_IDD && o.statusId === 'ACTIVE';
          });
          // console.log('idd', this.certiFicateTypeName);
        }
        if (this.collateralOrAppraisal === 'appraisal') {
          this.documentTypes = lodash.filter(res.body, function (o) {
            return o.rootId === DOCUMENT_TYPE_APPRAISAL.DOCUMENT_APPRAISAL && o.statusId === 'ACTIVE';
          });
        }
      });
  }

  // hideordisable() {
  //   if (this.object.statusId === STATUS.APPROVE) {
  //     return true;
  //   }
  //   return false;
  // }

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
}
