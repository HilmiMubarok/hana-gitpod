import { Component, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-credit-proposal-group-guarantor-analysis',
  templateUrl: './credit-proposal-group-guarantor-analysis.component.html',
  styleUrls: ['./credit-proposal-group-guarantor-analysis.component.css'],
})
export class CreditProposalGroupGuarantorAnalysisComponent extends AbstractEntityEj2GridComponent<ICreditProposal> implements OnChanges {
  @ViewChild('findCifDialog')
  public findCifDialog: DialogComponent;
  public animationSettings: AnimationSettingsModel = {
    effect: 'Zoom',
  };
  public visiblePrompt: Boolean = false;
  public remarks: string;

  public _item?: ICreditProposal = new CreditProposal();

  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('current value', changes.item.currentValue);
    this.item = changes.item.currentValue;
    this.item.attributes = {
      guarantor: {
        remarks: '',
      },
    };
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
  attributes: any;

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

    this.parentRoute = '/credit-proposal';
    this.listChangeEventName = 'creditProposalListModification';
    this.entityKeyName = 'id';

    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = false;
      this.predicate = 'createdDate';
      activatedRoute.queryParams.subscribe(params => {
        this.itemsPerPage = params['size'] || ITEMS_PER_PAGE;
        this.first = (this.page - 1) * this.itemsPerPage || 0;
      });
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  save(): void {
    console.log('error');
  }
}
