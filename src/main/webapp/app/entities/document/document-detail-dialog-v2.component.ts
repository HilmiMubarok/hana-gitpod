import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    }
  ) {
    this.folder = this.data;
    console.log('xxx', this.folder);
  }
}
