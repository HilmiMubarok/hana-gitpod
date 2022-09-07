import { Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { EmitType } from '@syncfusion/ej2-base';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { HttpResponse } from '@angular/common/http';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { data } from './credit-proposal-risk-acceptance-criteria-component';
import { StockChartSelectedDataIndexDirective } from '@syncfusion/ej2-angular-charts';
import { AnyForUntypedForms } from '@angular/forms';

@Component({
  selector: 'jhi-credit-proposal-correspondence',
  templateUrl: './credit-proposal-correspondence.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalCorrespondenceComponent extends AbstractEntityEj2GridComponent<ICreditProposal> implements OnChanges {
  constructor(
    protected creditProposalService: CreditProposalService,
    protected parseLinks: ParseLinks,
    protected alertService: AlertService,
    public accountService: AccountService,
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

  attributes: any;
  public _item: ICreditProposal = new CreditProposal();
  public name?: string;
  public position?: string;
  public date?: string;
  public notes?: string;
  public dataGrid: any = [];
  public dataDropdown: string[] = ['Position 1', 'Position 2', 'Position 3'];

  @ViewChild('ejAddDialog') ejAddDialog: DialogComponent;
  @ViewChild('ejDetailDialog') ejDetailDialog: DialogComponent;

  onOpen(args: any) {
    args.preventFocus = true;
  }

  onOpenDialog(event: any, type: any = 'add'): void {
    type === 'add' ? this.ejAddDialog.show() : this.ejDetailDialog.show();
  }

  public onOverlayClick: EmitType<object> = () => {
    this.ejAddDialog.hide();
    this.ejDetailDialog.hide();
  };

  public onBeforeOpen = function (args: any): void {
    args.maxHeight = '700px';
  };

  public clearTextBox(): void {
    this.name = '';
    this.position = '';
    this.date = '';
    this.notes = '';
  }

  public addToGrid(ev: any): void {
    this.dataGrid = [
      ...this.dataGrid,
      {
        name: this.name,
        position: this.position,
        date: this.date,
        notes: this.notes,
      },
    ];
    this._item.attributes = {
      correspondence: JSON.stringify(this.dataGrid),
    };
    this.clearTextBox();
    this.ejAddDialog.hide();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataGrid = JSON.parse(changes.item.currentValue.attributes.correspondence);
  }

  @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }
}
