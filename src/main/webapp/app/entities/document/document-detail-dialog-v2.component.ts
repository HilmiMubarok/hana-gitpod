import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportUtilService } from 'app/shared/base/report-util.service';
@Component({
  selector: 'jhi-document-detail-dialog-v2',
  templateUrl: './document-detail-dialog-v2.component.html',
  styleUrls: ['./document.scss'],
})
export class DocumentDialogDialogV2Component {
  public folder: object;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      folder: object;
    },
    public reportUtilService: ReportUtilService
  ) {
    this.folder = this.data;
  }

  public donwload(event: any) {
    this.reportUtilService.viewFile(event);
  }
}
