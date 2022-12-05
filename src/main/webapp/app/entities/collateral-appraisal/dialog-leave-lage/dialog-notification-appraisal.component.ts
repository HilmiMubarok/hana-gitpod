import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-dialog-notification-appraisal',
  templateUrl: './dialog-notification-appraisal.component.html',
})
export class DialogNotificationAppraisalComponent {
  constructor(public dialogRef: MatDialogRef<DialogNotificationAppraisalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  close(s: any): void {
    this.dialogRef.close({ s });
  }
}
