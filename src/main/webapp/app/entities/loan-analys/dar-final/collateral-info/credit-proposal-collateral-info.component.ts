import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';

@Component({
  selector: 'jhi-collateral-info-dar-final',
  templateUrl: './collateral-info-dar-final.component.html',
  styleUrls: ['./collateral-info-cp.style.scss'],
})
export class CollateralInfoDarFinalComponent implements OnInit {
  private _creditProposal: ICreditProposal;
  private _collateralProperties: ICollateralProperty[];

  public selectedMenu: string;
  public menuItemx: MenuItemModel[] = [{ text: 'INFORMATION' }, { text: 'SUMMARY' }];
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

  @Input()
  get collateralProperties() {
    return this._collateralProperties;
  }
  set collateralProperties(item: ICollateralProperty[]) {
    this._collateralProperties = item;
  }

  ngOnInit(): void {
    console.log('collateral properties parent ', this.collateralProperties);
    this.selectedMenu = 'INFORMATION';
  }
}
