import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'jhi-document',
  templateUrl: './document.component.html',
})
export class DocumentComponent implements OnChanges {
  @Input()
  public collateral: ICollateral;

  @Input()
  public appraisal: ICollateralAppraisal;

  public displayedColumns: string[] = ['no', 'docName', 'docDate', 'action'];
  public files: Object[];

  public folders: Object[];
  private bucket: string;
  constructor(
    private storageService: StorageService,
    private dialog: MatDialog,
    private collateralAppraisalService: CollateralAppraisalService
  ) {
    this.files = [];
    this.folders = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      this.getBucket().then(res => {
        this.getFiles('collateral', this.collateral.id);
      });
    }

    if (changes['appraisal']) {
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
    console.log('element data', element);
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
      },
    };

    if (this.collateral) {
      predicate['data']['collateral'] = this.collateral;
    }

    if (this.appraisal) {
      predicate['data']['appraisal'] = this.appraisal;
    }

    const dialogRef = this.dialog.open(DocumentUploadDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (this.collateral) {
          if (this.collateral.id) {
            this.getFiles('collateral', this.collateral.id);
            console.log('tambah collateral');
          }
        }

        if (this.appraisal) {
          if (this.appraisal.id) {
            this.getFiles('appraisal', this.appraisal.id);
            console.log('tambah lainnya');
          }
        }
      }
    });
  }

  private groupByFolder(param: Object[]): void {
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
      const predicate: Object = {
        key: `/appraisals/${id}/document`,
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
        this.groupByFolder(res.body);
        this.collateralAppraisalService.totalDataDocumentLainya = res.body;
      });
    }
  }

  public getFilesData(owner: string, id: number): void {
    if (owner === 'collateral') {
      this.storageService.getBucketName().subscribe(r => {
        const predicate: Object = {
          key: `/collateral/${id}/document`,
        };
        this.storageService.getObjects(r.body['bucket'], predicate).subscribe(res => {
          this.collateralAppraisalService.totalDataDocumentCollateral = res.body;
        });
      });
    } else {
      this.storageService.getBucketName().subscribe(r => {
        const predicate: Object = {
          key: `/appraisals/${id}/document`,
        };
        this.storageService.getObjects(r.body['bucket'], predicate).subscribe(res => {
          this.collateralAppraisalService.totalDataDocumentLainya = res.body;
        });
      });
    }
  }

  @Output() forwardTo = new EventEmitter();
  public validateDocument() {
    this.forwardTo.emit(this.collateralAppraisalService.totalDataDocumentCollateral.length);
  }
  gakbisa() {
    if (this.appraisal.statusId === STATUS.APPROVE) {
      return true;
    }
    return false;
  }
}
