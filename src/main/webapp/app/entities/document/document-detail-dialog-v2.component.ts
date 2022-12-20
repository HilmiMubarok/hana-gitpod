import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { IDocumentNode } from '../document-node/document-node.model';
import { StorageService } from '../storage/storage.service';
@Component({
  selector: 'jhi-document-detail-dialog-v2',
  templateUrl: './document-detail-dialog-v2.component.html',
  styleUrls: ['./document.scss'],
})
export class DocumentDialogDialogV2Component implements OnInit {
  public folder: object;
  private bucketName: string;
  constructor(
    public storageService: StorageService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      folder: object;
    },
    public reportUtilService: ReportUtilService
  ) {
    this.folder = this.data;
  }

  ngOnInit(): void {
    this.getBucketName();
  }

  private getBucketName(): void {
    this.storageService.getBucketName().subscribe(res => {
      this.bucketName = res.body['bucket'];
    });
  }

  public donwload(event: any) {
    this.reportUtilService.downloadFileBYName(event);
  }

  public save(): void {
    const files: IDocumentNode[] = this.folder['files'];
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file: IDocumentNode = files[i];
        file.tags['docNo'] = 'hana bank';
        this.storageService.update(this.bucketName, file.tags, { key: file.key }).subscribe(res => {
          console.log('xxxxyyyy123', res.body);
        });
      }
    }
  }
}
