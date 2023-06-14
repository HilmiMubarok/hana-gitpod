import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HtmlEditorService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import {
  ICreditProposalCollateralInsurance,
  ICreditProposalCollateralBinding,
} from 'app/entities/credit-proposal/collateral-info/credit-proposal-collateral-info.model';
import { CreditProposalCollateralInfoDialogComponent } from 'app/entities/credit-proposal/collateral-info/dialog/credit-proposal-collateral-info-dialog.component';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';

import { Observable, of } from 'rxjs';
import { ICollateralPrevious } from './collateral-previous.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-credit-proposal-collateral-tab-loan-dialog',
  templateUrl: './credit-proposal-collateral-tab-loan-dialog.component.html',
  styleUrls: ['./collateral-info-dialog.css'],
  providers: [ToolbarService, HtmlEditorService],
})
export class CreditProposalCollateralTabLoanDialogComponent {
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
    private _dialog: MatDialogRef<CreditProposalCollateralTabLoanDialogComponent>
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
