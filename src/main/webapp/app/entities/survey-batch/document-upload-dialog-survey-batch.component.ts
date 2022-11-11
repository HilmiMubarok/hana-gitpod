import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
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
// import { Document, IDocument } from './document.model';
import moment from 'moment';
import { AccountService } from 'app/core/auth/account.service';
import { Document, IDocument } from '../document/document.model';
import { DocumentUploadDialogComponent } from '../document/document-upload-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';
import { ISurveyBatch } from './survey-batch.model';

@Component({
  selector: 'jhi-document-upload-dialog-survey-batch',
  templateUrl: './document-upload-dialog-survey-batch.component.html',
  styleUrls: ['./document-upload-dialog-survey-batch.scss'],
})
export class DocumentUploadDialogSurveyBatchComponent implements OnInit {
  public datas = [];
  public files: File[] = [];
  public file: File;
  public document: IDocument;
  public documentTypes: any;
  public object: ICollateral | ICollateralAppraisal;
  public multiple: Boolean = false;
  public indeks = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private storageService: StorageService,
    private _dialog: MatDialogRef<DocumentUploadDialogSurveyBatchComponent>,
    private _snackBar: MatSnackBar,
    private accountService: AccountService,
    protected http?: HttpClient
  ) {
    this.document = new Document();
    this.file = null;
  }

  ngOnInit(): void {
    console.log('this dialog', this.data.id);
  }

  protected convertDateFromServer(res: HttpResponse<ISurveyBatch>): HttpResponse<ISurveyBatch> {
    res.body.receivedDate = res.body.receivedDate != null ? new Date(res.body.receivedDate) : null;
    return res;
  }
  protected itemPreLoad(item: any): any {
    return item;
  }

  protected preLoadItem(res: HttpResponse<any>): HttpResponse<any> {
    this.itemPreLoad(res.body);
    return res;
  }

  update(entity: any, params?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(params);
    return this.http
      .post<any>('/services/report/api/report/upload-kjpp/' + this.data.id, entity, { observe: 'response', params: options })
      .pipe(map((res: HttpResponse<any>) => this.convertDateFromServer(res)))
      .pipe(map((res: HttpResponse<any>) => this.preLoadItem(res)));
  }

  public save(): void {
    console.log('this.files', this.files);
    let flag = 0;
    if (this.files.length === 0) {
      this._snackBar.open('Choose file for upload', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    for (let i = 0; i < this.files.length; i++) {
      const formData = new FormData();
      formData.append('file', this.files[i]);
      console.log('formData', formData);
      this.update(formData).subscribe(res => {
        console.log('res', res);
        flag++;
        if (flag === this.files.length) {
          this._snackBar.open('Upload Berhasil', null, {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
          });
          this._dialog.close();
        }
      });
    }
  }

  public onSelect(event: any) {
    console.log('event', event.addedFiles);
    this.files.push(...event.addedFiles);
  }

  public onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}
