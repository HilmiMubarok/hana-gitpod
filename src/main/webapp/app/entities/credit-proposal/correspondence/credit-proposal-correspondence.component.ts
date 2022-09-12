import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { MatDialog } from '@angular/material/dialog';
import { Correspondence, ICorrespondence } from './correspondence.model';
import { CorrespondenceDialogComponent } from './correspondence-dialog.component';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
@Component({
  selector: 'jhi-credit-proposal-correspondence',
  templateUrl: './credit-proposal-correspondence.component.html',
})
export class CreditProposalCorrespondenceComponent implements OnChanges {
  private _creditProposal: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  private loanApplication: ILoanApplication;
  constructor(private loanApplicationService: LoanApplicationService, public dialog: MatDialog) {}

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

  public openDialog(element: ICorrespondence = null): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['correspondence'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['correspondence'] = new Correspondence();
    }

    const dialogRef = this.dialog.open(CorrespondenceDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loanApplication.attributes['correspondence'] = [...this.creditProposal.attributes['correspondence'], res];
        this.creditProposal.attributes['correspondence'] = [...this.creditProposal.attributes['correspondence'], res];
        this.save();
      }
    });
  }

  public save(): void {
    this.loanApplication.attributes['correspondence'] = JSON.stringify(this.loanApplication.attributes['correspondence']);
    this.loanApplicationService.update(this.loanApplication).subscribe(res => {
      console.log('save correspondece');
    });
  }
}
