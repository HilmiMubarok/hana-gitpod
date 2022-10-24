import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { MatDialog } from '@angular/material/dialog';

import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { CreditProposalCollateralTabLoanDialogComponent } from './credit-proposal-collateral-tab-loan-dialog.component';
import {
  ICreditProposalCollateralBinding,
  ICreditProposalCollateralInsurance,
  CreditProposalCollateralInsurance,
  CreditProposalCollateralBinding,
} from 'app/entities/credit-proposal/collateral-info/credit-proposal-collateral-info.model';
import { CollateralPrevious, ICollateralPrevious } from './collateral-previous.model';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';

@Component({
  selector: 'jhi-credit-proposal-collateral-tab-loan',
  templateUrl: './credit-proposal-collateral-tab-loan.component.html',
})
export class CreditProposalCollateralTabLoanComponent implements OnChanges {
  public displayedColumns: string[] = ['no', 'collateralType', 'marketValue', 'liquidValue', 'action'];
  private _creditProposal: ICreditProposal;
  public loading: boolean;
  public dataColl = [];
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;
    console.log('get-setter', this.creditProposal);
  }

  private loanApplication: ILoanApplication;
  constructor(public dialog: MatDialog, private loanApplicationService: LoanApplicationService) {
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      this.getLoanApplication();
    }
  }

  private getLoanApplication(): void {
    this.loanApplicationService.find(this.creditProposal.id).subscribe(res => {
      this.loanApplication = res.body;
    });
  }

  // Add And Detail
  public openDialog(element: ICollateralPrevious = null): void {
    const predicate = { width: '80vw', data: { object: this.creditProposal } };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['collateralPrevious'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['collateralPrevious'] = new CollateralPrevious();
    }
    const dialogRef = this.dialog.open(CreditProposalCollateralTabLoanDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.creditProposal.attributes['collateralPrevious'] = [...this.creditProposal.attributes['collateralPrevious'], res];
      }
    });
  }
  // DELETE
  public onDelete(element: ICreditProposal) {
    const dataGrid = this.creditProposal.attributes['collateralPrevious'].filter(({ id }) => id !== element.id);
    this.creditProposal.attributes['collateralPrevious'] = dataGrid;
    this.creditProposal.attributes['collateralPrevious'] = dataGrid;
    console.log('Tes Delete', dataGrid);
  }
}
// public openDialog(element: ICollateralPrevious): void {
//   // console.log('bab', this.creditProposal);
//   const predicate: object = {
//     width: '80vw',
//     data: {
//       collateral: element,
//     },
//   };
//   const dialogRef = this.dialog.open(CreditProposalCollateralTabLoanDialogComponent, predicate);
//   dialogRef.afterClosed().subscribe(res => {
//       this.creditProposal.attributes['collateralPrevious'] = [...this.creditProposal.attributes['collateralPrevious'], res];
//   });
// }
