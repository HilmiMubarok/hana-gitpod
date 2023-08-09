import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { DocumentRequestSlikDialogComponent } from './dialog/document-request-slik-dialog.component';
import { RequestSlikValidateService } from '../services/request-slik-validate.service';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { RequestSlikStatus } from '../enums/request-slik-status.enum';
import JSZip from 'jszip';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'jhi-document-request-slik',
  templateUrl: './document-request-slik.component.html',
  styleUrls: ['./document-request-slik.styles.scss', '../../party-cif/party-cif.style.scss'],
})
export class DocumentRequestSlikComponent {
  reqSlikStatus = RequestSlikStatus;
  _requestSlik;
  @Input()
  get requestSlik() {
    return this._requestSlik;
  }
  set requestSlik(param) {
    this._requestSlik = param;
  }
  public displayedColumns: string[] = ['no', 'docName', 'action'];
  private bucket: string;
  private id: number;
  constructor(
    private storageService: StorageService,
    private dialog: MatDialog,
    private accountService: AccountService,
    private router: Router,
    private requestSlikValidateService: RequestSlikValidateService,
    private http: HttpClient,
    private reportUtilService: ReportUtilService
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
      this.data$ = this.storageService.getObjects(this.bucket, predicate).pipe(
        map(res => {
          this.requestSlikValidateService.setDocumentLength(res.body.length);
          return res.body;
        })
      );
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

  downloadAllLabel = 'Download All';
  downloadAll() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '40vw',
      data: {
        title: 'Delete All Files',
        message: `Are you sure want to download all files?. This action cannot be undone.`,
      },
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (this.data$) {
          this.downloadAllLabel = 'Downloading...';

          this.data$.subscribe(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async res => {
              this.downloadAllLabel = `Downloading... ${res.length} files`;

              let downlaodedFiles = 1;
              const promises = res.map(async element => {
                const response = await this.http.get(element['url'], { responseType: 'blob' }).toPromise();
                saveAs(response, element['name']);
                this.downloadAllLabel = `Downloading... ${downlaodedFiles++}/${res.length}`;
              });

              await Promise.all(promises);

              this.downloadAllLabel = 'Download All';
            },
            () => {
              this.downloadAllLabel = 'Download All';
            }
          );
        }
      }
    });
  }

  datePipe: DatePipe = new DatePipe('en-US');

  isLoading: Boolean = false;

  download() {
    if (this.data$) {
      this.isLoading = true;
      this.data$.subscribe(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async data => {
          const zip = new JSZip();
          const downloadPromises = data.map(async file => {
            try {
              const nameFile = file['name'];
              const fileContent = await fetch(file['url']).then(res => res.arrayBuffer());
              zip.file(nameFile, fileContent);
            } catch (error) {
              console.error(`Error downloading file ${file['name']}:`, error);
            }
          });

          await Promise.all(downloadPromises);

          const content = await zip.generateAsync({ type: 'blob' });
          const url = URL.createObjectURL(content);
          const link = document.createElement('a');
          link.href = url;
          link.download = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-' + 'file-donwload.zip';
          link.click();
          URL.revokeObjectURL(url);
        },
        () => {
          this.isLoading = false;
          this.downloadAllLabel = 'Download All';
        }
      );
    }
  }
}
