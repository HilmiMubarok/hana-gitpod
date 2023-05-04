import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from 'app/core/auth/account.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { map } from 'rxjs';

@Component({
  selector: 'jhi-document-request-slik-dialog',
  templateUrl: './document-request-slik-dialog.component.html',
})
export class DocumentRequestSlikDialogComponent {
  slikRequestId: number;
  document: any;
  docName: string;
  docDate: string;
  bucket: string;
  mode: string;
  element;
  userLogin: string;
  requestSlik;
  files: File[] = [];
  file = [];
  fileData;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      bucket: string;
      mode: string;
      element;
      slikRequestId: number;
      requestSlik;
      fileData;
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
    this.requestSlik = this.data.requestSlik;
    this.slikRequestId = this.data.slikRequestId;
    this.fileData = this.data.fileData;
    this.accountService
      .identity()
      .pipe(map(user => user.login))
      .subscribe(user => (this.userLogin = user));
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
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
      this.storageService.uploadMeta(this.bucket, formData, tags).subscribe(res => this._dialog.close(res));
    });
  }

  edit() {
    const file = this.data.fileData;
    const tags = {
      docName: this.docName,
      docDate: new Date(this.docDate).toISOString(),
    };
    this.storageService.update(this.bucket, tags, { key: file.key }).subscribe(res => this._dialog.close(res));
  }

  save(mode) {
    mode === 'edit' ? this.edit() : this.preSave();
  }
}
