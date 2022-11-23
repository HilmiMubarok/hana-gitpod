import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-collateral-info-temp',
  templateUrl: './collateral-info-temp.component.html',
  styleUrls: ['./collateral-info-cp.style.scss'],
})
export class CollateralInfoTempComponent implements OnInit {
  ngOnInit(): void {
    console.log(this.creditProposal.attributes['proposalType']);
  }
  private _creditProposal: ICreditProposal;

  public selectedMenu: string;
  public menuItems: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'CHECKLIST' }];
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  @Input() isViewMode?: Boolean = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }
}
