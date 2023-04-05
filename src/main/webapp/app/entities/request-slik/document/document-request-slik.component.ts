import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { map, Observable, Subscription } from 'rxjs';
import { DocumentRequestSlikDialogComponent } from './dialog/document-request-slik-dialog.component';

@Component({
  selector: 'jhi-document-request-slik',
  templateUrl: './document-request-slik.component.html',
})
export class DocumentRequestSlikComponent {
  _requestSlik;
  @Input()
  get requestSlik() {
    return this._requestSlik;
  }
  set requestSlik(param) {
    this._requestSlik = param;
  }
  public displayedColumns: string[] = ['no', 'docName', 'docDate', 'action'];
  private bucket: string;
  private id: number;
  constructor(
    private storageService: StorageService,
    private dialog: MatDialog,
    private accountService: AccountService,
    private router: Router
  ) {
    this.id = Number(this.router.url.split('/')[2]);
    this.getFiles(this.id);
  }

  data$: Observable<Object[]>;
  private getFiles(id: number) {
    this.getBucket().then(() => {
      const predicate: Object = {
        key: `/request-slik/${id}/document`,
      };
      this.data$ = this.storageService.getObjects(this.bucket, predicate).pipe(map(res => res.body));
    });
  }

  storageSubs: Subscription;
  private getBucket(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve(res.body['bucket']);
      });
    });
  }

  openDialog(mode: string, element) {
    const predicate: object = {
      width: '90vw',
      data: {
        bucket: this.bucket,
        slikRequestId: this.id,
        mode,
        element,
        requestSlik: this.requestSlik,
        fileData: element,
      },
    };

    const dialogRef = this.dialog.open(DocumentRequestSlikDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => res && this.getFiles(this.id));
  }

  public delete(element): void {
    this.storageService
      .deleteFile(this.bucket, element.key)
      .toPromise()
      .then(() => {
        this.getFiles(this.id);
      });
  }
}
