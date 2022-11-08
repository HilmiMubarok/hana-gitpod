import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core/core';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import lodash from 'lodash';
import { ICreditProposal } from '../credit-proposal.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { IPartyCif, PartyCif } from 'app/entities/party-cif/party-cif.model';

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
  public partyCif: IPartyCif;
  ngOnInit(): void {
    this.partyCifService
      .queryFilterBy({
        page: 0,
        idParty: '00001376',
        size: 1,
        sort: ['desc'],
      })
      .subscribe((res: any) => {
        this.partyCif = res.body[0];
      });
    this.selectedMenu = 'SLIK SUMMARY';
    this.setMenu('');
  }

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;
  }

  constructor(public partyCifService: PartyCifService) {}

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
