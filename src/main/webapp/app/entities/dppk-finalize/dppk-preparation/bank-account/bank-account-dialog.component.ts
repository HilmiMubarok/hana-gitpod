import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-bank-account-dialog',
  templateUrl: './bank-account-dialog.component.html',
  styleUrls: ['./bank-account-dialog.component.scss'],
})
export class BankAccountDialogComponent implements OnInit {
  public listOfValue = {
    accountName: ['hilmi', 'anjar', 'obet'],
    bankName: ['Bank Hilmi', 'Bank Anjar'],
    currencyList: ['IDR', 'USD'],
    accountType: ['Hutang', 'pelunasan'],
  };

  constructor(public dialog: MatDialog, private _dialog: MatDialogRef<BankAccountDialogComponent>) {}

  ngOnInit(): void {
    console.log('dialog');
  }

  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }

  public onSave() {
    this._dialog.close();
  }
}
