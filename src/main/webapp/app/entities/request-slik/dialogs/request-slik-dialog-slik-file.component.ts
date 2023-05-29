import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { Observable, Subscription, map } from 'rxjs';

@Component({
  selector: 'jhi-request-slik-dialog-slik-file',
  templateUrl: './request-slik-dialog-slik-file.component.html',
  styleUrls: ['./slik-file-dialog.css'],
})
export class RequestSlikDialogSlikFileComponent {
  public displayedColumns: string[] = ['no', 'filename', 'action'];
  private bucket: string;
  isLoading = true;
  public requestReffId: string;
  fileName;
  constructor(private storageService: StorageService, private router: Router, @Inject(MAT_DIALOG_DATA) public data) {
    this.requestReffId = this.data.reqReffId;
    this.fileName = this.data.fileName;
    this.getFiles(this.requestReffId);
    console.log('ADASDSAddddd', this.data$);
  }

  data$: Observable<Object[]>;
  private getFiles(id: string) {
    this.getBucket().then(() => {
      const predicate: Object = {
        key: `/party_slik/cbas/${id}`,
        // key: `/party_slik/00000604`,
      };
      this.data$ = this.storageService
        .getObjects(this.bucket, predicate)
        .pipe(map(res => res.body))
        .pipe(map(data => data.filter(item => item['name'].includes(this.fileName))));

      this.data$.subscribe(
        () => {},
        () => {},
        () => {
          this.isLoading = false;
        }
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

  downloadFile(file: any): void {
    // Implement your file download logic here
    window.open(file.url, '_blank');

    console.log('Downloading file:', file.name);
  }
}
