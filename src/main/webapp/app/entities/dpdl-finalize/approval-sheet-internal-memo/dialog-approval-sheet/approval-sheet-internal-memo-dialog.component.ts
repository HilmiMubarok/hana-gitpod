import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'jhi-approval-sheet-internal-memo-dialog',
  templateUrl: './approval-sheet-internal-memo-dialog.component.html',
  styleUrls: ['../approval-sheet.css'],
})
export class ApprovalSheetInternalMemoDialogComponent {
  constructor(public dialogRef: MatDialogRef<ApprovalSheetInternalMemoDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
