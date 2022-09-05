import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { ICollateral } from '../collateral/collateral.model';
import { StorageService } from '../storage/storage.service';
import { DocumentDetailDialogComponent } from './document-detail-dialog.component';
import { DocumentUploadDialogComponent } from './document-upload-dialog.component';

@Component({
  selector: 'jhi-document',
  templateUrl: './document.component.html',
})
export class DocumentComponent implements OnChanges {
  @Input()
  public collateral: ICollateral;

  @Input()
  public appraisal: ICollateralAppraisal;

  public displayedColumns: string[] = ['no', 'docDate', 'docType', 'docNo', 'uploadDate', 'uploadBy', 'action'];
  public files: Object[];

  private bucket: string;
  constructor(private storageService: StorageService, private dialog: MatDialog) {
    this.files = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      this.getBucket().then(res => {
        this.getFiles('collateral', this.collateral.id);
      });
    }

    if (changes['appraisalId']) {
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

    const dialogRef = this.dialog.open(DocumentDetailDialogComponent, predicate);
    dialogRef.afterClosed().subscribe();
  }

  public delete(data: object): void {}

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
        if (this.collateral.id) {
          this.getFiles('collateral', this.collateral.id);
        }

        if (this.appraisal.id) {
          this.getFiles('appraisal', this.appraisal.id);
        }
      }
    });
  }

  private getFiles(owner: string, id: number): void {
    if (owner === 'collateral') {
      const predicate: Object = {
        key: `/collateral/${id}/document`,
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
        this.files = res.body;
      });
    }

    if (owner === 'appraisal') {
      const predicate: Object = {
        key: `/appraisal/${id}/document`,
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
        this.files = res.body;
      });
    }
  }
}
