import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ICollateralPrevious } from 'app/entities/credit-proposal/loan-facility/take-over/collateral/collateral-previous.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-loan-operation-take-over-collateral-before-dialog',
  templateUrl: './loan-operation-take-over-collateral-before-dialog.component.html',
  styleUrls: ['../../../credit-proposal/loan-facility/grid/loan.scss'],
})
export class LoanOperationTakeOverCollateralBeforeDialogComponent {
  @Input() isViewMode: Boolean = false;
  public creditProposal: ICreditProposal;
  view: boolean;
  parentPath: any;
  collateralPrevious: ICollateralPrevious;
  constructor(
    private dialog: MatDialog,
    public router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: ICreditProposal;
      collateralPrevious: ICollateralPrevious;
      view: boolean;
    },
    private _dialog: MatDialogRef<LoanOperationTakeOverCollateralBeforeDialogComponent>
  ) {
    if (data['view'] === false) {
      _dialog.disableClose = true;
      _dialog.backdropClick().subscribe(_ => {
        this.openCancelDialog();
      });
    }
    this.creditProposal = this.data.object;
    this.view = this.data.view;
    this.collateralPrevious = this.data.collateralPrevious;
    this.parentPath = this.router.url.split('/')[1];
  }
  public save(): void {
    this._dialog.close(this.collateralPrevious);
  }
  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }
  // cancel confrimation dialog
  public openCancelDialog(): void {
    this._dialog.close();
  }
}
