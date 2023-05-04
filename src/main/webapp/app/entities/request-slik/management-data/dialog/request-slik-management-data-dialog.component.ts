import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-request-slik-management-data-dialog',
  templateUrl: './request-slik-management-data-dialog.component.html',
})
export class RequestSlikManagementDataDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      data: any;
    }
  ) {
    this.data = this.data.data;
  }
}
