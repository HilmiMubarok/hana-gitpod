import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { ItemModel, MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { CreditProposalService } from '../credit-proposal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { HttpResponse } from '@angular/common/http';
import { AccordionComponent } from '@syncfusion/ej2-angular-navigations';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import lodash from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-tab-exposure',
  templateUrl: './credit-proposal-tab-exposure.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabExposureComponent implements OnInit {
  public selectedMenu: string;
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }
  public numericFormatOptions: Object = { format: 'N' };

  public data: string[] = ['25% (Basic)', '30%(BUMN)', '10%(Related Party)'];
  public menuItems: MenuItemModel[] = [];
  public menuItemsAll: MenuItemModel[] = [
    { text: 'TOTAL EXPOSURE' },
    {
      text: 'INDUSTRY LIMIT EXPOSURE',
    },
    {
      text: 'LEGAL LENDING LIMIT',
    },
  ];

  public value: string;
  ngOnInit(): void {
    this.selectedMenu = 'TOTAL EXPOSURE';
    this.setMenu('');
  }

  private setMenu(value: string): void {
    this.menuItems = lodash.clone(this.menuItemsAll);
    const compareVal = value === '' ? this.creditProposal.attributes.proposalType : value;
    if (compareVal === 'Total Exposure > IDR 15 Bio') {
      this.spliceMenus(['TOTAL EXPOSURE,LEGAL LENDING LIMIT,INDUSTRY LIMIT EXPOSURE']);
      if (compareVal === 'Total Exposure Back to Back') {
        this.spliceMenus(['TOTAL EXPOSURE']);
      }
      if (compareVal === 'Total Exposure <= IDR 15 Bio') {
        this.spliceMenus(['TOTAL EXPOSURE,LEGAL LENDING LIMIT,INDUSTRY LIMIT EXPOSURE']);
      }
    } else {
      this.spliceMenus(['INDUSTRY LIMIT EXPOSURE, LEGAL LENDING LIMIT,TOTAL EXPOSURE']);
    }
  }

  public onProposalTypeChange(value: any): void {
    this.setMenu(value.value);
  }

  private spliceMenus(menus: string[]): void {
    for (let i = 0; i < menus.length; i++) {
      for (let j = 0; j < this.menuItems.length; j++) {
        if (this.menuItems[j].text === menus[i]) {
          this.menuItems.splice(j, 1);
        }
      }
    }
  }
  public _item: ICreditProposal = new CreditProposal();
  public dataGrid: any = [];

  public _creditProposal: ICreditProposal;
  public itemCollateral: ICreditProposal;
  public _exposure: string;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  @Input()
  // get projectAnalysis() {
  //   return this._exposure;
  // }
  // set projectAnalysis(item: any) {
  //   this.selectedMenu = 'TOTAL EXPOSURE';
  // }

  // @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }
}
