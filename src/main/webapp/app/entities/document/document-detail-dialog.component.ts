import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-document-detail-dialog',
  templateUrl: './document-detail-dialog.component.html',
  styleUrls: ['./document.scss'],
})
export class DocumentDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { key: string; metaData: object; name: string; tags: object; url: string }) {
    console.log('xxx', this.data);
  }
}
