import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';

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

@Component({
  selector: 'jhi-credit-proposal-basic',
  templateUrl: './proposal-basic-information.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class ProposalBasicInformationComponent implements OnInit {
  public selectedMenuId: string;
  public cifNumber: string;
  public visiblePrompt: Boolean = false;
  public animationSettings: AnimationSettingsModel = {
    effect: 'Zoom',
  };
  public creditProposalList?: ICreditProposal;
  public attributes = {
    accountStatus: {},
    watchlistDebtors: '',
    areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory: '',
    businesActivity: {},
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
    this.attributes;
  }

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
    {
      id: 'facility-detail',
      text: 'FACILITY DETAIL',
    },
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
  }

  ngOnInit() {
    this.creditProposalService.find(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: HttpResponse<ICreditProposal>) => {
      this.creditProposalList = res.body;
    });
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

  basicInformationData(dataItem: any) {
    this.attributes.accountStatus = dataItem.attributes.accountStatus;
    this.attributes.watchlistDebtors = dataItem.attributes.watchlistDebtors;
    this.attributes.areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory =
      dataItem.attributes.areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory;
  }

  businesActivityData(dataItem: any) {
    this.attributes.businesActivity = dataItem.attributes.businessActivity;
  }

  save(): void {
    this.creditProposalList.attributes = this.attributes;
    console.log('save credit proposal', this.creditProposalList);
    // if (this.creditProposalList.id) {
    //   this.creditProposalService.update(this.creditProposalList).subscribe(res => {
    //     this.router.navigate(['./credit-proposal']);
    //   });
    // } else {
    //   this.creditProposalService.create(this.creditProposalList).subscribe(res => {
    //     this.router.navigate(['./credit-proposal']);
    //   });
    // }
  }
}
