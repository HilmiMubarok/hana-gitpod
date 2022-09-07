import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CreditProposalService } from './credit-proposal.service';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';

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
    { text: 'FINANCIAL STATEMENT' },
    { text: 'CORRESPONDENCE' },
  ];
  public selectedMenu?: string;

  public creditProposal?: ICreditProposal;

  constructor(private creditProposalService: CreditProposalService, protected activatedRoute: ActivatedRoute, private router: Router) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
    this.attributes;
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public previousState(): void {
    window.history.back();
  }

  ngOnInit() {
    this.selectedMenu = 'BASIC INFORMATION';
    this.creditProposalService.find(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: HttpResponse<ICreditProposal>) => {
      this.creditProposalList = res.body;
      const attributes = res.body.attributes;

      this.creditProposalList.attributes = {
        basicInformation: {
          accountStatus: {
            watchList: attributes.basicInformation === undefined ? false : JSON.parse(attributes.basicInformation).accountStatus.watchList,
            restructured:
              attributes.basicInformation === undefined ? false : JSON.parse(attributes.basicInformation).accountStatus.watchList,
            relatedParty:
              attributes.basicInformation === undefined ? false : JSON.parse(attributes.basicInformation).accountStatus.watchList,
          },

          watchlistDebtors: {
            isDebtorListedonWatchlistorResturing:
              attributes.basicInformation === undefined
                ? ''
                : JSON.parse(attributes.basicInformation).watchlistDebtors.isDebtorListedonWatchlistorResturing,

            areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory:
              attributes.basicInformation === undefined
                ? ''
                : JSON.parse(attributes.basicInformation).watchlistDebtors
                    .areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory,
          },

          remark: attributes.basicInformation === undefined ? '' : attributes.basicInformation.remark,
        },
        businessActivity: {
          visitBy: attributes.businessActivity === undefined ? '' : JSON.parse(attributes.businessActivity).visitBy,
          visitWith: attributes.businessActivity === undefined ? '' : JSON.parse(attributes.businessActivity).visitWith,
          visitDate: attributes.businessActivity === undefined ? '' : JSON.parse(attributes.businessActivity).visitDate,
          positionInCompany: attributes.businessActivity === undefined ? '' : JSON.parse(attributes.businessActivity).positionInCompany,
          venue: attributes.businessActivity === undefined ? '' : JSON.parse(attributes.businessActivity).vanue,
          notes: attributes.businessActivity === undefined ? '' : JSON.parse(attributes.businessActivity).notes,
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
    this.dataCreditProposal.attributes.basicInformation = JSON.stringify(this.dataCreditProposal.attributes.basicInformation);
    this.dataCreditProposal.attributes.businessActivity = JSON.stringify(this.dataCreditProposal.attributes.businessActivity);
    this.dataCreditProposal.attributes['proformaLaporanKeuangan'] = JSON.stringify(
      this.dataCreditProposal.attributes['proformaLaporanKeuangan']
    );
    for (let i = 0; i < this.dataCreditProposal.products.length; i++) {
      this.dataCreditProposal.products[i].attributes.maturityDate = '';
      this.dataCreditProposal.products[i].attributes.dateOS = '';
      this.dataCreditProposal.products[i].attributes.memoDate = '';
    }
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
