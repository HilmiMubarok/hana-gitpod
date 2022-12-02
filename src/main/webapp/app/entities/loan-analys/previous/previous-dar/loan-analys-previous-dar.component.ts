import { Component, Input, OnInit } from '@angular/core';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

@Component({
  selector: 'jhi-loan-analys-previous-dar',
  templateUrl: './loan-analys-previous-dar.component.html',
  styleUrls: ['../loan-analys-previous-dar.css'],
})
export class LoanAnalysPreviousDarComponent implements OnInit {
  public selectedMenu: string;
  public menuCovenant = 'COVENANT';
  public menuDeviation = 'DEVIATION';

  public menuItemsAll: MenuItemModel[] = [{ text: 'PREVIOUS DAR' }, { text: 'PREVIOUS PROPOSAL' }];
  ngOnInit(): void {
    this.selectedMenu = 'PREVIOUS DAR';
  }

  public setMenu(value): void {
    this.selectedMenu = value.item.properties.text;
  }

  public onProposalTypeChange(value: any): void {
    this.setMenu(value.value);
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public _creditProposal: ICreditProposal;
  public creditProposalItem: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(param: ICreditProposal) {
    this._creditProposal = param;
  }
}
