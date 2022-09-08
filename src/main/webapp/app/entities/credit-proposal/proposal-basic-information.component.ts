import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
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
      text: 'TAB SUMMARY',
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
	  notes: ''
	};
    this.creditProposal.attributes['tabSummary'] = this.creditProposal.attributes.tabSummary
      ? this.creditProposal.attributes.tabSummary
      : passSummary;
	this.creditProposal.attributes['businessActivity'] = this.creditProposal.attributes.businessActivity
      ? this.creditProposal.attributes.businessActivity
      : passBusinessActivity;
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public previousState(): void {
    window.history.back();
  }

  public save(): void {
    this.selectedMenu = '';
    this.creditProposal.attributes['correspondence'] = JSON.stringify(this.creditProposal.attributes['correspondence']);
    this.creditProposal.attributes['basicInformation'] = JSON.stringify(this.creditProposal.attributes['basicInformation']);
    this.creditProposal.attributes['businessActivity'] = JSON.stringify(this.creditProposal.attributes['businessActivity']);
    this.creditProposal.attributes['analysisOfCalculation'] = JSON.stringify(this.creditProposal.attributes['analysisOfCalculation']);
    this.creditProposal.attributes['bankAnalyst'] = JSON.stringify(this.creditProposal.attributes['bankAnalyst']);
    this.creditProposal.attributes['proformaLaporanKeuangan'] = JSON.stringify(this.creditProposal.attributes['proformaLaporanKeuangan']);
    this.creditProposal.attributes['tabSummary'] = JSON.stringify(this.creditProposal.attributes['tabSummary']);
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
