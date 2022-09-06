import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  DOCUMENT_TYPE_COLLATERAL_MACHINE,
  DOCUMENT_TYPE_COLLATERAL_PROPERTY,
  DOCUMENT_TYPE_COLLATERAL_VEHICLE,
  DOCUMENT_TYPE_APPRAISAL,
} from 'app/shared/constants/base.constants';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { ICollateral } from '../collateral/collateral.model';
import { StorageService } from '../storage/storage.service';
import { Document, IDocument } from './document.model';
import moment from 'moment';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-document-upload-dialog',
  templateUrl: './document-upload-dialog.component.html',
  styleUrls: ['./document.scss'],
})
export class DocumentUploadDialogComponent implements OnInit {
  public file: File;
  public document: IDocument;
  public documentTypes: any;
  public object: ICollateral | ICollateralAppraisal;
  public multiple: Boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { appraisal: ICollateralAppraisal; collateral: ICollateral; bucket: string },
    private storageService: StorageService,
    private _dialog: MatDialogRef<DocumentUploadDialogComponent>,
    private _snackBar: MatSnackBar,
    private accountService: AccountService
  ) {
    this.document = new Document();
    this.file = null;
  }

  ngOnInit(): void {
    if (this.data.collateral) {
      this.object = this.data.collateral;
      if (this.object.collateralTypeId === 'VEHICLE') {
        this.documentTypes = Object.keys(DOCUMENT_TYPE_COLLATERAL_VEHICLE);
      } else if (this.object.collateralTypeId === 'PROPERTY' || this.object.collateralTypeId === 'REALESTATE') {
        this.documentTypes = Object.keys(DOCUMENT_TYPE_COLLATERAL_PROPERTY);
      } else if (this.object.collateralTypeId === 'MACHINE') {
        this.documentTypes = Object.keys(DOCUMENT_TYPE_COLLATERAL_MACHINE);
      }
    }

    if (this.data.appraisal) {
      this.object = this.data.appraisal;
      this.documentTypes = Object(DOCUMENT_TYPE_APPRAISAL);
    }
  }

  public save(): void {
    if (!this.file) {
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

    const metaData = { objectName: null, entityId: null, docType: null, docDate: null, docNo: null, createdDate: null, createdBy: null };
    const currentDate = moment().format('YYYYMMDDHHMMSSMS');
    if (this.data.collateral) {
      metaData.objectName = `/collateral/${this.data.collateral.id}/document/${currentDate}-${this.file.name}`;
      metaData.entityId = this.data.collateral.id;
    }

    if (this.data.appraisal) {
      metaData.objectName = `/appraisals/${this.data.appraisal.id}/document/${currentDate}-${this.file.name}`;
      metaData.entityId = this.data.appraisal.id;
    }

    metaData.docDate = this.document.documentDate;
    metaData.docNo = this.document.documentNumber;
    metaData.docType = this.document.documentType;
    metaData.createdDate = new Date();

    const formData = new FormData();
    formData.append('file', this.file);

    this.accountService.identity().subscribe(resAccount => {
      metaData.createdBy = resAccount.login;
      this.storageService.uploadMeta(this.data.bucket, formData, metaData).subscribe(res => {
        this._dialog.close(res.body);
      });
    });
  }

  public onSelect(event: any) {
    this.file = event['addedFiles'][0];
  }

  public onRemove(event: any) {
    this.file = null;
  }
}
