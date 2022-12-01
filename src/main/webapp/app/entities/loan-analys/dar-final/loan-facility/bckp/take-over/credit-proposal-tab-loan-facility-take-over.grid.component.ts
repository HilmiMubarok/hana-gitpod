import { Component, ViewChild, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ICreditProposal, CreditProposal } from '../../credit-proposal.model';
import {
  IApplicationProduct,
  ApplicationProduct,
  ApplicationProductAttribute,
  IApplicationProductAttribute,
} from '../../../application-product/application-product.model';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { CreditProposalLoanFacilityDialogComponent } from '../dialog/loan-facility-dialog.component';
import { Router } from '@angular/router';
import { CollateralAttribute } from 'app/entities/collateral/collateral.model';
import {
  CollateralProductRelation,
  ICollateralProductRelation,
} from 'app/entities/collateral-product-relation/collateral-product-relation.model';
import { CreditProposalTabLoanFacilityTakeOverComponent } from './credit-proposal-tab-loan-facility-take-over.component';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import {
  IApplicationProductTakeOver,
  ApplicationProductTakeOver,
} from '../application-product-take-over/application-product-take-over.model';
import { CreditProposalTabLoanFacilityTakeOverAfterComponent } from '../take-over-after/credit-proposal-tab-loan-facility-take-over-after.component';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-take-over-grid',
  templateUrl: './credit-proposal-tab-loan-facility-take-over.grid.component.html',
  styleUrls: ['../grid/loan.scss'],
})
export class CreditProposalTabLoanFacilityTakeOverGridComponent implements OnChanges {
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

  public displayColumns: string[] = ['no', 'facilityType1', 'initialLimit', 'outstanding', 'tenor', 'action'];

  public stateOfAction?: string;
  public format = { format: 'R$ #. ## 0,00' };
  public numericFormatOptions: Object;
  public loading: boolean;
  public cloneData: any;

  // dataData: any;

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
  public openDialog(element: IApplicationProductTakeOver = null): void {
    const predicate = { width: '80vw', data: { object: this.creditProposal } };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['facilityTakeOver'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['facilityTakeOver'] = new ApplicationProductTakeOver();
    }
    const dialogRef = this.dialog.open(CreditProposalTabLoanFacilityTakeOverComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loanApplication.attributes['facilityTakeOver'] = [...this.creditProposal.attributes['facilityTakeOver'], res];
        this.creditProposal.attributes['facilityTakeOver'] = [...this.creditProposal.attributes['facilityTakeOver'], res];
      }
    });
  }
  public onDelete(element: ICreditProposal) {
    const dataGridTake = this.creditProposal.attributes['facilityTakeOver'].filter(({ id }) => id !== element.id);
    this.creditProposal.attributes['facilityTakeOver'] = dataGridTake;
    this.creditProposal.attributes['facilityTakeOver'] = dataGridTake;
    console.log('Tes Delete', dataGridTake);
  }
}
