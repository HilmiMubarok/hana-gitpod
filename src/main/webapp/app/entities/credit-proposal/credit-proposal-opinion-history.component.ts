import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';

@Component({
  selector: 'jhi-credit-proposal-opinion-history',
  templateUrl: './credit-proposal-opinion-history.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalOpinionHistoryComponent extends AbstractEntityEj2GridComponent<ICreditProposal> implements OnInit {
  private _creditProposalItem: ICreditProposal;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  @ViewChild('ejDialog') ejDialog: DialogComponent;

  public data: any = [];

  public dialogVisible: boolean;
  public reviewerName: String;
  public position: String;
  public date: String;
  public opini: String;
  // public remarks: String;
  notes: any;

  constructor(
    protected creditProposalService: CreditProposalService,
    protected parseLinks: ParseLinks,
    protected alertService: AlertService,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: BaseDataUtils,
    protected router: Router,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected modalService: NgbModal,
    protected confirmationService: ConfirmationService
  ) {
    super(
      creditProposalService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );
  }

  ngOnInit(): void {
    // this.data = this.creditProposalItem.notes['opinionHistory'];
    console.log('ini data', this.data);
  }

  public onView(): void {
    // this.data = [
    //   ...this.data,
    //   {
    //     reviewerName: this.creditProposalItem.notes['opinionHistory'].reviewerName,
    //     position: this.creditProposalItem.notes['opinionHistory'].position,
    //     Date: this.creditProposalItem.notes['opinionHistory'].Date,
    //     opini: this.creditProposalItem.notes['opinionHistory'].opini,
    //   },
    // ];
    // this.creditProposalItem.notes['opinionHistory'].grid1 = this.data;
    // this.clearTextBox();
    // this.ejDialogAdd.hide();
    this.ejDialog.show();
  }

  public onOverlayClick(): void {
    this.ejDialog.hide();
  }
  public clearTextBox(): void {
    this.reviewerName = '';
    this.position = '';
    this.date = '';
    this.opini = '';
    // this.remarks = '';
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
}
