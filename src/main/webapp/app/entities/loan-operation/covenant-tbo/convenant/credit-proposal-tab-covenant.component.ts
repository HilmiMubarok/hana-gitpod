import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { dataCovenantBelow, dataCovenantBackToBackDeposit, dataCovenantBackToBackGeneral, dataCovenantAbove } from './convenant.constant';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import lodash from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-covenant-loan',
  templateUrl: './credit-proposal-tab-covenant.component.html',
  styleUrls: ['../../../credit-proposal/css/credit-proposal-basic-information.css'],
})
export class CovenantLoanComponent implements OnInit {
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

  public finalData: any;

  constructor(private router: Router) {}

  get viewMode(): Boolean {
    const cpStatus = this.creditProposalItem.statusId;

    const enabledStatus = ['CP_DAR_FINAL', 'CP_LOAN_COMMITTEE', 'PK_DAR_REVISION'];

    if (enabledStatus.includes(cpStatus)) {
      if (this.router.url.split('subroute=')[1] === 'compare-data') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input() setActiveMenu: string;
  @Input() isViewMode: Boolean = false;
  @Input() isOnOffering: Boolean = false;
  @Input() takeOutCompare: Boolean = false;

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
