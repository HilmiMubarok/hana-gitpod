import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';

import { AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { MessageService } from 'primeng/api';
import lodash from 'lodash';

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
  public menuItems: MenuItemModel[] = [
    {
      text: 'BASIC INFORMATION',
    },
    {
      text: 'CORRESPONDENCE',
    },
    {
      text: 'BUSINES ACTIVITY',
    },
    {
      text: 'LOAN FACILITY DETAIL',
    },
    {
      text: 'FINANCIAL STATEMENT',
    },
    {
      text: 'TAB EXPOSURE',
    },
    {
      text: 'ACCEPTENCE CRITERIA',
    },
    {
      text: 'MANAGEMENT INFO',
    },
    {
      text: 'SLIK SUMMARY',
    },
    {
      text: 'FINANCIAL STATEMENT',
    },
    {
      text: 'BANK ACCOUNT ANALYSIS',
    },
    {
      text: 'TAB REPAYMENT CAPABILITY',
    },
    {
      text: 'GROUP & GUARANTOUR ANALYSIS',
    },
    {
      text: 'TRADE CHECKING',
    },

    {
      text: 'TAB CONVENANT',
    },
	{
      text: 'COLLATERAL INFO',
    }
  ];

  public selectedMenu: string;

  public creditProposal: ICreditProposal;

  constructor(
    private creditProposalService: CreditProposalService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    protected messageService: MessageService
  ) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
  }

  ngOnInit() {
    this.selectedMenu = 'BASIC INFORMATION';
    const passSummary = {
      strength: '',
      opportunities: '',
      weaknesses: '',
      threats: '',
    };
    const passBusinessActivity = {
      visitBy: '',
      visitWith: '',
      visitDate: '',
      positionInCompany: '',
      venue: '',
      notes: '',
    };
    this.creditProposal.attributes['tabSummary'] = this.creditProposal.attributes.tabSummary
      ? JSON.parse(this.creditProposal.attributes.tabSummary)
      : passSummary;
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public previousState(): void {
    window.history.back();
  }

  private preSave(): ICreditProposal {
    const copyCreditProposal: ICreditProposal = lodash.cloneDeep(this.creditProposal);

    copyCreditProposal.attributes['businessGroup'] = JSON.stringify(copyCreditProposal.attributes['businessGroup']);
    copyCreditProposal.attributes['shareHolder'] = JSON.stringify(copyCreditProposal.attributes['shareHolder']);
    copyCreditProposal.attributes['correspondence'] = JSON.stringify(copyCreditProposal.attributes['correspondence']);
    copyCreditProposal.attributes['basicInformation'] = JSON.stringify(copyCreditProposal.attributes['basicInformation']);
    this.creditProposal.attributes['guaranturAnalysis'] = JSON.stringify(this.creditProposal.attributes['guaranturAnalysis']);
    this.creditProposal.attributes['riksCriteria'] = JSON.stringify(this.creditProposal.attributes['riksCriteria']);
    this.creditProposal.attributes['tradeChecking'] = JSON.stringify(this.creditProposal.attributes['tradeChecking']);
    this.creditProposal.attributes['convenant'] = JSON.stringify(this.creditProposal.attributes['convenant']);

    copyCreditProposal.attributes['businessActivity'] = JSON.stringify(copyCreditProposal.attributes['businessActivity']);
    copyCreditProposal.attributes['analysisOfCalculation'] = JSON.stringify(copyCreditProposal.attributes['analysisOfCalculation']);
    copyCreditProposal.attributes['bankAnalyst'] = JSON.stringify(copyCreditProposal.attributes['bankAnalyst']);
    copyCreditProposal.attributes['proformaLaporanKeuangan'] = JSON.stringify(copyCreditProposal.attributes['proformaLaporanKeuangan']);
    copyCreditProposal.attributes['tabSummary'] = JSON.stringify(copyCreditProposal.attributes['tabSummary']);

    for (let i = 0; i < copyCreditProposal.products.length; i++) {
      copyCreditProposal.products[i].attributes.maturityDate = '';
      copyCreditProposal.products[i].attributes.dateOS = '';
      copyCreditProposal.products[i].attributes.memoDate = '';
    }

    return copyCreditProposal;
  }

  public save(): void {
    if (this.creditProposal.id) {
      this.creditProposalService.update(this.preSave()).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
      });
    } else {
      this.creditProposalService.create(this.preSave()).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
      });
    }
  }
}
