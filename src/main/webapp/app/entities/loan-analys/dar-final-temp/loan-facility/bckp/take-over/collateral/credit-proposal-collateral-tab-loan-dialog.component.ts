import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

@Component({
  selector: 'jhi-credit-proposal-collateral-tab-loan-dialog',
  templateUrl: './credit-proposal-collateral-tab-loan-dialog.component.html',
  styleUrls: ['./collateral-info-dialog.css'],
  providers: [ToolbarService, HtmlEditorService],
})
export class CreditProposalCollateralTabLoanDialogComponent {
  public creditProposal: ICreditProposal;
  view: boolean;
  collateralPrevious: ICollateralPrevious;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      object: ICreditProposal;
      collateralPrevious: ICollateralPrevious;
      view: boolean;
    },
    private _dialog: MatDialogRef<CreditProposalCollateralTabLoanDialogComponent>
  ) {
    this.creditProposal = this.data.object;
    this.view = this.data.view;
    this.collateralPrevious = this.data.collateralPrevious;
  }
  public save(): void {
    this._dialog.close(this.collateralPrevious);
  }
  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }
}
