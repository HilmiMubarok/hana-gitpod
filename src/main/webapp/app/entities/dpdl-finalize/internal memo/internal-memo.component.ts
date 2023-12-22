import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StorageService } from 'app/entities/storage/storage.service';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { Observable, map } from 'rxjs';
import { DialogInternalMemoComponent } from './dialog/dialog-internal-memo.component';

@Component({
  selector: 'jhi-internal-memo',
  templateUrl: './internal-memo.component.html',
  styleUrls: ['../../party-cif/party-cif.style.scss'],
})
export class InternalMemoComponent {
  _internalMemo;
  @Input()
  get internalMemo() {
    return this._internalMemo;
  }
  set internalMemo(param) {
    this._internalMemo = param;
  }
  constructor(
    private storageService: StorageService,
    private dialog: MatDialog,
    // private accountService: AccountService,
    private router: Router,
    // private requestSlikValidateService: RequestSlikValidateService,
    private http: HttpClient,
    private reportUtilService: ReportUtilService
  ) {
    this.id = Number(this.router.url.split('/')[2]);
    this.getFiles(this.id);
  }

  data$: Observable<Object[]>;

  private bucket: string;
  private id: number;

  public displayedColumns: string[] = ['no', 'docName', 'memoDate', 'remarks', 'action'];

  // openDialog(mode: string, element) {
  //   const predicate: object = {
  //     width: '90vw',
  //     data: {
  //       bucket: this.bucket,
  //       // slikRequestId: this.id,
  //       mode,
  //       element,
  //       // requestSlik: this.requestSlik,
  //       fileData: element,
  //     },
  //   };

  //   const dialogRef = this.dialog.open(DialogInternalMemoComponent, predicate);
  //   dialogRef.afterClosed().subscribe(res => res && this.getFiles(this.id));
  // }

  private getFiles(id: number) {
    this.getBucket().then(() => {
      const predicate: Object = {
        key: `/internal-memo/${id}/document`,
      };
      this.data$ = this.storageService.getObjects(this.bucket, predicate).pipe(
        map(res => {
          //   this.requestSlikValidateService.setDocumentLength(res.body.length);
          // Decode doc Name and Name pada setiap objek
          res.body.forEach(obj => {
            if (obj['tags'] && obj['tags'].docName) {
              obj['tags'].docName = decodeURIComponent(obj['tags'].docName);
            }
            if (obj['name']) {
              obj['name'] = decodeURIComponent(obj['name']);
            }
          });
          return res.body;
        })
      );
    });
  }

  public delete(element): void {
    this.storageService
      .deleteFile(this.bucket, element.key)
      .toPromise()
      .then(() => {
        this.getFiles(this.id);
      });
  }
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
        internalMemoId: this.id,
        mode,
        element,
        internalMemo: this.internalMemo,
        fileData: element,
      },
    };

    const dialogRef = this.dialog.open(DialogInternalMemoComponent, predicate);
    dialogRef.afterClosed().subscribe(res => res && this.getFiles(this.id));
  }
}
