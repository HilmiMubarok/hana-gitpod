import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core/core';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import lodash from 'lodash';
import { ICreditProposal } from '../credit-proposal.model';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { IPartyCif, PartyCif } from 'app/entities/party-cif/party-cif.model';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';

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
  public data = [];
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  // The Dialog shows within the target element.
  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;

  public dialogVisibility = false;
  // Sample level code to handle the button click action
  public onOpenDialog(event: any): void {
    // Call the show method to open the Dialog
    this.ejDialog.show();
  }
  // Sample level code to hide the Dialog when click the Dialog overlay
  public onOverlayClick: EmitType<object> = () => {
    this.ejDialog.hide();
  };

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;

    this.partyCifService
      .queryFilterBy({
        page: 0,
        idParty: object.cif.partyId,
        size: 1,
        sort: ['desc'],
      })
      .subscribe((res: any) => {
        this.partyCif = res.body[0];
      });
  }
  ngOnInit(): void {
    this.selectedMenu = 'SLIK SUMMARY';
    this.setMenu('');
  }

  constructor(public partyCifService: PartyCifService) {}

  private setMenu(value: string): void {
    this.menuItems = lodash.clone(this.menuItemsAll);
  }

  public addItem(event: any) {
    this.data = [...this.data, event[0]];
    this.creditProposal.attributes['basicInformation'].coborowed = this.data;
    this.ejDialog.hide();
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
