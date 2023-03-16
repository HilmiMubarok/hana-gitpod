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
  document: any;
  docName: string;
  docDate: string;
  bucket: string;
  mode: string;
  element;
  files: File[] = [];
  file = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      bucket: string;
      mode: string;
      element;
    },
    private storageService: StorageService,
    private _dialog: MatDialogRef<DocumentRequestSlikDialogComponent>
  ) {
    this.bucket = this.data.bucket;
    this.mode = this.data.mode;
    this.element = this.data.element;
    this.document = this.element && this.element;
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  save() {
    console.log({
      doc: this.document,
      files: this.files,
      docName: this.docName,
      docDate: new Date(this.docDate),
    });
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
  }
}
