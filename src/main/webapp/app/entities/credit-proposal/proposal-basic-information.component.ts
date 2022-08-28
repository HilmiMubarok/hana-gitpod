import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
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
    { text: 'ACCEPTENCE CRITERIA' },
    { text: 'MANAGEMENT INFO' },
    { text: 'SLIK SUMMARY' },
    { text: 'TAB EXPOSURE' },
    { text: 'FACILITY DETAIL' },
    { text: 'CORRESPONDENCE' },
    { text: 'LOAN FACILITY DETAIL' },
    { text: 'BANK ACCOUNT ANALYSIS' },
    { text: 'TAB REPAYMENT CAPABILITY' },
  ];
  public selectedMenu?: string;

  public creditProposal?: ICreditProposal;

  constructor(private creditProposalService: CreditProposalService, protected activatedRoute: ActivatedRoute) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
  }

  ngOnInit(): void {
    this.selectedMenu = 'LOAN FACILITY DETAIL';
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public previousState(): void {
    window.history.back();
  }
}
