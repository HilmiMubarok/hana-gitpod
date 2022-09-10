import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';
import { ITradeChecking } from './trade-checking.model';

@Component({
  selector: 'jhi-credit-proposal-trade-checking',
  templateUrl: './credit-proposal-trade-checking.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalTradeCheckingComponent extends AbstractEntityEj2GridComponent<ICreditProposal> implements OnInit {
  public tradeChecking: ITradeChecking;

  private _creditProposalItem: ICreditProposal;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  public item: ICreditProposal = new CreditProposal();

  @ViewChild('ejDialogAdd') ejDialogAdd: DialogComponent;
  @ViewChild('ejDialogAdd1') ejDialogAdd1: DialogComponent;

  public datasup: any = [];
  public databuy: any = [];
  public dialogEditVisible: false;
  public dialogVisible: false;
  public dialogAddVisible: false;

  attributes: any;

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
    this.databuy = this.creditProposalItem.attributes['tradeChecking'].grid1;
    this.datasup = this.creditProposalItem.attributes['tradeChecking'].grid2;
  }

  public addToGrid(): void {
    this.databuy = [
      ...this.databuy,
      {
        buyersName: this.creditProposalItem.attributes['tradeChecking'].buyersName,
        termsOfPayment1: this.creditProposalItem.attributes['tradeChecking'].termsOfPayment1,
        relationshipSince1: this.creditProposalItem.attributes['tradeChecking'].relationshipSince1,
        purchase1: this.creditProposalItem.attributes['tradeChecking'].purchase1,
        reflection1: this.creditProposalItem.attributes['tradeChecking'].reflection1,
        contact1: this.creditProposalItem.attributes['tradeChecking'].contact1,
        explanation1: this.creditProposalItem.attributes['tradeChecking'].explanation1,
      },
    ];
    this.creditProposalItem.attributes['tradeChecking'].grid1 = this.databuy;
    this.ejDialogAdd.hide();
  }
  public addToGrid1(ev: any): void {
    this.datasup = [
      ...this.datasup,
      {
        // indexNum: this.datasup.length + 1.
        suppliersName: this.creditProposalItem.attributes['tradeChecking'].suppliersName,
        termsOfPayment: this.creditProposalItem.attributes['tradeChecking'].termsOfPayment,
        relationshipSince: this.creditProposalItem.attributes['tradeChecking'].relationshipSince,
        purchase: this.creditProposalItem.attributes['tradeChecking'].purchase,
        reflection: this.creditProposalItem.attributes['tradeChecking'].reflection,
        contact: this.creditProposalItem.attributes['tradeChecking'].contact,
        explanation: this.creditProposalItem.attributes['tradeChecking'].explanation,
      },
    ];
    this.creditProposalItem.attributes['tradeChecking'].grid2 = this.datasup;
    this.ejDialogAdd1.hide();
  }
  public onOverlayAddClick(): void {
    this.ejDialogAdd.hide();
  }
  public onOverlayAddClick1(): void {
    this.ejDialogAdd1.hide();
  }
  public onEdit1(): void {
    this.ejDialogAdd.show();
  }
  public onEdit(): void {
    this.ejDialogAdd1.show();
  }
  public onDelete(): void {}
  public onDelete1(): void {}
  public clearTextBox1(): void {}
  public clearTextBox(): void {}

  public onAddSup(ev: any): void {
    this.ejDialogAdd1.show();
  }
  public onAddBuy(ev: any): void {
    this.ejDialogAdd.show();
  }
}
