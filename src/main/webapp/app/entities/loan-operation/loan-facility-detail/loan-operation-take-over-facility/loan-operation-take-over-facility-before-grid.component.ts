import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import {
  ApplicationProductTakeOver,
  IApplicationProductTakeOver,
} from 'app/entities/credit-proposal/loan-facility/application-product-take-over/application-product-take-over.model';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { LoanOperationTakeOverFacilityBeforeDialogComponent } from './loan-operation-take-over-facility-before-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-loan-operation-take-over-facility-before-grid',
  templateUrl: './loan-operation-take-over-facility-before-grid.component.html',
  styleUrls: ['../../../credit-proposal/loan-facility/take-over/collateral/credit-proposal-collateral-tab-loan.style.scss'],
})
export class LoanOperationTakeOverFacilityGridBeforeGridComponent implements OnChanges {
  @Input() isViewMode;
  private _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public visibleDialog: boolean;
  public applicationProduct: IApplicationProduct;
  public collaterallInfo: any;
  public collateralProductRelations: any;
  public creditProposaldata: any;

  public displayColumns: string[] = ['no', 'facilityType1', 'changes', 'outstanding', 'tenor', 'action'];

  public stateOfAction?: string;
  public format = { format: 'R$ #. ## 0,00' };
  public numericFormatOptions: Object;
  public loading: boolean;
  public cloneData: any;
  public parentPath: any;

  // dataData: any;

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
    const predicate = { width: '80vw', data: { object: this.creditProposal } };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['facilityTakeOver'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['facilityTakeOver'] = new ApplicationProductTakeOver();
    }
    const dialogRef = this.dialog.open(LoanOperationTakeOverFacilityBeforeDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loanApplication.attributes['facilityTakeOver'] = [...this.creditProposal.attributes['facilityTakeOver'], res];
        this.creditProposal.attributes['facilityTakeOver'] = [...this.creditProposal.attributes['facilityTakeOver'], res];
      }
    });
  }
  // Delete Confirmation
  public onDelete(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Take Over Previous Data',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const dataGridTake = this.creditProposal.attributes['facilityTakeOver'].filter(({ id }) => id !== element.id);
        this.creditProposal.attributes['facilityTakeOver'] = dataGridTake;
        this.creditProposal.attributes['facilityTakeOver'] = dataGridTake;
      }
    });
  }
}
