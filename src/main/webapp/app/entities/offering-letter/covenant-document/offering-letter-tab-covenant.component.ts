import { Component, OnInit, Input } from '@angular/core';
import { CreditProposal, ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import lodash from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'jhi-offering-letter-tab-covenant',
  templateUrl: './offering-letter-tab-covenant.component.html',
  styleUrls: ['./offering-letter-covenant.css'],
})
export class OfferingLetterTabCovenantComponent implements OnInit {
  public creditProposal: ICreditProposal = new CreditProposal();
  public _creditProposalItem: ICreditProposal;
  attributes: any;

  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'COVENANT' }, { text: 'DOCUMENT CHECKLIST' }];

  // public status: string[] = ['Applied', 'To be waived', 'Waived'];

  // public standardDataGrid: any = dataCovenantBelow;

  // public otherDataGrid: any = [];

  // public covenant?: string;
  // public statusValue: any = [];
  // public deviation: any = [];
  // public justification: any = [];

  // public otherStatus?: string;
  // public otherDeviation?: string;
  // public otherJustification?: string;

  // public finalData: any;
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
