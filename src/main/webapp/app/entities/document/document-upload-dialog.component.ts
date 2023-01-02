import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  public documentTypes: any;
  public object: ICollateral | ICollateralAppraisal;
  public multiple: Boolean = false;
  public indeks = 0;

  private bucket: string;
  public certiFicateTypeName: any;
  public collateralView: boolean;

  public documents: string;
  public view: string;
  public folder: object;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      appraisal: ICollateralAppraisal;
      collateral: ICollateral;
      bucket: string;
      documents: string;
      view: string;
      obj: object;
    },
    private storageService: StorageService,
    private _dialog: MatDialogRef<DocumentUploadDialogComponent>,
    private _snackBar: MatSnackBar,
    private accountService: AccountService,
    public reportUtilService: ReportUtilService,
    protected partyCifService: PartyCifService
  ) {
    this.document = new Document();
    this.file = null;
    this.bucket = this.data.bucket;
    this.documents = this.data.documents;
    this.view = this.data.view;
    this.folder = this.data.obj;
    console.log('obj d', this.folder);
  }
  public collateralOrAppraisal: string;

  ngOnInit(): void {
    if (this.data.collateral) {
      this.collateralOrAppraisal = 'collateral';
      this.object = this.data.collateral;
      this.setCertificateType();
    }

    if (this.data.appraisal) {
      this.collateralOrAppraisal = 'appraisal';

      this.object = this.data.appraisal;
      this.documentTypes = Object(DOCUMENT_TYPE_APPRAISAL);
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

  public save(): void {
    if (this.files.length === 0) {
      this._snackBar.open('Choose file for upload', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
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
      this._snackBar.open('Masukan nomor dokumen', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    this.accountService.identity().subscribe(resAccount => {
      const promises: Array<any> = new Array<any>();
      for (let i = 0; i < this.files.length; i++) {
        const metaData = new DocumentMetaData();
        const files = this.files[i].name.replace('&', '');

        const currentDate = moment().format('YYYYMMDDHHMMSSMS');
        metaData.folder = this.document.documentNumber;
        metaData.docDate = this.document.documentDate;
        metaData.docNo = this.document.documentNumber;
        metaData.docType = this.document.documentType;
        metaData.createdDate = new Date();
        metaData.createdBy = resAccount.login;

        const formData = new FormData();
        formData.append('file', this.files[i]);
        if (this.data.collateral) {
          metaData.objectName = `/collateral/${this.data.collateral.id}/document/${this.document.documentNumber}/${currentDate}-${files}`;
          metaData.entityId = this.data.collateral.id;
        }

        if (this.data.appraisal) {
          if (this.documents === 'document-lainnya') {
            metaData.objectName = `/appraisals/${this.data.appraisal.id}/document-lainnya/${this.document.documentNumber}/${currentDate}-${files}`;
            metaData.entityId = this.data.appraisal.id;
          }
          if (this.documents === 'document-collateral') {
            metaData.objectName = `/appraisals/${this.data.appraisal.id}/document-colateral/${this.document.documentNumber}/${currentDate}-${files}`;
            metaData.entityId = this.data.appraisal.id;
          }
        }

        promises.push(this.doUpload(formData, metaData));
      }

      if (promises.length > 0) {
        Promise.all(promises).then(res => {
          this._dialog.close(res);
        });
      } else {
        this._dialog.close();
      }
    });
  }

  public edit(): void {
    if (!this.folder['date']) {
      this._snackBar.open('Pilih tanggal dokumen', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    if (!this.folder['files'][0]['tags']['docType']) {
      this._snackBar.open('Pilih dokumen jaminan', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    if (!this.folder['files'][0]['tags']['docNo']) {
      this._snackBar.open('Masukan nomor dokumen', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    this.accountService.identity().subscribe(resAccount => {
      const promises: Array<any> = new Array<any>();

      const files: IDocumentNode[] = this.folder['files'];
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file: IDocumentNode = files[i];
          file.tags['docDate'] = this.folder['files'][0]['tags']['docDate'];
          file.tags['docType'] = this.folder['files'][0]['tags']['docType'];
          file.tags['docNo'] = this.folder['files'][0]['tags']['docNo'];
          file.tags['folder'] = this.folder['files'][0]['tags']['docNo'];
          file.tags['createdBy'] = resAccount.login;
          this.storageService.update(this.bucket, file.tags, { key: file.key }).subscribe(res => {
            this._dialog.close(res);
          });
        }
      }
    });
  }

  public onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  public onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  public setCertificateType() {
    this.partyCifService.getCertificate().subscribe(res => {
      this.certiFicateTypeName = res.body;
    });
  }
  // hideordisable() {
  //   if (this.object.statusId === STATUS.APPROVE) {
  //     return true;
  //   }
  //   return false;
  // }
}
