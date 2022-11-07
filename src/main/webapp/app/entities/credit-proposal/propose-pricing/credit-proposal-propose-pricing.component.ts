import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { Subject } from 'rxjs';
import { retry, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

import { ILoadedEventArgs, ChartTheme } from '@syncfusion/ej2-angular-charts';
import { Browser } from '@syncfusion/ej2-base';

@Component({
  selector: 'jhi-credit-proposal-propose-pricing',
  templateUrl: './credit-proposal-propose-pricing.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalProposePricingComponent implements OnInit, OnDestroy {
  @ViewChild('dropdownlistdata')
  public dropDownListObject: DropDownListComponent;
  private _creditProposal: ICreditProposal;
  public selectedMenu: string;
  public availabelLimitArray = [];
  public OSArray = [];
  public plafontArray = [];
  public countOS: number;
  public availableLimit: number;
  public totalPlafon: number;
  public industry: string;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public industryList: object = [
    'Agriculture (Farm Food Crops)',
    'Construction',
    'Consumer - Household',
    'Education Services',
    'Fishery',
    'Health Services',
    'Hotel',
    'IT Services',
    'Livestock',
    'Logistic - Port Handling, Warehousing & Packaging Handling',
    'Manufacturing - Apparel',
    'Manufacturing - Automotive',
    'Manufacturing - Basic Metals',
    'Manufacturing - Chemical Product (Incl. Pharmaceutical)',
    'Manufacturing - F&B',
    'Manufacturing - Furniture',
    'Manufacturing - Leather Footwear',
    'Manufacturing - Machinery & Electronic',
    'Manufacturing - Metal Products',
    'Manufacturing - Non Metallic Quarrying',
    'Manufacturing - Other Transport',
    'Manufacturing - Plastic & Plastics Products',
    'Manufacturing - Publishing & Printing',
    'Manufacturing - Pulp & Paper',
    'Manufacturing - Rubber & Rubber Products',
    'Manufacturing - Textile',
    'Manufacturing - Wood & Rattan Products',
    'Mining & Quarrying Metal Ores',
    'Mining & Quarrying-Coal, Rock, Clay, Sand, Oil & Gas',
    'Non Bank FI - BPR',
    'Non Bank FI - Multifinance',
    'Non Bank FI - Other (Securities, Venture Capital & Insurance)',
    'Other Services - Renting, Consultancy, Advertising, Cleaning, Etc.',
    'Real Estate - Industrial',
    'Real Estate - Office',
    'Real Estate - Residential',
    'Real Estate - Retail',
    'Restaurant',
    'Telecommunication',
    'Tourism',
    'Trading',
    'Transportation - Land And Water',
    'Transportation - Railway And Aviation',
    'Utility And Power Plant',
  ];

  private ngUnsubscribe = new Subject();

  private paramsId: string;

  public primaryXAxis: Object;
  public primaryYAxis: Object;
  public chartData: Object[] = [];

  public primaryXAxis2: Object;
  public primaryYAxis2: Object;
  public chartData2: Object[] = [];
  dashboardChartData: any[] = [];

  constructor(private actRoute: ActivatedRoute) {
    this.countOS = 0;
    this.availableLimit = 0;
    this.totalPlafon = 0;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  public onGetCreditProposal(creditProposal: ICreditProposal): void {
    this._creditProposal = creditProposal;

    this.setValue(creditProposal);
  }

  setValue(creditProposal: any) {
    for (let i = 0; i < creditProposal.products.length; i++) {
      if (creditProposal.products[i].attributes.availableLimit !== undefined) {
        this.availabelLimitArray.push(creditProposal.products[i].attributes.availableLimit);
      } else {
        this.availabelLimitArray = [];
      }

      if (creditProposal.products[i].attributes.os !== undefined) {
        this.OSArray.push(creditProposal.products[i].attributes.os);
      } else {
        this.OSArray = [];
      }

      if (creditProposal.products[i].attributes.totalPlafond !== undefined) {
        this.plafontArray.push(creditProposal.products[i].attributes.totalPlafond);
      } else {
        this.plafontArray = [];
      }
    }

    this.availableLimit = this.availabelLimitArray.length === 0 ? 0 : this.availabelLimitArray.reduce((a, b) => Number(a) + Number(b));
    this.countOS = this.OSArray.length === 0 ? 0 : this.OSArray.reduce((a, b) => Number(a) + Number(b));
    this.totalPlafon = this.plafontArray.length === 0 ? 0 : this.plafontArray.reduce((a, b) => Number(a) + Number(b));
  }

  public menuItems: MenuItemModel[] = [{ text: 'CALCULATOR' }, { text: 'DASHBOARD' }, { text: 'CUSTOMER PROFITABILITY' }];

  public selectMenuItem(args: MenuEventArgs): void {
    if (args.item.text === 'DASHBOARD') {
      if (this.dashboardChartData.length <= 0) {
        alert('Please click generate button on Loan Facility Detail');
      } else {
        this.selectedMenu = args.item.text;
        const items = this.dashboardChartData;
        for (let i = 0; i < items.length; i++) {
          this.chartData2.push({
            label: 'ID-' + items[i]?.name,
            roaa: items[i]?.roaa ? items[i]?.roaa : 0,
            cost: items[i]?.cost ? items[i]?.cost : 0,
          });
          this.chartData.push({
            label: 'ID-' + items[i]?.name,
            currentInterestRate: items[i]?.currentInterest ? items[i]?.currentInterest : 0,
            normalRate: items[i]?.normalRate ? items[i]?.normalRate : 0,
            discountProposal: items[i]?.discountProposal ? items[i]?.discountProposal : 0,
            proposedRate: items[i]?.proposeRate ? items[i]?.proposeRate : 0,
          });
        }
      }
    } else {
      this.selectedMenu = args.item.text;
    }
  }

  ngOnInit(): void {
    if (this.creditProposal.attributes['proposalType'] === 'Total Exposure <= IDR 15 Bn') {
      this.menuItems.splice(2, 1);
    }

    this.selectedMenu = 'CALCULATOR ,  CUSTOMER PROFITABILITY';
    this.actRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.paramsId = params['id'];
    });

    if (this.creditProposal.products.length > 1) {
      this.setValue(this.creditProposal);
    }

    this.primaryXAxis = {
      valueType: 'Category',
    };
    this.primaryYAxis = {
      labelFormat: '{value}%',
    };

    this.primaryXAxis2 = {
      valueType: 'Category',
    };
    this.primaryYAxis2 = {
      labelFormat: '{value}%',
    };
    /* this.primaryYAxis2 = {
      minimum: -2,
      maximum: 8,
      interval: 2,
      labelFormat: '{value}%',
    }; */
  }

  spreadPerFacilityEvent(event): void {
    if (event) {
      for (let i = 0; i < event?.length; i++) {
        this.dashboardChartData.push({
          name: event[i]?.id,
          cost: Number(event[i]?.attributes?.cost.replace(/%|,/g, '')),
          roaa: Number(event[i]?.attributes?.roaa.replace(/%|,/g, '')),
          currentInterest: Number(this.creditProposal.products[i]?.attributes?.currentInterest),
          normalRate: Number(event[i]?.attributes?.normalRate.replace(/%|,/g, '')),
          discountProposal: Number(event[i]?.attributes?.discountProposal.replace(/%|,/g, '')),
          proposeRate: Number(event[i]?.attributes?.proposedRate.replace(/%|,/g, '')),
        });
      }
    }
  }
}
