import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { CollateralAppraisalService } from '../collateral-appraisal/collateral-appraisal.service';
import { ICollateral } from '../collateral/collateral.model';
import { StorageService } from '../storage/storage.service';
import { DocumentDetailDialogComponent } from './document-detail-dialog.component';
import { DocumentUploadDialogComponent } from './document-upload-dialog.component';
import lodash from 'lodash';
import { DocumentDialogDialogV2Component } from './document-detail-dialog-v2.component';
import { STATUS } from 'app/shared/constants/status.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-document',
  templateUrl: './document.component.html',
})
export class DocumentComponent implements OnChanges, OnInit {
  @Input()
  public collateral: ICollateral;

  @Input()
  public appraisal: ICollateralAppraisal;

  @Input()
  public document: ICollateralAppraisal;

  @Input()
  public status: string;
  public displayedColumns: string[] = ['no', 'docName', 'docDate', 'action'];
  public files: Object[];
  public documents: string;
  public account: Account;
  public folders: Object[];
  private bucket: string;
  public IfRmEnable: boolean;
  constructor(
    private storageService: StorageService,
    private dialog: MatDialog,
    private collateralAppraisalService: CollateralAppraisalService,
    private accountService: AccountService
  ) {
    this.files = [];
    this.folders = [];
  }
  ngOnInit(): void {
    this.checkLogin();
    this.hideordisable();
    this.setMatrixInput();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      this.getBucket().then(res => {
        this.getFiles('collateral', this.collateral.id);
      });
    }

    if (changes['appraisal']) {
      if (changes.document.currentValue === 'document-lainnya') {
        this.documents = 'document-lainnya';
      }

      if (changes.document.currentValue === 'document-collateral') {
        this.documents = 'document-collateral';
      }
      this.getBucket().then(res => {
        this.getFiles('appraisal', this.appraisal.id);
      });
    }
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  public edit(element: object) {
    const predicate: object = {
      width: '80vw',
      data: {
        collateral: null,
        appraisal: null,
        bucket: this.bucket,
        view: 'edit',
        obj: element,
      },
    };

    if (this.collateral) {
      predicate['data']['collateral'] = this.collateral;
    }

    if (this.appraisal) {
      predicate['data']['appraisal'] = this.appraisal;
    }

    predicate['data']['documents'] = this.documents;

    const dialogRef = this.dialog.open(DocumentUploadDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (this.collateral) {
          if (this.collateral.id) {
            this.getFiles('collateral', this.collateral.id);
          }
        }

        if (this.appraisal) {
          if (this.appraisal.id) {
            this.getFiles('appraisal', this.appraisal.id);
          }
        }
      }
    });
  }

  public view(object: object): void {
    const predicate: object = {
      width: '80vw',
      data: object,
    };

    const dialogRef = this.dialog.open(DocumentDialogDialogV2Component, predicate);
    dialogRef.afterClosed().subscribe();
  }

  dataKey: any;
  public delete(element): void {
    for (let i = 0; i < element.files.length; i++) {
      if (this.collateral) {
        this.storageService.deleteFile(this.bucket, element.files[i].key).subscribe(data => {
          this.getBucket().then(() => {
            this.getFiles('collateral', this.collateral.id);
          });
        });
        this.dataKey = element;
      }

      if (this.appraisal) {
        this.storageService.deleteFile(this.bucket, element.files[i].key).subscribe(data => {
          this.getBucket().then(() => {
            this.getFiles('appraisal', this.appraisal.id);
          });
        });
        this.dataKey = element;
      }
    }
  }

  public openDialog(): void {
    const predicate: object = {
      width: '80vw',
      data: {
        collateral: null,
        appraisal: null,
        bucket: this.bucket,
        view: 'add',
      },
    };

    if (this.collateral) {
      predicate['data']['collateral'] = this.collateral;
    }

    if (this.appraisal) {
      predicate['data']['appraisal'] = this.appraisal;
    }

    predicate['data']['documents'] = this.documents;

    const dialogRef = this.dialog.open(DocumentUploadDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (this.collateral) {
          if (this.collateral.id) {
            this.getFiles('collateral', this.collateral.id);
          }
        }

        if (this.appraisal) {
          if (this.appraisal.id) {
            this.getFiles('appraisal', this.appraisal.id);
          }
        }
      }
    });
  }

  private groupByFolder(param: Object[]): void {
    this.folders = [];
    if (param.length > 0) {
      this.folders = lodash
        .chain(param)
        .groupBy('tags.folder')
        .map((val, key) => ({
          folder: key,
          date: val[0]['tags']['docDate'],
          files: val,
        }))
        .value();
    }
  }

  private getFiles(owner: string, id: number): void {
    if (owner === 'collateral') {
      const predicate: Object = {
        key: `/collateral/${id}/document`,
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
        this.groupByFolder(res.body);
        this.collateralAppraisalService.totalDataDocumentCollateral = res.body;
      });
    }

    if (owner === 'appraisal') {
      if (this.documents === 'document-collateral') {
        const predicate: Object = {
          key: `/appraisals/${id}/document-colateral`,
        };
        this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
          this.groupByFolder(res.body);

          this.collateralAppraisalService.totalDataDocumentCollateral = res.body;
        });
      }
      if (this.documents === 'document-lainnya') {
        const predicate: Object = {
          key: `/appraisals/${id}/document-lainnya`,
        };
        this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
          this.groupByFolder(res.body);
          this.collateralAppraisalService.totalDataDocumentLainya = res.body;
        });
      }
    }
  }

  public documentCollateral(id: number) {
    console.log('document-collateral', id);
    this.storageService.getBucketName().subscribe(r => {
      const predicate: Object = {
        key: `/appraisals/${id}/document-colateral`,
      };

      this.storageService.getObjects(r.body['bucket'], predicate).subscribe(res => {
        console.log('appss', res.body);
        this.collateralAppraisalService.totalDataDocumentCollateral = res.body;
      });
    });
  }

  public collateralData(id: number) {
    this.storageService.getBucketName().subscribe(r => {
      const predicate: Object = {
        key: `/collateral/${id}/document`,
      };
      this.storageService.getObjects(r.body['bucket'], predicate).subscribe(res => {
        console.log('fasdsad', res.body);
        this.collateralAppraisalService.totalDataDocumentCollateral = res.body;
      });
    });
  }

  public documentLainnya(id: number) {
    console.log('document-lainnya', id);
    this.storageService.getBucketName().subscribe(r => {
      const predicate: Object = {
        key: `/appraisals/${id}/document-lainnya`,
      };
      this.storageService.getObjects(r.body['bucket'], predicate).subscribe(res => {
        console.log('apttt', res.body);
        this.collateralAppraisalService.totalDataDocumentLainya = res.body;
      });
    });
  }

  @Output() forwardTo = new EventEmitter();
  public validateDocument() {
    this.forwardTo.emit(this.collateralAppraisalService.totalDataDocumentCollateral.length);
  }
  hideordisable() {
    if (this.status === STATUS.COMPLETE || this.status === STATUS.APPROVE) {
      this.IfRmEnable = true;
    } else {
      this.IfRmEnable = false;
    }
  }
  private checkLogin() {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
      }
    });
  }

  public isRm(): any {
    return this.account.authorities.includes('ROLE_RM');
  }
  private setMatrixInput() {
    if (this.isRm()) {
      if (this.account.authorities.length <= 2) {
        if (this.status !== STATUS.COMPLETE) {
          this.IfRmEnable = false;
        } else {
          this.IfRmEnable = true;
        }
      }
    }
  }
}
