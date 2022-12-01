import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBelow, dataCovenantAbove } from './convenant.constant';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import lodash from 'lodash';

@Component({
  selector: 'jhi-covenant-temp',
  templateUrl: './credit-proposal-tab-covenant.component.html',
  styleUrls: ['../../../credit-proposal/css/credit-proposal-basic-information.css'],
})
export class CovenantTempComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'COVENANT' }, { text: 'DEVIATION' }, { text: 'DOCUMENT CHECKLIST' }];

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

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input() setActiveMenu: string;
  @Input() isViewMode: Boolean = false;

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
