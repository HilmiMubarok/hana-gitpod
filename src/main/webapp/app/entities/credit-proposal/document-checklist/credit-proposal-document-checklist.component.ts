import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { MatDialog } from '@angular/material/dialog';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { DocumentChecklist, IDocumentChecklist } from './document-checklist.model';
import { DocumentChecklistDialogComponent } from './document-checklist-dialog.component';
@Component({
  selector: 'jhi-credit-proposal-document-checklist',
  templateUrl: './credit-proposal-document-checklist.component.html',
})
export class CreditProposalDocumentChecklistComponent implements OnChanges {
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

  public openDialog(element: IDocumentChecklist = null): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['documentChecklist'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['documentChecklist'] = new DocumentChecklist();
    }

    const dialogRef = this.dialog.open(DocumentChecklistDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loanApplication.attributes['documentChecklist'] = [...this.creditProposal.attributes['documentChecklist'], res];
        this.creditProposal.attributes['documentChecklist'] = [...this.creditProposal.attributes['documentChecklist'], res];
        this.save();
      }
    });
  }

  public save(): void {
    this.loanApplication.attributes['documentChecklist'] = JSON.stringify(this.loanApplication.attributes['documentChecklist']);
    this.loanApplicationService.update(this.loanApplication).subscribe(res => {
      console.log('save document-checklist');
    });
  }
}
