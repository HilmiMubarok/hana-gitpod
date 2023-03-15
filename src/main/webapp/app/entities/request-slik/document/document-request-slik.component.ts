import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'jhi-document-request-slik',
  templateUrl: './document-request-slik.component.html',
})
export class DocumentRequestSlikComponent implements OnDestroy {
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

  ngOnDestroy() {
    this.storageSubs.unsubscribe();
  }

  storageSubs: Subscription;
  private getBucket(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.storageSubs = this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve(res.body['bucket']);
      });
    });
  }

  // data$: Observable<any>;
  // private getFiles(id: number): void {
  //   const predicate: Object = {
  //     key: `/request-slik/${id}/document`,
  //   };

  //   this.data$ = this.storageService.getObjects(this.bucket, predicate);
  //   this.data$.pipe(map(res => console.log(res)))
  // }

  // public convertDan(value: string): any {
  //   if (value !== null && value !== undefined) {
  //     return value.replace('codeSpecialDan', '&');
  //   } else {
  //     return '';
  //   }
  // }

  // public edit(element: object) {
  //   const predicate: object = {
  //     width: '80vw',
  //     data: {
  //       collateral: null,
  //       appraisal: null,
  //       bucket: this.bucket,
  //       view: 'edit',
  //       obj: element,
  //     },
  //   };

  //   if (this.collateral) {
  //     predicate['data']['collateral'] = this.collateral;
  //   }

  //   if (this.appraisal) {
  //     predicate['data']['appraisal'] = this.appraisal;
  //   }

  //   predicate['data']['documents'] = this.documents;

  //   const dialogRef = this.dialog.open(DocumentUploadDialogComponent, predicate);
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (res) {
  //       if (this.collateral) {
  //         if (this.collateral.id) {
  //           this.getFiles('collateral', this.collateral.id);
  //         }
  //       }

  //       if (this.appraisal) {
  //         if (this.appraisal.id) {
  //           this.getFiles('appraisal', this.appraisal.id);
  //         }
  //       }
  //     }
  //   });
  // }

  // public view(object: object): void {
  //   const predicate: object = {
  //     width: '80vw',
  //     data: object,
  //   };

  //   const dialogRef = this.dialog.open(DocumentDialogDialogV2Component, predicate);
  //   dialogRef.afterClosed().subscribe();
  // }

  // dataKey: any;
  // public delete(element): void {
  //   for (let i = 0; i < element.files.length; i++) {
  //     if (this.collateral) {
  //       this.storageService.deleteFile(this.bucket, element.files[i].key).subscribe(data => {
  //         this.getBucket().then(() => {
  //           this.getFiles('collateral', this.collateral.id);
  //         });
  //       });
  //       this.dataKey = element;
  //     }

  //     if (this.appraisal) {
  //       this.storageService.deleteFile(this.bucket, element.files[i].key).subscribe(data => {
  //         this.getBucket().then(() => {
  //           this.getFiles('appraisal', this.appraisal.id);
  //         });
  //       });
  //       this.dataKey = element;
  //     }
  //   }
  // }

  // public openDialog(): void {
  //   const predicate: object = {
  //     width: '80vw',
  //     data: {
  //       collateral: null,
  //       appraisal: null,
  //       bucket: this.bucket,
  //       view: 'add',
  //     },
  //   };

  //   if (this.collateral) {
  //     predicate['data']['collateral'] = this.collateral;
  //   }

  //   if (this.appraisal) {
  //     predicate['data']['appraisal'] = this.appraisal;
  //   }

  //   predicate['data']['documents'] = this.documents;

  //   const dialogRef = this.dialog.open(DocumentUploadDialogComponent, predicate);
  //   dialogRef.afterClosed().subscribe(res => {
  //     if (res) {
  //       if (this.collateral) {
  //         if (this.collateral.id) {
  //           this.getFiles('collateral', this.collateral.id);
  //         }
  //       }

  //       if (this.appraisal) {
  //         if (this.appraisal.id) {
  //           this.getFiles('appraisal', this.appraisal.id);
  //         }
  //       }
  //     }
  //   });
  // }

  // private groupByFolder(param: Object[]): void {
  //   this.folders = [];
  //   if (param.length > 0) {
  //     this.folders = lodash
  //       .chain(param)
  //       .groupBy('tags.folder')
  //       .map((val, key) => ({
  //         folder: key,
  //         date: val[0]['tags']['docDate'],
  //         files: val,
  //         nameFile: val[0]['name'],
  //       }))
  //       .value();
  //     console.log('folder', this.folders);
  //   }
  // }

  // public documentCollateral(id: number) {
  //   console.log('document-collateral', id);
  //   this.storageService.getBucketName().subscribe(r => {
  //     const predicate: Object = {
  //       key: `/appraisals/${id}/document-colateral`,
  //     };

  //     this.storageService.getObjects(r.body['bucket'], predicate).subscribe(res => {
  //       console.log('appss', res.body);
  //       this.collateralAppraisalService.totalDataDocumentCollateral = res.body;
  //     });
  //   });
  // }

  // public collateralData(id: number) {
  //   this.storageService.getBucketName().subscribe(r => {
  //     const predicate: Object = {
  //       key: `/collateral/${id}/document`,
  //     };
  //     this.storageService.getObjects(r.body['bucket'], predicate).subscribe(res => {
  //       console.log('fasdsad', res.body);
  //       this.collateralAppraisalService.totalDataDocumentCollateral = res.body;
  //     });
  //   });
  // }

  // public documentLainnya(id: number) {
  //   console.log('document-lainnya', id);
  //   this.storageService.getBucketName().subscribe(r => {
  //     const predicate: Object = {
  //       key: `/appraisals/${id}/document-lainnya`,
  //     };
  //     this.storageService.getObjects(r.body['bucket'], predicate).subscribe(res => {
  //       console.log('apttt', res.body);
  //       this.collateralAppraisalService.totalDataDocumentLainya = res.body;
  //     });
  //   });
  // }

  // @Output() forwardTo = new EventEmitter();
  // public validateDocument() {
  //   this.forwardTo.emit(this.collateralAppraisalService.totalDataDocumentCollateral.length);
  // }

  // public isRm(): any {
  //   return this.account.authorities.includes('ROLE_RM');
  // }
  // private setMatrixInput() {
  //   if (this.isRm()) {
  //     if (this.account.authorities.length <= 2) {
  //       if (this.status !== STATUS.COMPLETE) {
  //         this.IfRmEnable = false;
  //       } else {
  //         this.IfRmEnable = true;
  //       }
  //     }
  //   } else {
  //     if (this.status === STATUS.COMPLETE || this.status === STATUS.APPROVE) {
  //       this.IfRmEnable = true;
  //     } else {
  //       this.IfRmEnable = false;
  //     }
  //   }
  // }
}

export interface IDocumentRequestSlik {
  id: number;
  docName: string;
  docDate: string;
}
