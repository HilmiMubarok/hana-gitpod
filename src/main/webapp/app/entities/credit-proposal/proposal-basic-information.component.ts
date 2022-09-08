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
  ];
  public selectedMenu: string;

  public creditProposal: ICreditProposal;

  constructor(private creditProposalService: CreditProposalService, protected activatedRoute: ActivatedRoute, private router: Router) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
  }

  ngOnInit() {
    this.selectedMenu = 'BASIC INFORMATION';
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public previousState(): void {
    window.history.back();
  }

  public creditProposalList: ICreditProposal = new CreditProposal();

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
  };

  public save(): void {
    this.creditProposal.attributes['correspondence'] = JSON.stringify(this.creditProposal.attributes['correspondence']);
    // this.creditProposal.attributes['basicInformation'] = JSON.stringify(this.creditProposal.attributes['basicInformation']);
    // this.creditProposal.attributes['businessActivity'] = JSON.stringify(this.creditProposal.attributes['businessActivity']);
    // this.creditProposal.attributes['analysisOfCalculation'] = JSON.stringify(this.creditProposal.attributes['analysisOfCalculation']);
    this.creditProposal.attributes['bankAnalyst'] = JSON.stringify(this.creditProposal.attributes['bankAnalyst']);
    this.creditProposal.attributes['proformaLaporanKeuangan'] = JSON.stringify(this.creditProposal.attributes['proformaLaporanKeuangan']);
    for (let i = 0; i < this.creditProposal.products.length; i++) {
      this.creditProposal.products[i].attributes.maturityDate = '';
      this.creditProposal.products[i].attributes.dateOS = '';
      this.creditProposal.products[i].attributes.memoDate = '';
    }
    if (this.creditProposal.id) {
      this.creditProposalService.update(this.creditProposal).subscribe(res => {
        this.router.navigate(['./credit-proposal']);
      });
    } else {
      this.creditProposalService.create(this.creditProposal).subscribe(res => {
        this.router.navigate(['./credit-proposal']);
      });
    }
  }
}
