import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core/core';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import lodash from 'lodash';
import { ICreditProposal } from '../credit-proposal.model';

@Component({
  selector: 'jhi-slik-summary',
  templateUrl: './slik-summary.component.html',
  styleUrls: ['./slik.css'],
})
export class SlikSummaryComponent implements OnInit {
  private _creditProposal: ICreditProposal;
  public selectedMenu: string;

  public menuItems: MenuItemModel[] = [];
  public menuItemsAll: MenuItemModel[] = [{ text: 'SLIK SUMMARY' }, { text: 'SLIK IDEB' }];

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;
  }

  constructor() {}

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
    if (!args.element.parentElement.querySelector('.e-select')) {
      args.element.classList.add('e-select');
    } else {
      args.element.parentElement.querySelector('.e-select').classList.remove('e-select');
      args.element.classList.add('e-select');
    }

    this.selectedMenu = args.item.text;
  }
}
