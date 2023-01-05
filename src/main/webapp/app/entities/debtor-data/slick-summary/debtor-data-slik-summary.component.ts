import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { IPartyCif, PartyCif } from 'app/entities/party-cif/party-cif.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-debtor-data-slik-summary',
  templateUrl: './debtor-data-slik-summary.component.html',
  styleUrls: ['./slik.css'],
})
export class DebtorDataSlikSummaryComponent implements OnInit, OnChanges {
  public selectedMenu: string;
  // public menuItemsAll: MenuItemModel[] = [{ text: 'SLIK SUMMARY' }, { text: 'SLIK IDEB' }];
  public menuItems: MenuItemModel[] = [];
  @Input() mode: 'view' | 'edit';
  public _partyCif: IPartyCif;
  public cif: IPartyCif;

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(item: IPartyCif) {
    this._partyCif = item;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cif = changes.partyCif.currentValue;
  }

  ngOnInit(): void {
    this.selectedMenu = 'SLIK SUMMARY';
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
