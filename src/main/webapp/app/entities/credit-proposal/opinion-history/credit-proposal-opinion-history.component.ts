import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { INotes, Notes } from 'app/entities/notes/notes.model';
import { ICreditProposal } from '../credit-proposal.model';
import { CreditProposalDialogOpinionHistoryComponent } from './dialog-opinion-history/credit-proposal-dialog-opinion-history.component';

import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-opinion-history',
  templateUrl: './credit-proposal-opinion-history.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css']
})
export class CreditProposalOpinionHistoryComponent implements OnInit {
  public _creditProposalItem: ICreditProposal;
  public notes: any;
  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
	if(this.creditProposalItem.notes.length > 0){
	  this.notes = lodash.cloneDeep(this.creditProposalItem.notes);
	  for(let i = 0; i < this.notes.length; i++){
		this.notes[i].message = this.notes[i].message.replace(/<(?:.|\n)*?>/gm, '');
		this.notes[i].createDate = this.datePipe.transform(this.notes[i].createDate, 'yyyy-MM-dd');
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
      'CreateLink'
    ],
  };

  constructor(
    public accountService: AccountService,
    public dialog: MatDialog,
	public datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
	  const currentAccount = account;
	  this.creditProposalItem.attributes['tempLoggedInNotes'] = '';
	  if(this.creditProposalItem.notes.length > 0){
		for(let i = 0; i < this.creditProposalItem.notes.length; i++){
		  if(this.creditProposalItem.notes[i].userId === currentAccount.login){
			this.creditProposalItem.attributes['tempLoggedInNotes'] = this.creditProposalItem.notes[i].message;
		  }
		}
	  }
    });
  }

  public openDialog(element: INotes = null): void {
    const predicate = {
      width: '80vw',
      data: {
		notes: element,
		creditProposalItem: this.creditProposalItem
	  },
    };

    const dialogRef = this.dialog.open(CreditProposalDialogOpinionHistoryComponent, predicate);
  }  
}