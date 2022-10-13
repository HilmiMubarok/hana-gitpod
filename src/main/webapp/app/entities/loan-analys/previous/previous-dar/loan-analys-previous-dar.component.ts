import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import lodash from 'lodash';

@Component({
  selector: 'jhi-loan-analys-previous-dar',
  templateUrl: './loan-analys-previous-dar.component.html',
  styleUrls: ['../loan-analys-previous-dar.css'],
})
export class LoanAnalysPreviousDarComponent implements OnInit {
  public selectedMenu: string;

  public menuItems: MenuItemModel[] = [];
  public menuItemsAll: MenuItemModel[] = [ { text: 'PREVIOUS PROPOSAL' }];
  // { text: 'PREVIOUS DAR' }
  ngOnInit(): void {
    this.selectedMenu = 'PREVIOUS PROPOSAL';
    // this.selectedMenu = 'PREVIOUS DAR';
    this.setMenu('');
  }

  private setMenu(value: string): void {
    this.menuItems = lodash.clone(this.menuItemsAll);
  }
  public onProposalTypeChange(value: any): void {
    this.setMenu(value.value);
  }
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  private id: number;
  // private creditProposal: ICreditProposal;
  public creditProposal: ICreditProposal;
  public creditProposalItem: ICreditProposal;

  constructor(private creditProposalService: CreditProposalService, protected activatedRoute: ActivatedRoute, private router: Router) {
    this.creditProposal = this.activatedRoute.snapshot.data['loanAnalys'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
  }
}
