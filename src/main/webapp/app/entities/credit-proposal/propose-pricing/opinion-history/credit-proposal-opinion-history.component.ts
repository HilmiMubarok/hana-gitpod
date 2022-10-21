import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { INotes, Notes } from 'app/entities/notes/notes.model';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import lodash from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';
import { CreditProposalDialogOpinionHistoryComponent } from './dialog-opinion-history/credit-proposal-dialog-opinion-history.component';

@Component({
  selector: 'jhi-credit-proposal-opinion-history',
  templateUrl: './credit-proposal-opinion-history.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalOpinionHistoryComponent implements OnInit {
  public indexNum = 1;
  public _creditProposalItem: ICreditProposal;
  public copyCreditProposal: any;
  public data: any;
  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
    console.log('creditProposalItem @set creditProposalItem - opinion : ', this._creditProposalItem);
  }

  public dataNotes: any = [];
  private currentAccount: Account;
  public dialogVisible: boolean;
  constructor(
    private creditProposalService: CreditProposalService,
    public accountService: AccountService,
    protected messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.data = this.creditProposalItem.attributes['noteMessage'];
    this.copyCreditProposal = this.creditProposalItem.notes.map(item => (item.message = 'Ok'));
    console.log('ini data Notes', this.dataNotes);

    // console.log('ini data Notes2', this.getDatagrid );
    // this.accountAuthorities = account['authorities'];
  }

  // change(event: any){
  //   if(event.value === ''){
  //     this.creditProposalItem.notes[0].message = '';
  //   }else{
  //     this.creditProposalItem.notes[0].message = 'oke';
  //   }
  // }
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['creditProposal']) {
  //     this.indexNum = this.creditProposalItem.notes.length + 1;
  //     console.log('Ini index', this.indexNum);
  //   }
  // }
  // element: INotes = null

  public openDialog(element: INotes = null): void {
    const predicate = {
      width: '80vw',
      data: { creditProposalItem: this.creditProposalItem },
    };
    console.log(element);

    if (element) {
      if (!lodash.has(element.attributes, 'message')) {
        element.attributes['message'] = '';
      }

      predicate.data['notes'] = element;
    }

    const dialogRef = this.dialog.open(CreditProposalDialogOpinionHistoryComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // this.loading = true;
        this.creditProposalItem.notes = lodash.unionBy([res], this.creditProposalItem.notes, 'id');
        // this.loading = false;
        console.log('COBAAAA', (this.creditProposalItem.notes = lodash.unionBy([res], this.creditProposalItem.notes, 'id')));
      }
    });
  }

  // public onOverlayClick(): void {
  //   this.dialog.(CreditProposalDialogOpinionHistoryComponent)
  // }
  // public clearTextBox(): void
  // }
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
}
