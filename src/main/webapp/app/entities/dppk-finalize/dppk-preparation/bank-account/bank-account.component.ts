import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BankAccountDialogComponent } from './bank-account-dialog.component';

@Component({
  selector: 'jhi-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss'],
})
export class BankAccountComponent implements OnInit {
  public dataSource = [];

  public displayColumns: string[] = ['no', 'accountType', 'currency', 'accountName', 'accountNumber', 'action'];

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    console.log('test bank account');
  }

  public openDialog() {
    const dialogRef = this.dialog.open(BankAccountDialogComponent, {
      width: '50vw',

      data: {},
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    });
  }
}
