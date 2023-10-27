import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'jhi-review-history-dialog',
  templateUrl: './revew-history-dialog.component.html',
  styleUrls: ['../credit-agreement.css'],
})
export class ReviewHistoryDialogComponent {
  constructor(public dialogRef: MatDialogRef<ReviewHistoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {}
}
