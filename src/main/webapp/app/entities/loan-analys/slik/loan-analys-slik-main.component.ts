import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import lodash from 'lodash';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-loan-analys-slik-main',
  templateUrl: './loan-analys-slik-main.component.html',
  styleUrls: ['./loan-analys-slik-main.css'],
})
export class LoanAnalysSlikMainComponent implements OnInit {
  public creditProposal: ICreditProposal;
  private id: number;
  public selectedMenu: string;

  public menuItems: MenuItemModel[] = [];
  public menuItemsAll: MenuItemModel[] = [{ text: 'SLIK SUMMARY' }, { text: 'SLIK IDEB' }];

  constructor(protected activatedRoute: ActivatedRoute, protected messageService: MessageService) {
    this.creditProposal = this.activatedRoute.snapshot.data['loanAnalys'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });
  }
  ngOnInit(): void {
    this.selectedMenu = 'SLIK SUMMARY';
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
  public previousState(): void {
    window.history.back();
  }
}
