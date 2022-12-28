import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportUtilService } from 'app/shared/base/report-util.service';

import { StorageService } from 'app/entities/storage/storage.service';
@Component({
  selector: 'jhi-debtor-data-view-upload-slik',
  templateUrl: './debtor-data-view-upload-slik.component.html',
  styleUrls: ['./document.scss'],
})
export class DebtorDataViewUploadComponent {
  public folder: object;

  constructor(
    public storageService: StorageService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      data: any[];
    },
    public reportUtilService: ReportUtilService
  ) {
    this.folder = this.data;
  }

  public donwload(event: any) {
    this.reportUtilService.downloadFileBYName(event);
  }
}
