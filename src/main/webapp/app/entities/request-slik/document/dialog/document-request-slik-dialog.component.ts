import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'jhi-document-request-slik-dialog',
  templateUrl: './document-request-slik-dialog.component.html',
})
export class DocumentRequestSlikDialogComponent implements OnDestroy {
  slikRequestId: number;
  document: any;
  docName: string;
  docDate: string;
  bucket: string;
  mode: string;
  element;
  userLogin: string;
  files: File[] = [];
  file = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      bucket: string;
      mode: string;
      element;
      slikRequestId: number;
    },
    private storageService: StorageService,
    private _dialog: MatDialogRef<DocumentRequestSlikDialogComponent>,
    private accountService: AccountService
  ) {
    this.bucket = this.data.bucket;
    this.mode = this.data.mode;
    this.docName = this.data.element && this.data.element.tags.docName;
    this.docDate = this.data.element && this.data.element.tags.docDate;
    this.element = this.data.element;
    this.document = this.element && this.element;
    this.slikRequestId = this.data.slikRequestId;
    this.accountService
      .identity()
      .pipe(map(user => user.login))
      .subscribe(user => (this.userLogin = user));
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  preSave() {
    this.files.forEach(file => {
      const tags = {
        docName: this.docName,
        objectName: `/request-slik/${this.slikRequestId}/document/${new Date().getTime().toString(36) + file.name}`,
        entityId: this.slikRequestId,
        docDate: new Date(this.docDate).toISOString(),
        createdBy: this.userLogin,
      };

      const formData = new FormData();
      formData.append('file', file);
      // console.log({
      //   file,
      //   formData,
      //   tags,
      // });
      this.storageService.uploadMeta(this.bucket, formData, tags).subscribe(res => this._dialog.close(res));
    });
    // return new Promise((resolve, reject) => {
    // resolve({
    //   tags,
    //   data: this.data,
    //   files: this.files,
    // });
    // });
  }

  save() {
    this.preSave();
    // console.log({
    //   doc: this.document,
    //   files: this.files,
    //   docName: this.docName,
    //   docDate: new Date(this.docDate),
    // });
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
  }
}
