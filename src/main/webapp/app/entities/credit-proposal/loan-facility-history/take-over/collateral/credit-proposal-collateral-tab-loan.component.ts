import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CollateralTabLoanDialogHistoryComponent } from './credit-proposal-collateral-tab-loan-dialog.component';
import { CollateralPrevious, ICollateralPrevious } from './collateral-previous.model';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-collateral-tab-loan-history',
  templateUrl: './credit-proposal-collateral-tab-loan.component.html',
  styleUrls: ['./collateral-info-dialog.css'],
})
export class CollateralTabLoanHistoryComponent implements OnChanges {
  public displayedColumns: string[] = ['no', 'collateralType', 'marketValue', 'liquidValue', 'action'];
  private _creditProposal: ICreditProposal;
  public loading: boolean;
  public dataColl = [];
  @Input() isViewLoan: Boolean = false;
  @Input() isViewMode: Boolean = false;

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
    const dialogRef = this.dialog.open(CollateralTabLoanDialogHistoryComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.creditProposal.attributes['collateralPrevious'] = [...this.creditProposal.attributes['collateralPrevious'], res];
      }
    });
  }
  // Delete Confirmation
  public onDelete(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Collateral Info',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const dataGrid = this.creditProposal.attributes['collateralPrevious'].filter(({ id }) => id !== element.id);
        this.creditProposal.attributes['collateralPrevious'] = dataGrid;
        this.creditProposal.attributes['collateralPrevious'] = dataGrid;
        console.log('Tes Delete', dataGrid);
      }
    });
  }

  // DELETE
  // public onDelete(element: ICreditProposal) {
  //   const dataGrid = this.creditProposal.attributes['collateralPrevious'].filter(({ id }) => id !== element.id);
  //   this.creditProposal.attributes['collateralPrevious'] = dataGrid;
  //   this.creditProposal.attributes['collateralPrevious'] = dataGrid;
  //   console.log('Tes Delete', dataGrid);
  // }
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
