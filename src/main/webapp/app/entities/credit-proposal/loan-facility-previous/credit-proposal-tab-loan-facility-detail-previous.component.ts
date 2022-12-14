import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ApplicationProduct, ApplicationProductAttribute, IApplicationProduct } from '../../application-product/application-product.model';
import { ICreditProposal } from '../credit-proposal.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail-previous',
  templateUrl: './credit-proposal-tab-loan-facility-detail-previous.component.html',
  styleUrls: ['../loan-facility/grid/loan.scss', '../loan-facility/credit-proposal-tab-loan-facility-detail.css'],
})
export class CreditProposalTabLoanFacilityDetailPreviousComponent implements OnInit {
  public _creditProposal: ICreditProposal;
  public rateAmountTypeList = ['Rate Percentage', 'Amount IDR', 'Amount USD'];
  public dataFilter = [];

  @Input() isOffering: Boolean = false;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
    if (item.attributes['previousReturn']) {
      this.dataSource = JSON.parse(item.attributes['previousReturn']).products;
    } else if (this.isOffering) {
      this.dataSource = JSON.parse(item.attributes['previousHistory']).products;
    } else {
      this.dataSource = [];
    }
  }

  public applicationProduct: IApplicationProduct;
  public totalInitialLimit?: number;
  public totalChanges?: number;
  public totalAvailableLimit?: number;
  public totalOS?: number;
  public totalCreditLimit?: number;
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
  public newMessage: string;
  public ccy: string;
  public dataSource;

  @Output() outCreditProposal = new EventEmitter<ICreditProposal>();

  public onGetCreditProposal(creditProposal: ICreditProposal): void {
    this._creditProposal = creditProposal;
    this.outCreditProposal.emit(this._creditProposal);
  }

  constructor(protected actRoute: ActivatedRoute) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();
  }

  ngOnInit(): void {
    this.actRoute.params.subscribe(params => {});

    this.setCurrency();
  }

  fungsiSuminit() {
    let result: number;
    result = 0;

    const dataFilter = this.dataSource.filter(obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false);

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      if (filterUsd.length === 0) {
        for (let i = 0; i < dataFilter.length; i++) {
          if (dataFilter[i].attributes.initialLimit !== undefined) {
            result = result + Number(dataFilter[i].attributes.initialLimit);
          }
        }
      }
    }
    this.totallimt = result;
    return result;
  }

  fungsiSumchange() {
    let result: number;
    result = 0;

    const filterSubLimit = this.dataSource.filter(obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false);

    if (filterSubLimit.length > 0) {
      const filterUsd = filterSubLimit.filter(obj => obj.attributes.currency === 'USD');
      if (filterUsd.length === 0) {
        for (let i = 0; i < filterSubLimit.length; i++) {
          if (filterSubLimit[i].attributes.changes !== undefined) {
            result = result + Number(filterSubLimit[i].attributes.changes);
          }
        }
      }
    }
    this.totallimt = result;
    return result;
  }

  public fungsiSumOS() {
    let result: number;
    result = 0;
    let os: number;
    os = 0;

    const dataFilter = this.dataSource.filter(obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false);

    if (dataFilter.length > 0) {
      for (let i = 0; i < dataFilter.length; i++) {
        if (dataFilter[i].attributes.outstanding !== undefined) {
          if (dataFilter[i].attributes.currency === 'USD') {
            os = Number(dataFilter[i].attributes.outstanding) * Number(dataFilter[i].attributes.kurs);
            result = result + os;
          } else {
            result = result + Number(dataFilter[i].attributes.outstanding);
          }
        }
      }
    }
    return result;
  }

  fungsiSumavailable() {
    let result: number;
    result = 0;

    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].attributes.availableLimit !== undefined) {
          result = result + Number(this._creditProposal.products[i].attributes.availableLimit);
        }
      }
    }
    return result;
  }

  fungsiSumcredit() {
    let result: number;
    result = 0;
    let plafond: number;
    plafond = 0;

    const dataFilter = this.dataSource.filter(obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false);

    if (dataFilter.length > 0) {
      for (let i = 0; i < dataFilter.length; i++) {
        if (dataFilter[i].attributes.totalPlafond !== undefined) {
          if (dataFilter[i].attributes.currency === 'USD') {
            plafond = Number(dataFilter[i].attributes.totalPlafond) * Number(dataFilter[i].attributes.kurs);
            result = result + plafond;
          } else {
            result = result + Number(dataFilter[i].attributes.totalPlafond);
          }
        }
      }
    }

    return result;
  }
  // setCurrency
  setCurrency() {
    this.ccy = this.dataSource[0].attributes.currency;
  }
}
