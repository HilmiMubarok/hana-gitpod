import { Component, Inject, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-credit-proposal-dialog-borrower',
  templateUrl: './credit-proposal-dialog-borrower.component.html',
  styleUrls: ['./credit-proposal-dialog-borrower.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogBorrowerComponent {
  item: any;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: any;
    }
  ) {
    this.item = this.data.item;
  }
}
