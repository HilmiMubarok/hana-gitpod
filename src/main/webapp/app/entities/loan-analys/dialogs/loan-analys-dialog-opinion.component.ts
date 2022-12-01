import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

@Component({
  selector: 'jhi-loan-analys-dialog-opinion',
  templateUrl: './loan-analys-dialog-opinion.component.html',
  styleUrls: ['./loan-analys-dialog-opinion.css'],
})
export class LoanAnalysDialogOpinionComponent {
  public notes: any;
  // public parentPath = this.router.url.split('/')[1];
  public nameLabel: any;
  public radioButtonPurpose: any;
  public radioButtonCondition: any;
  public radioButtonNotRecommend: any;
  public valueRadioPurpose: any;
  public valueRadioCondition: any;
  public valueRadioRecommend: any;

  creditProposalItem: ICreditProposal;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataNotes: {
      notes: any;
      item: ICreditProposal;
    },
    _dialog: MatDialogRef<LoanAnalysDialogOpinionComponent>,
    protected router: Router
  ) {
    this.notes = this.dataNotes.notes;
    this.creditProposalItem = this.dataNotes.item;
    this.conditionOpinion();
  }

  public conditionOpinion() {
    //  Opinion Condition in status loan commite approval
    if (this.creditProposalItem.statusId === 'CP_LOAN_COMMITTEE') {
      // Manipulation in Label
      this.nameLabel = 'Approved';
      // Manipulation in radio button
      this.radioButtonPurpose = 'Approved With Propose';
      this.radioButtonCondition = 'Approved With Condition';
      this.radioButtonNotRecommend = 'Not Approved';
      // Manipulation in value
      this.valueRadioPurpose = 'Approved With Propose';
      this.valueRadioCondition = 'Approved With Condition';
      this.valueRadioRecommend = 'Not Approved';
    } else {
      // if outside the conditions url loan commite approval
      this.nameLabel = 'Recomendation';
      this.radioButtonPurpose = 'Recommend as Propose';
      this.radioButtonCondition = 'Recommend With Condition';
      this.radioButtonNotRecommend = 'Not Recommend';

      this.valueRadioPurpose = 'Recommend as propose';
      this.valueRadioCondition = 'Recommend With Condition';
      this.valueRadioRecommend = 'Not Recommend';
    }
  }
}
