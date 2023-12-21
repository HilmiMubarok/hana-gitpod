import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-binding-value-information-dialog',
  templateUrl: './binding-value-information-dialog.component.html',
  styleUrls: ['./binding-value-information-dialog.component.scss'],
})
export class BindingValueInformationDialogComponent implements OnInit {
  public dataCollateral: ICollateral;
  public creditProposal: ICreditProposal;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: ICollateral;
      creditProposaldata: ICreditProposal;
    },
    private dialog: MatDialog,
    private _dialog: MatDialogRef<BindingValueInformationDialogComponent>
  ) {
    this.dataCollateral = data.item;
    this.creditProposal = data.creditProposaldata;
  }

  ngOnInit(): void {
    console.log('test', this.dataCollateral);
  }

  public save() {
    console.log('test save');
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
        this._dialog.close({
          item: this.dataCollateral,
        });
      }
    });
  }
}
