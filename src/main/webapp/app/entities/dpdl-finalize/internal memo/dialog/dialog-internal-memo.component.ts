import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from 'app/core/auth/account.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { map } from 'rxjs';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-dialog-internal-memo',
  templateUrl: './dialog-internal-memo.component.html',
  styleUrls: ['./dialog.scss'],
})
export class DialogInternalMemoComponent {
  mode: string;
  internalMemoId: number;
  files: File[] = [];
  file = [];
  fileData;
  element;
  document: any;
  memoDate: Date;
  memoDatea: Date;
  bucket: string;
  userLogin: string;
  remarks: string;

  docName: string;

  public folder: object;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      bucket: string;
      mode: string;
      element;
      internalMemoId: number;
      requestSlik;
      fileData;
    },
    private storageService: StorageService,
    private _dialog: MatDialogRef<DialogInternalMemoComponent>,
    private accountService: AccountService,
    private reportUtilService: ReportUtilService,
    private messageService: MessageService
  ) {
    // const dataDoc: any = this.data.obj;
    this.docName = this.data.element && this.data.element.tags.docName;
    this.remarks = this.data.element && this.data.element.tags.remarks;
    this.element = this.data.element;
    this.memoDatea = this.data.element && new Date(this.data.element.tags.memoDatea);
    this.memoDate = new Date(this.memoDatea);

    console.log('date', this.memoDate);

    this.document = this.element && this.element;
    this.bucket = this.data.bucket;
    this.mode = this.data.mode;
    this.internalMemoId = this.data.internalMemoId;
    this.fileData = this.data.fileData;

    // this.folder = this.data.obj;
    // if (this.folder !== undefined) {
    //   this.folderFiles = this.folder['files'];
    // }

    //   public getField() {
    //     if (this.folder !== undefined) {
    //       this.document.documentDate = new Date(this.folder['files'][0]['tags']['docDate']);
    //       this.document.documentType = this.folder['files'][0]['tags']['docType'];
    //       this.document.documentNumber = this.folder['files'][0]['tags']['docNo'].replace('&', 'codeSpecialDan');
    //     }
    //   }
    this.accountService
      .identity()
      .pipe(map(user => user.login))
      .subscribe(user => (this.userLogin = user));
  }

  edit() {
    const file = this.data.fileData;
    const tags = {
      //  Encode Doc Name
      // objectName: `/internal-memo/${this.internalMemoId}/document/${new Date().getTime().toString(36) + encodeURIComponent(file.name)}`,
      docName: encodeURIComponent(this.docName),
      memoDatea: this.memoDatea,
      remarks: encodeURIComponent(this.remarks),
    };
    this.storageService.update(this.bucket, tags, { key: file.key }).subscribe(res => this._dialog.close(res));
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
    console.log(this.files);
    console.log(event);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  // public onRemove(event: any) {
  //   if (event.url === undefined) {
  //     this.files.splice(this.files.indexOf(event), 1);
  //   } else {
  //     this.folder['files'] = this.folder['files'].filter((data: any) => data.key !== event.key);

  //     this.removeFile.push(event.key);
  //   }
  // }
  public donwload(event: any, name: any) {
    this.reportUtilService.downloadFileBYName(event, name.name);
  }

  preSave() {
    this.files.forEach(file => {
      const tags = {
        // Encode File Name Doc Name and Name
        docName: encodeURIComponent(this.docName),
        objectName: `/internal-memo/${this.internalMemoId}/document/${new Date().getTime().toString(36) + encodeURIComponent(file.name)}`,
        entityId: this.internalMemoId,
        createdBy: this.userLogin,
        memoDatea: this.memoDatea,
        remarks: this.remarks,
      };
      const formData = new FormData();
      formData.append('file', file);
      this.storageService.uploadMeta(this.bucket, formData, tags).subscribe({
        next: res => this._dialog.close(res),
        error: err => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message }),
      });
    });
  }
  save(mode) {
    mode === 'edit' ? this.edit() : this.preSave();
  }
}
