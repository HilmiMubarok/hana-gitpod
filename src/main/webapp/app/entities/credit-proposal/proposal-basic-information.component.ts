import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditProposalService } from './credit-proposal.service';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { FieldSettingsModel } from '@syncfusion/ej2-angular-navigations';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-credit-proposal',
  templateUrl: './proposal-basic-information.component.html',
  styleUrls: ['./proposal-basic-information.css'],
})
export class ProposalBasicInformationComponent implements OnInit {
  public proposalTypeList: string[] = ['Total Exposure < IDR 15 Bn', 'Total Exposure > IDR 15 Bn'];
  public proposalTypeValue?: string;
  public menuFields: FieldSettingsModel = {
    text: ['text'],
  };
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
  }

  ngOnInit(): void {
    this.selectedMenu = 'SLIK SUMMARY';
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public previousState(): void {
    window.history.back();
  }

  public onGetCreditProposal(creditProposal: ICreditProposal): void {
    this.creditProposal = creditProposal;
  }

  public onSave(): void {
    this.creditProposal.attributes['proformaLaporanKeuangan'] = JSON.stringify(this.creditProposal.attributes['proformaLaporanKeuangan']);
    this.creditProposal.attributes['analysisOfCalculation'] = JSON.stringify(this.creditProposal.attributes['analysisOfCalculation']);
    for (let i = 0; i < this.creditProposal.products.length; i++) {
      this.creditProposal.products[i].attributes.maturityDate = '';
      this.creditProposal.products[i].attributes.dateOS = '';
      this.creditProposal.products[i].attributes.memoDate = '';
    }

    if (this.creditProposal.id) {
      this.creditProposalService.update(this.creditProposal).subscribe(res => {
        this.router.navigate(['credit-proposal']);
      });
    } else {
      this.creditProposalService.create(this.creditProposal).subscribe(res => {
        this.router.navigate(['credit-proposal']);
      });
    }
  }
}
