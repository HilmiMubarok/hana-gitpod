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
  // template: '<h1>Dialog</h1>',
})
export class DocumentRequestSlikDialogComponent implements OnDestroy {
  bucket: string;
  mode: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      bucket: string;
      mode: string;
    },
    private storageService: StorageService,
    private _dialog: MatDialogRef<DocumentRequestSlikDialogComponent>
  ) {
    this.bucket = this.data.bucket;
    this.mode = this.data.mode;
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
  }
}
