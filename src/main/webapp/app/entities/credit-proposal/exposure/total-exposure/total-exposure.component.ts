import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { Internationalization } from '@syncfusion/ej2-base';
import lodash from 'lodash';

@Component({
  selector: 'jhi-total-exposure',
  templateUrl: './total-exposure.component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css'],
})
export class TotalExposureComponent implements OnInit, OnChanges {
  public selectedMenu: string;
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public data: string[] = ['25% (Basic)', '30%(BUMN)', '10%(RelatedN Party)'];
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

  public numericFormatOptions: Object = { format: 'N' };

  // public data1: Object[] = [];

  // public valueAccess = (field: string, data1: Object, column: Object) => data1[field] = this.format("$ ###.00", data1[field]);

  format(format, value) {
    const intl: Internationalization = new Internationalization();
    const nParser: Function = intl.getNumberParser({ format });
    const val: string = intl.formatNumber(value, { format });
    return val;
  }

  ngOnInit(): void {
    this.selectedMenu = 'TOTAL EXPOSURE';
    this.setMenu('');
    console.log('data ini', this._creditProposal.products);
  }

  private setMenu(value: string): void {
    this.menuItems = lodash.clone(this.menuItemsAll);
    const compareVal = value === '' ? this.creditProposal.attributes.proposalType : value;
    if (compareVal === 'Total Exposure > IDR 15 Bn') {
      this.spliceMenus(['TOTAL EXPOSURE,LEGAL LENDING LIMIT,INDUSTRY LIMIT EXPOSURE']);
      if (compareVal === 'Total Exposure Back to Back') {
        this.spliceMenus(['TOTAL EXPOSURE']);
      }
      if (compareVal === 'Total Exposure < IDR 15 Bn') {
        this.spliceMenus(['TOTAL EXPOSURE']);
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

  public init = 0;
  public init2 = 0;
  public change = 0;
  public os = 0;
  public credit = 0;
  public available = 0;
  public totallimt = 0;
  public totalos = 0;
  public totalchange = 0;
  public totalcredit = 0;
  public totalavilable = 0;
  public change2 = 0;
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

  ngOnChanges(changes: SimpleChanges) {
    this.fungsiSuminit();
    this.fungsiSumchange();
    this.fungsiSumOS();
    this.fungsiSumcredit();
    this.fungsiSumavailable();
  }

  fungsiSumcredit() {
    this.totalcredit = this.change + this.init;
  }

  fungsiSuminit() {
    for (let i = 0; i < this._creditProposal.products.length; i++) {
      if (this._creditProposal.products[i].attributes.initialLimit === undefined) {
        console.log('masuk limit');
        console.log('initial limit', this._creditProposal.products[i].attributes.initialLimit);
      } else {
        this.init = this.init + Number(this._creditProposal.products[i].attributes.initialLimit);
        // console.log('ada limit');
        // console.log('initial limit', this._creditProposal.products[i].attributes.initialLimit);
      }
    }
  }
  fungsiSumchange() {
    for (let i = 0; i < this._creditProposal.products.length; i++) {
      if (this._creditProposal.products[i].attributes.changes === undefined) {
        console.log('masuk');
      } else {
        this.change = this.change + Number(this._creditProposal.products[i].attributes.changes);
        // console.log(this._creditProposal.products[i].attributes.changes);
      }
    }
  }
  fungsiSumOS() {
    for (let i = 0; i < this._creditProposal.products.length; i++) {
      if (this._creditProposal.products[i].attributes.outstanding === undefined) {
        console.log('masuk');
      } else {
        this.os = this.os + Number(this._creditProposal.products[i].attributes.outstanding);
        // console.log(this._creditProposal.products[i].attributes.outstanding);
      }
    }
  }
  fungsiSumavailable() {
    for (let i = 0; i < this._creditProposal.products.length; i++) {
      if (this._creditProposal.products[i].attributes.availableLimit === undefined) {
        console.log('tidak masuk available');
      } else {
        this.available = this.available + Number(this._creditProposal.products[i].attributes.availableLimit);
        // console.log('ada available');
        // console.log(this._creditProposal.products[i].attributes.availableLimit);
      }
    }
  }

  print() {
    // console.log('item nih', this._creditProposal);
  }
}
