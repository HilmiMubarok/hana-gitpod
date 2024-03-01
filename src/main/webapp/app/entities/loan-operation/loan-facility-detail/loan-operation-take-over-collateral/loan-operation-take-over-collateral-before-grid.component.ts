import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import {
  CollateralPrevious,
  ICollateralPrevious,
} from 'app/entities/credit-proposal/loan-facility/take-over/collateral/collateral-previous.model';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { LoanOperationTakeOverCollateralBeforeDialogComponent } from './loan-operation-take-over-collateral-before-dialog.component';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-loan-operation-take-over-collateral-before-grid',
  templateUrl: './loan-operation-take-over-collateral-before-grid.component.html',
  styleUrls: ['../../../credit-proposal/loan-facility/take-over/collateral/credit-proposal-collateral-tab-loan.style.scss'],
})
export class LoanOperationTakeOverCollateralBeforeGridComponent implements OnChanges {
  @Input() isViewMode: Boolean = false;
  public displayedColumns: string[] = ['no', 'collateralType', 'marketValue', 'liquidValue', 'action'];
  private _creditProposal: ICreditProposal;
  public loading: boolean;
  public dataColl = [];
  parentPath: any;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;
  }

  private loanApplication: ILoanApplication;
  constructor(public dialog: MatDialog, private loanApplicationService: LoanApplicationService, public router: Router) {
    this.loading = false;
    this.parentPath = this.router.url.split('/')[1];
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
    const dialogRef = this.dialog.open(LoanOperationTakeOverCollateralBeforeDialogComponent, predicate);
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
        title: 'Delete Collateral Detail Data',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const dataGrid = this.creditProposal.attributes['collateralPrevious'].filter(({ id }) => id !== element.id);
        this.creditProposal.attributes['collateralPrevious'] = dataGrid;
        this.creditProposal.attributes['collateralPrevious'] = dataGrid;
      }
    });
  }
}
