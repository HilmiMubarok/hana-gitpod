import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-collateral-info-history',
  templateUrl: './collateral-info-history.component.html',
  styleUrls: ['./collateral-info-cp.style.scss'],
})
export class CollateralInfoHistoryComponent implements OnInit {
  public pacth: any;
  public view: boolean;

  constructor(protected activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    console.log(this.creditProposal.attributes['proposalType']);

    this.removemenu();
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
  public removemenu() {
    this.pacth = this.router.url.split('/')[1];
    if (
      this.pacth === 'la-approval' ||
      (this.pacth === 'cp-status-approval' && this.creditProposal.attributes['proposalType'] === '') ||
      this.creditProposal.attributes['proposalType'] === null
    ) {
      this.view = true;
      this.selectedMenu = 'CHECKLIST';
    }
  }
}
