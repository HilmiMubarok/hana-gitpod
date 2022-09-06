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
  styleUrls: ['./proposal-basic-information.css'],
})
export class ProposalBasicInformationComponent implements OnInit {
  public selectedMenuId: string;
  public cifNumber: string;
  public visiblePrompt: Boolean = false;
  public animationSettings: AnimationSettingsModel = {
    effect: 'Zoom',
  };
  public creditProposalList?: ICreditProposal;
  public dataCreditProposal?: ICreditProposal;
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
    this.creditProposalList = new CreditProposal();
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
    { text: 'BASIC INFORMATION' },
    { text: 'BUSINES ACTIVITY' },
    { text: 'LOAN FACILITY DETAIL' },
    { text: 'TAB EXPOSURE' },
    { text: 'ACCEPTENCE CRITERIA' },
    { text: 'MANAGEMENT INFO' },
    { text: 'SLIK SUMMARY' },
    { text: 'BANK ACCOUNT ANALYSIS' },
    { text: 'TAB REPAYMENT CAPABILITY' },
    { text: 'CORRESPONDENCE' },
  ];
  public selectedMenu?: string;

  public creditProposal?: ICreditProposal;

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public previousState(): void {
    window.history.back();
  }

  ngOnInit() {
    this.creditProposalService.find(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: HttpResponse<ICreditProposal>) => {
      this.creditProposalList = res.body;
      const attributes = res.body.attributes;

      this.creditProposalList.attributes = {
        accountStatus: {
          watchList: attributes.accountStatus === undefined ? false : JSON.parse(attributes.accountStatus).watchList,
          restructured: attributes.accountStatus === undefined ? false : JSON.parse(attributes.accountStatus).restructured,
          relatedParty: attributes.accountStatus === undefined ? false : JSON.parse(attributes.accountStatus).relatedParty,
        },

        watchlistDebtors: {
          isDebtorListedonWatchlistorResturing:
            attributes.watchlistDebtors === undefined ? '' : JSON.parse(attributes.watchlistDebtors).isDebtorListedonWatchlistorResturing,

          areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory:
            attributes.watchlistDebtors === undefined
              ? ''
              : JSON.parse(attributes.watchlistDebtors)
                  .areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory,
        },

        remark: attributes.remark === undefined ? '' : attributes.remark,

        businessActivity: {
          visitBy: attributes.businessActivity === undefined ? '' : JSON.parse(attributes.businesActivity).visitBy,
          visitWith: attributes.businessActivity === undefined ? '' : JSON.parse(attributes.businesActivity).visitWith,
          visitDate: attributes.businessActivity === undefined ? '' : JSON.parse(attributes.businesActivity).visitDate,
          positionInCompany: '',
          venue: '',
          notes: '',
        },
      };
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

  save(): void {
    this.dataCreditProposal = this.creditProposalList;
    this.dataCreditProposal.attributes.accountStatus = JSON.stringify(this.dataCreditProposal.attributes.accountStatus);
    this.dataCreditProposal.attributes.watchlistDebtors = JSON.stringify(this.dataCreditProposal.attributes.watchlistDebtors);
    this.dataCreditProposal.attributes.businessActivity = JSON.stringify(this.dataCreditProposal.attributes.businessActivity);
    if (this.dataCreditProposal.id) {
      this.creditProposalService.update(this.dataCreditProposal).subscribe(res => {
        this.router.navigate(['./credit-proposal']);
      });
    } else {
      this.creditProposalService.create(this.dataCreditProposal).subscribe(res => {
        this.router.navigate(['./credit-proposal']);
      });
    }
  }
}
