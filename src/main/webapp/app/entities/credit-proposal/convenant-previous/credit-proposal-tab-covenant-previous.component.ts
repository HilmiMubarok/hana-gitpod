import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBelow } from './convenant.constant';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import _ from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant-previous',
  templateUrl: './credit-proposal-tab-covenant-previous.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabCovenantPreviousComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'COVENANT' }, { text: 'DEVIATION' }];

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardDataGrid: any = dataCovenantBelow;

  public otherDataGrid: any = [];

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  public otherStatus?: string;
  public otherDeviation?: string;
  public otherJustification?: string;

  public finalData: any;

  public isPreviousSameCurrent: boolean;

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input() setActiveMenu: string;
  @Input() isViewMode: Boolean = false;
  @Input() isOffering: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  ngOnInit(): void {
    this.selectedMenu = !this.setActiveMenu ? 'COVENANT' : this.setActiveMenu;
  }
}
