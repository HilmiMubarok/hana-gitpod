import { Component, ViewChild, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ICreditProposal, CreditProposal } from '../../credit-proposal.model';

import { MatDialog } from '@angular/material/dialog';

import { LoanFacilityTakeOverAfterHistoryComponent } from './credit-proposal-tab-loan-facility-take-over-after.component';
import { IApplicationProductTakeOver } from 'app/entities/credit-proposal/loan-facility/application-product-take-over/application-product-take-over.model';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { ApplicationProductTakeOverBank } from 'app/entities/credit-proposal/loan-facility/application-product-take-over-after-bank/application-product-take-over-after-bank.model';

@Component({
  selector: 'jhi-loan-facility-take-over-after-grid-history',
  templateUrl: './credit-proposal-tab-loan-facility-take-over-after.grid.component.html',
  styleUrls: ['../grid/loan.scss'],
})
export class LoanFacilityTakeOverAfterGridHistoryComponent implements OnChanges {
  private _creditProposal: ICreditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public displayColumns: string[] = ['no', 'facilityType1', 'initialLimit', 'outstanding', 'tenor', 'action'];

  public numericFormatOptions: Object;
  public loading: boolean;
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
    console.log(element);

    const predicate = { width: '80vw', data: { object: this.creditProposal, creditProposaldata: this.creditProposal } };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['facilityTakeOverAfterBank'] = element;
      predicate.data['view'] = true;
      console.log('element dikirim', element);
    } else {
      predicate.data['facilityTakeOverAfterBank'] = new ApplicationProductTakeOverBank();
    }
    const dialogRef = this.dialog.open(LoanFacilityTakeOverAfterHistoryComponent, predicate);
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
  public onDelete(element: ICreditProposal) {
    const dataGridTakeOver = this.creditProposal.attributes['facilityTakeOverAfterBank'].filter(({ id }) => id !== element.id);
    // const dataGridTakeOver = this.creditProposal.attributes['facilityTakeOverAfterBank'];
    if (dataGridTakeOver === undefined) {
      return dataGridTakeOver.length;
    }

    this.creditProposal.attributes['facilityTakeOverAfterBank'] = dataGridTakeOver;
    this.creditProposal.attributes['facilityTakeOverAfterBank'] = dataGridTakeOver;
    console.log('Tes facilityTakeOverAfterBank', dataGridTakeOver);
  }
}
