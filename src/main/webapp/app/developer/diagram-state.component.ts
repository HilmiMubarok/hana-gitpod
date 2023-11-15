import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { firstValueFrom } from 'rxjs';
import { DeveloperShowDiagramStateDialogComponent } from './diagram-state-dialog.component';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';

@Component({
  selector: 'jhi-for-developer-show-diagram-state',
  templateUrl: './diagram-state.component.html',
})
export class DeveloperShowDiagramStateComponent implements OnInit {
  public loanApplications: ICreditProposal[] = [];
  constructor(private creditProposalService: CreditProposalService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadLoanApplication();
  }

  private async loadLoanApplication(): Promise<void> {
    this.loanApplications = (
      await firstValueFrom(
        this.creditProposalService.query({
          page: 0,
          size: 5,
          sort: ['id,desc'],
        })
      )
    ).body;
  }

  public showDiagram(_id: number): void {
    this.dialog.open(DeveloperShowDiagramStateDialogComponent, {
      data: {
        id: _id,
      },
    });
  }
}
