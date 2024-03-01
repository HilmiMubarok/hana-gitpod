import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IApplicationProductTakeOver } from 'app/entities/credit-proposal/loan-facility/application-product-take-over/application-product-take-over.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-loan-operation-take-over-facility-before-dialog',
  templateUrl: './loan-operation-take-over-facility-before-dialog.component.html',
  styleUrls: ['../../../credit-proposal/loan-facility/grid/loan.scss'],
})
export class LoanOperationTakeOverFacilityBeforeDialogComponent {
  public _creditProposal: ICreditProposal;
  public ccy: string;
  public periodTypeList: any = ['Week', 'Month', 'Year'];
  public currencyList: any = ['IDR', 'USD'];
  view: boolean;
  facilityTakeOver: IApplicationProductTakeOver;
  public parentPath: any;
  @Input() isViewMode: Boolean = false;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: ICreditProposal;
      facilityTakeOver: IApplicationProductTakeOver;
      view: boolean;
    },
    public router: Router,
    private _dialog: MatDialogRef<LoanOperationTakeOverFacilityBeforeDialogComponent>
  ) {
    if (data['view'] === false) {
      _dialog.disableClose = true;
      _dialog.backdropClick().subscribe(_ => {
        this.openCancelDialog();
      });
    }
    this.creditProposal = this.data.object;
    this.view = this.data.view;
    this.facilityTakeOver = this.data.facilityTakeOver;
    this.parentPath = this.router.url.split('/')[1];
  }
  public Onsave(): void {
    this._dialog.close(this.facilityTakeOver);
  }
  // cancel confrimation dialog
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
}
