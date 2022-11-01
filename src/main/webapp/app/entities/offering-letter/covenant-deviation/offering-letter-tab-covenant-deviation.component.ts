import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import lodash from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'jhi-offering-letter-tab-covenant-deviation',
  templateUrl: './offering-letter-tab-covenant-deviation.component.html',
  styleUrls: ['./offering-letter-covenant.css'],
})
export class OfferingLetterTabCovenantDeviationComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'COVENANT' }, { text: 'DEVIATION' }];

  public view: boolean;

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: any) {
    this._creditProposalItem = item;
  }

  ngOnInit(): void {
    this.selectedMenu = 'COVENANT';
  }
}
