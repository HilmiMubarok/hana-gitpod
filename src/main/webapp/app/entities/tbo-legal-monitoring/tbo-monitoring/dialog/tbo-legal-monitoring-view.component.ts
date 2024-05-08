import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocumentNode } from 'app/entities/document-node/document-node.model';
import { StorageService } from 'app/entities/storage/storage.service';
import { ReportUtilService } from 'app/shared/base/report-util.service';
@Component({
  selector: 'jhi-tbo-legal-monitoring-view',
  templateUrl: './tbo-legal-monitoring-view.component.html',
  styleUrls: ['../tbo-legal-monitoring.style.scss'],
})
export class TboLegalMonitoringViewComponent implements OnInit {
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

  changeCharacter(inputString: string): string {
    if (typeof inputString === 'string') {
      // Replace '&' with a specific letter, for example 'X'
      return inputString.replace(/&/g, 'dan');
    }
    return inputString;
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
