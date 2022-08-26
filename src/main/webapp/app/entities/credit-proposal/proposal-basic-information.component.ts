import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { HttpResponse } from '@angular/common/http';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';

@Component({
  selector: 'jhi-credit-proposal-basic',
  templateUrl: './proposal-basic-information.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class ProposalBasicInformationComponent extends AbstractEntityComponent<ICreditProposal> {
  @ViewChild('findCifDialog')
  public creditProposalItem: ICreditProposal = new CreditProposal();
  public findCifDialog: DialogComponent;
  public selectedMenuId: string;
  public cifNumber: string;
  public visiblePrompt: Boolean = false;
  public animationSettings: AnimationSettingsModel = {
    effect: 'Zoom',
  };

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
    this.item = new CreditProposal();
    this.parentRoute = '/credit-proposal';
    this.listChangeEventName = 'creditProposalBasicModification';
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

  get creditProposals() {
    return this.items['result'];
  }

  set creditProposals(creditProposal: ICreditProposal[]) {
    this.items['result'] = creditProposal;
  }

  public openPromptFindCIF(): void {
    this.findCifDialog.show();
  }

  public hidePromptFindCIF(): void {
    this.findCifDialog.hide();
  }

  public buttonFindCifDialog = [
    {
      click: this.hidePromptFindCIF.bind(this),
      buttonModel: {
        content: 'Close',
      },
    },
  ];

  public findCif(): void {
    this.creditProposalService.findByCif(this.cifNumber).subscribe((res: HttpResponse<ICreditProposal>) => {
      const result: ICreditProposal = res.body;
      if (result) {
        const redirectUri = '/credit-proposal/' + result[0].id + '/edit/2';
        this.router.navigate([redirectUri]);
      }
    });
  }

  public data: string[] = ['Cricket', 'Football', 'Rugby', 'Snooker', 'Tennis'];

  public menuItems: MenuItemModel[] = [
    {
      id: 'basic-information',
      text: 'BASIC INFORMATION',
    },
    {
      id: 'busines-activity',
      text: 'BUSINES ACTIVITY',
    },
    {
      id: 'acceptence criteria',
      text: 'ACCEPTENCE CRITERIA',
    },
    {
      id: 'management-info',
      text: 'MANAGEMENT INFO',
    },

    {
      id: 'summary-info',
      text: 'SLIK SUMMARY',
    },

    {
      id: 'tab-exposure',
      text: 'TAB EXPOSURE',
    },
    // {
    //   id: 'approval-list',
    //   text: 'APPROVAL LIST',
    // },
    {
      id: 'facility-detail',
      text: 'FACILITY DETAIL',
    },

    // {
    //   id: 'tab-summary',
    //   text: 'TAB SUMMARY',
    // },
    {
      id: 'correspondence',
      text: 'CORRESPONDENCE',
    },
    {
      id: 'loan-facility-detail',
      text: 'LOAN FACILITY DETAIL',
    },

    {
      id: 'bank-account-analysis',
      text: 'BANK ACCOUNT ANALYSIS',
    },
    {
      id: 'tab-repayment-capability',
      text: 'TAB REPAYMENT CAPABILITY',
    },
  ];

  public selectMenuItem(args: MenuEventArgs): void {
    const id = args.item.id;
    this.selectedMenuId = id;
  }

  public result: any[];

  initialize() {
    this.result = [
      {
        OrderID: 'setya',
        CustomerID: 'setya',
        Freight: 'setya',
        OrderDate: 'setya',
      },
    ];

    this.getData();
  }

  public tools: object = {
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
      'Indent',
      'Outdent',
      'SuperScript',
      'SubScript',
      'Alignments',
      'CreateLink',
    ],
    // 'Image', 'FileManager']
  };

  public dataCreditProposal: ICreditProposal = new CreditProposal();

  save(): void {
    this.creditProposalService.save(this.dataCreditProposal).subscribe(res => console.log(res));
    console.log(this.dataCreditProposal);
  }

  getData() {
    this.creditProposalService.find(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: HttpResponse<ICreditProposal>) => {
      this.dataCreditProposal = res.body;
    });
  }
}
