import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBelow, dataCovenantAbove, dataCovenantBackToBackGeneral, dataCovenantBackToBackDeposit } from './convenant.constant';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import lodash from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-credit-proposal-tab-covenant',
  templateUrl: './credit-proposal-tab-covenant.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabCovenantComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'COVENANT' }, { text: 'DEVIATION' }, { text: 'DOCUMENT CHECKLIST' }];

  public status: string[] = ['Applied', 'To be waived', 'Waived'];

  public standardDataGrid: any = dataCovenantBelow;
  public standardDataGridBackToBackGeneral: any = dataCovenantBackToBackGeneral;
  public standardDataGridBackToBackDeposit: any = dataCovenantBackToBackDeposit;
  public standardDataGridAbove: any = dataCovenantAbove;

  public otherDataGrid: any = [];

  public covenant?: string;
  public statusValue: any = [];
  public deviation: any = [];
  public justification: any = [];

  public otherStatus?: string;
  public otherDeviation?: string;
  public otherJustification?: string;
  public _isViewMode: boolean;

  public finalData: any;
  public compareData: boolean;

  constructor(public router: Router) {
    this.compareData = this.router.url.split('=').indexOf('compare-data') > -1;
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input() setActiveMenu: string;

  @Input() isOnOffering: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  @Input()
  get isViewMode() {
    return this._isViewMode;
  }

  set isViewMode(item: boolean) {
    this._isViewMode = item;
  }

  ngOnInit(): void {
    this.selectedMenu = !this.setActiveMenu ? 'COVENANT' : this.setActiveMenu;
  }
}
