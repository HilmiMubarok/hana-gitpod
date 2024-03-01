import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IApplicationProductTakeOver } from 'app/entities/credit-proposal/loan-facility/application-product-take-over/application-product-take-over.model';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { LoanOperationTakeOverFacilityAfterDialogComponent } from './loan-operation-take-over-facility-after-dialog.component';
import { ApplicationProductTakeOverBank } from 'app/entities/credit-proposal/loan-facility/application-product-take-over-after-bank/application-product-take-over-after-bank.model';

@Component({
  selector: 'jhi-loan-operation-take-over-facility-after-grid',
  templateUrl: './loan-operation-take-over-facility-after-grid.component.html',
  styleUrls: ['../../../credit-proposal/loan-facility/take-over/collateral/credit-proposal-collateral-tab-loan.style.scss'],
})
export class LoanOperationTakeOverFacilityAfterGridComponent implements OnChanges {
  @Input() isViewMode: Boolean = false;
  private _creditProposal: ICreditProposal;
  parentPath: any;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public displayColumns: string[] = ['no', 'facilityType1', 'changes', 'outstanding', 'tenor', 'action'];

  public numericFormatOptions: Object;
  public loading: boolean;
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
  public openDialog(element: IApplicationProductTakeOver = null): void {
    const predicate = { width: '80vw', data: { object: this.creditProposal, creditProposaldata: this.creditProposal } };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['facilityTakeOverAfterBank'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['facilityTakeOverAfterBank'] = new ApplicationProductTakeOverBank();
    }
    const dialogRef = this.dialog.open(LoanOperationTakeOverFacilityAfterDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loanApplication.attributes['facilityTakeOverAfterBank'] = [
          ...this.creditProposal.attributes['facilityTakeOverAfterBank'],
          res,
        ];
        this.creditProposal.attributes['facilityTakeOverAfterBank'] = [...this.creditProposal.attributes['facilityTakeOverAfterBank'], res];
      }
    });
  }
  // Delete Confirmation
  public onDelete(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Take Over After Data',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const dataGridTakeOver = this.creditProposal.attributes['facilityTakeOverAfterBank'].filter(({ id }) => id !== element.id);
        // const dataGridTakeOver = this.creditProposal.attributes['facilityTakeOverAfterBank'];
        if (dataGridTakeOver === undefined) {
          return dataGridTakeOver.length;
        }

        this.creditProposal.attributes['facilityTakeOverAfterBank'] = dataGridTakeOver;
        this.creditProposal.attributes['facilityTakeOverAfterBank'] = dataGridTakeOver;
      }
    });
  }

  public getCurrencyType(element) {
    if (element !== null) {
      return element;
    }
    return '';
  }
}
