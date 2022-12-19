import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { Subject } from 'rxjs';
import { retry, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

import { ListOfValueIndustryService } from '../list-of-value-industry.service';
import { IListOfValueIndustry } from '../list-of-value-industry.model';
import { CreditProposalService } from '../credit-proposal.service';

@Component({
  selector: 'jhi-credit-proposal-propose-pricing',
  templateUrl: './credit-proposal-propose-pricing.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalProposePricingComponent implements OnInit, OnDestroy, OnChanges {
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
  public Profitability = [];
  public saveWord: Boolean = false;
  @Input() saveWordMinio: any;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public industryList = [];
  public listOfIndustry: IListOfValueIndustry[];

  private ngUnsubscribe = new Subject();

  private paramsId: string;

  public primaryXAxis: Object;
  public primaryYAxis: Object;
  public chartData: Object[] = [];

  public primaryXAxis2: Object;
  public primaryYAxis2: Object;
  public chartData2: Object[] = [];
  dashboardChartData: any[] = [];

  constructor(
    private actRoute: ActivatedRoute,
    public listOfIndustryService: ListOfValueIndustryService,
    public creditProposalService: CreditProposalService
  ) {
    this.countOS = 0;
    this.availableLimit = 0;
    this.totalPlafon = 0;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  public getListIndustry() {
    this.listOfIndustryService.query().subscribe((res: any) => {
      this.listOfIndustry = res.body;

      for (let i = 0; i < res.body.length; i++) {
        this.industryList.push(res.body[i].label);
      }
    });
  }

  public selectIndustry(event: any) {
    for (let i = 0; i < this.listOfIndustry.length; i++) {
      if (this.listOfIndustry[i].label === event.itemData.value) {
        this.creditProposal.attributes['purposePricing'].industry = event.itemData.value;
      }
    }
  }

  public onGetCreditProposal(creditProposal: ICreditProposal): void {
    this._creditProposal = creditProposal;

    this.setValue(creditProposal);
  }

  public availabelLimitArrayUSD = [];
  public OSArrayUSD = [];
  public plafontArrayUSD = [];
  public availableLimitUSD: number;
  public countOSUSD: number;
  public totalPlafonUSD: number;

  public availabelLimitArrayAVG: number;
  public countOSAVG: number;
  public totalPlafonAVG: number;

  public availableLimitUSDAVG: number;
  public countOSUSDAVG: number;
  public totalPlafonUSDAVG: number;
  setValue(creditProposal: any) {
    for (let i = 0; i < creditProposal.products.length; i++) {
      if (creditProposal.products[i].attributes.currency === 'IDR') {
        if (creditProposal.products[i].attributes.availableLimit !== undefined) {
          this.availabelLimitArray.push(creditProposal.products[i].attributes.availableLimit);
        } else {
          this.availabelLimitArray = [];
        }

        if (creditProposal.products[i].attributes.outstanding !== undefined) {
          this.OSArray.push(creditProposal.products[i].attributes.outstanding);
        } else {
          this.OSArray = [];
        }

        if (creditProposal.products[i].attributes.totalPlafond !== undefined) {
          this.plafontArray.push(creditProposal.products[i].attributes.totalPlafond);
        } else {
          this.plafontArray = [];
        }
      } else if (creditProposal.products[i].attributes.currency === 'USD') {
        if (creditProposal.products[i].attributes.availableLimit !== undefined) {
          this.availabelLimitArrayUSD.push(creditProposal.products[i].attributes.availableLimit);
        } else {
          this.availabelLimitArrayUSD = [];
        }

        if (creditProposal.products[i].attributes.outstanding !== undefined) {
          this.OSArrayUSD.push(creditProposal.products[i].attributes.outstanding);
        } else {
          this.OSArrayUSD = [];
        }

        if (creditProposal.products[i].attributes.totalPlafond !== undefined) {
          this.plafontArrayUSD.push(creditProposal.products[i].attributes.totalPlafond);
        } else {
          this.plafontArrayUSD = [];
        }
      }
    }

    this.availableLimit = this.availabelLimitArray.length === 0 ? 0 : this.availabelLimitArray.reduce((a, b) => Number(a) + Number(b));
    this.countOS = this.OSArray.length === 0 ? 0 : this.OSArray.reduce((a, b) => Number(a) + Number(b));
    this.totalPlafon = this.plafontArray.length === 0 ? 0 : this.plafontArray.reduce((a, b) => Number(a) + Number(b));

    this.availableLimitUSD =
      this.availabelLimitArrayUSD.length === 0 ? 0 : this.availabelLimitArrayUSD.reduce((a, b) => Number(a) + Number(b));
    this.countOSUSD = this.OSArrayUSD.length === 0 ? 0 : this.OSArrayUSD.reduce((a, b) => Number(a) + Number(b));
    this.totalPlafonUSD = this.plafontArrayUSD.length === 0 ? 0 : this.plafontArrayUSD.reduce((a, b) => Number(a) + Number(b));

    this.availabelLimitArrayAVG = this.availableLimit / this.availabelLimitArray.length;
    this.countOSAVG = this.countOS / this.OSArray.length;
    this.totalPlafonAVG = this.totalPlafon / this.plafontArray.length;

    this.availableLimitUSDAVG = this.availableLimitUSD / this.availabelLimitArrayUSD.length;
    this.countOSUSDAVG = this.countOSUSD / this.OSArrayUSD.length;
    this.totalPlafonUSDAVG = this.totalPlafonUSD / this.plafontArrayUSD.length;
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
          this.Profitability.push({
            label: 'ID-' + items[i]?.name + '-' + items[i]?.labelData,
            currentProfitability: items[i]?.currentProfitability ? items[i]?.currentProfitability : 0,
            proposedProfitability: items[i]?.industrySpread
              ? items[i]?.industrySpread
              : 0 + items[i]?.targetMargin
              ? items[i]?.targetMargin
              : 0 + items[i]?.normalRate
              ? items[i]?.normalRate
              : 0 + items[i]?.proposedRate
              ? items[i]?.proposedRate
              : 0,
          });
        }
      }
    } else {
      this.selectedMenu = args.item.text;
    }
  }

  ngOnInit(): void {
    this.getListIndustry();
    if (this.creditProposal.attributes['proposalType'] === 'Total Exposure <= IDR 15 Bn') {
      this.menuItems.splice(3, 2);
    }

    this.selectedMenu = 'CALCULATOR, CUSTOMER PROFITABILITY ';
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

    this.defaultCurrency();
  }
  public defaultCurrencyData: string;
  defaultCurrency() {
    const setDate = new Date().toISOString().split('T')[0];

    this.creditProposalService.getCurrency('USD', 'IDR', setDate.replace(/-/g, '')).subscribe(res => {
      this.defaultCurrencyData = res.body[0]?.factor;
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.saveWordMinio) {
      this.saveWord = true;
    }
  }

  spreadPerFacilityEvent(event): void {
    if (event) {
      for (let i = 0; i < event?.length; i++) {
        this.dashboardChartData.push({
          labelData: event[i]?.attributes?.facilityType + ' ' + event[i]?.attributes?.currency,
          name: event[i]?.id,
          cost: Number(event[i]?.attributes?.cost.replace(/%|,/g, '')),
          roaa: Number(event[i]?.attributes?.roaa.replace(/%|,/g, '')),
          currentInterest: Number(this.creditProposal.products[i]?.attributes?.currentInterest),
          normalRate: Number(event[i]?.attributes?.normalRate.replace(/%|,/g, '')),
          discountProposal: Number(event[i]?.attributes?.discountProposal.replace(/%|,/g, '')),
          proposeRate: Number(event[i]?.attributes?.proposedRate.replace(/%|,/g, '')),
          industrySpread: Number(event[i]?.attributes?.industrySpread.replace(/%|,/g, '')),
          targetMargin: Number(event[i]?.attributes?.targetMargin.replace(/%|,/g, '')),
          currentProfitability:
            event[i]?.attributes.currency === 'IDR'
              ? Number(
                  Number(event[i]?.attributes?.currentInterestRate.replace(/%|,/g, '')) -
                    Number(event[i]?.attributes?.cost.replace(/%|,/g, ''))
                ) * 1
              : Number(
                  Number(event[i]?.attributes?.currentInterestRate.replace(/%|,/g, '')) -
                    Number(event[i]?.attributes?.cost.replace(/%|,/g, ''))
                ) * Number(event[i]?.attributes?.kurs.replace(/%|,/g, '')),
        });
      }
    }
  }
}
