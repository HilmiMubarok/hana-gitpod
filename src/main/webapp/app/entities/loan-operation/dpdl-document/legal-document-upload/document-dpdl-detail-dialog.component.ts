import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocumentNode } from 'app/entities/document-node/document-node.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { ReportUtilService } from 'app/shared/base/report-util.service';
@Component({
  selector: 'jhi-document-dpdl-detail-dialog-loan-operation',
  templateUrl: './document-dpdl-detail-dialog-loan-operation.component.html',
  styleUrls: ['../document.scss'],
})
export class DocumentDpdlDetailDialogLoanOperationComponent implements OnInit {
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

  public donwload(event: any, name: any) {
    this.reportUtilService.downloadFileBYName(event, name.name);
  }

  public convertDan(value: string): any {
    if (value !== null && value !== undefined) {
      return value.replace('codeSpecialDan', '&');
    } else {
      return '';
    }
  }

  public save(): void {
    const files: IDocumentNode[] = this.folder['files'];
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file: IDocumentNode = files[i];

        file.tags['docNo'] = 'hana bank';
        this.storageService.update(this.bucketName, file.tags, { key: file.key }).subscribe(res => {});
      }
    }
  }
}
