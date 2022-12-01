import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { INotes, Notes } from 'app/entities/notes/notes.model';
import lodash from 'lodash';
import { LoanAnalysDialogOpinionComponent } from '../dialogs/loan-analys-dialog-opinion.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'jhi-loan-analys-opinion',
  templateUrl: './loan-analys-opinion.component.html',
  styleUrls: ['./loan-analys-opinion.css'],
})
export class LoanAnalysOpinionComponent implements OnInit, OnChanges {
  public _creditProposalItem: ICreditProposal;
  public notes: any;
  public route: any;
  public view: boolean;

  // public parentPath = this.router.url.split('/')[1];
  public nameLabel: any;
  public radioButtonPurpose: any;
  public radioButtonCondition: any;
  public radioButtonNotRecommend: any;
  public valueRadioPurpose: any;
  public valueRadioCondition: any;
  public valueRadioRecommend: any;
  @Input() cp: ICreditProposal;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cp.currentValue.notes.length > 0) {
      this.notes = lodash.cloneDeep(changes.cp.currentValue.notes);
      for (let i = 0; i < this.notes.length; i++) {
        this.notes[i].message = this.notes[i].message ? this.notes[i].message.replace(/<(?:.|\n)*?>/gm, '') : '';
        this.notes[i].condition = this.notes[i].condition ? this.notes[i].condition.replace(/<(?:.|\n)*?>/gm, '') : '';
        this.notes[i].createDate = this.notes[i].createDate ? this.datePipe.transform(this.notes[i].createDate, 'yyyy-MM-dd') : '';
      }
    }
  }

  public tools: ToolbarModule = {
    items: [
      'FontName',
      'FontSize',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontColor',
      'BackgroundColor',
      'OrderedList',
      'UnorderedList',
      'Outdent',
      'Indent',
      'SuperScript',
      'SubScript',
      'CreateLink',
    ],
  };

  constructor(
    public accountService: AccountService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {
    this.view = false;
    console.log('view');
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      const currentAccount = account;
      this.creditProposalItem.attributes['tempLoggedInNotes'] = '';
      this.creditProposalItem.attributes['tempLoggedInRecomendation'] = '';
      this.creditProposalItem.attributes['tempLoggedInCondition'] = '';
      if (this.creditProposalItem.notes.length > 0) {
        for (let i = 0; i < this.creditProposalItem.notes.length; i++) {
          if (this.creditProposalItem.notes[i].userId === currentAccount.login) {
            this.creditProposalItem.attributes['tempLoggedInNotes'] = this.creditProposalItem.notes[i].message;
            this.creditProposalItem.attributes['tempLoggedInRecomendation'] = this.creditProposalItem.notes[i].recomendation;
            this.creditProposalItem.attributes['tempLoggedInCondition'] = this.creditProposalItem.notes[i].condition;
          }
        }
      }
    });
    this.readOnlyOffering();
    this.conditionOpinion();
  }

  public openDialog(element: INotes = null): void {
    const predicate = {
      width: '80vw',
      data: { item: this.creditProposalItem },
    };

    predicate.data['notes'] = element;

    const dialogRef = this.dialog.open(LoanAnalysDialogOpinionComponent, predicate);
  }

  public readOnlyOffering() {
    this.route = this.activatedRoute.snapshot.data['offeringLetter'];
    if (this.route) {
      this.view = true;
    }
    console.log('ini route', this.route);
  }

  public conditionOpinion() {
    // Opinion Condition in loan commite approval
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
