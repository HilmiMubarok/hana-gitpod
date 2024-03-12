import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';
import { IApplicationProduct } from 'app/entities/application-product/application-product.model';

@Component({
  selector: 'jhi-loan-facility-detail-calculation',
  templateUrl: './loan-facility-detail-calculation.component.html',
  styleUrls: ['../grid/loan.scss', '../credit-proposal-tab-loan-facility-detail.css'],
})
export class LoanFacilityDetailCalculationComponent implements OnChanges {
  public _creditProposal: ICreditProposal;

  @Input() isViewMode: Boolean = false;
  @Input() takeOutCompare: Boolean = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
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

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      this.fungsiSuminit('IDR');
      this.fungsiSuminit('USD');
      this.fungsiSuminit('both');
      this.fungsiSumchange('IDR');
      this.fungsiSumchange('USD');
      this.fungsiSumchange('both');
      this.fungsiSumOS('IDR');
      this.fungsiSumOS('USD');
      this.fungsiSumOS('both');
      this.fungsiSumcredit('IDR');
      this.fungsiSumcredit('USD');
      this.fungsiSumcredit('both');
      this.fungsiSumavailable();
      this.fungsiSuminitCalculation(changes.creditProposal.currentValue);
      this.fungsiSumchangeCalculation(changes.creditProposal.currentValue);
      this.fungsiSumOSCalculation(changes.creditProposal.currentValue);
      this.fungsiSumcreditCalculation(changes.creditProposal.currentValue);
    }
  }

  public fungsiSuminitCalculation(creditProposal: ICreditProposal) {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.initialLimit !== undefined) {
            result = result + Number(filterIdr[i].attributes.initialLimit);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.initialLimit !== undefined) {
            dolar = dolar + Number(filterUsd[i].attributes.initialLimit) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }

    this.creditProposal.attributes['calculationExposure'].initialLimitDebtor = result + dolar;
  }

  public fungsiSumchangeCalculation(creditProposal: ICreditProposal) {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.changes !== undefined) {
            result = result + Number(filterIdr[i].attributes.changes);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.changes !== undefined) {
            dolar = dolar + Number(filterUsd[i].attributes.changes) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }

    this.creditProposal.attributes['calculationExposure'].totalChangeDebtor = result + dolar;
  }

  public fungsiSumOSCalculation(creditProposal: ICreditProposal) {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.outstanding !== undefined) {
            result = result + Number(filterIdr[i].attributes.outstanding);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.outstanding !== undefined) {
            dolar = dolar + Number(filterUsd[i].attributes.outstanding) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }

    this.creditProposal.attributes['calculationExposure'].subTotalDebtor = result + dolar;
  }

  public fungsiSumcreditCalculation(creditProposal: ICreditProposal) {
    let result: number;
    let dolar: number;
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.totalPlafond !== undefined) {
            result = result + Number(filterIdr[i].attributes.totalPlafond);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.totalPlafond !== undefined) {
            dolar = dolar + Number(filterUsd[i].attributes.totalPlafond) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }
    this.creditProposal.attributes['calculationExposure'].totalPLafondDebtor = result + dolar;
  }

  fungsiSuminit(value: string) {
    let result: number;
    let dolar: number;
    let filterUsd = [];
    let filterIdr = [];
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      if (value === 'USD' || value === 'both') {
        filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      }

      if (value === 'IDR' || value === 'both') {
        filterIdr = dataFilter.filter(obj => obj.currencyId === 'IDR');
      }

      if (value === 'IDR' || value === 'both') {
        if (filterIdr.length > 0) {
          for (let i = 0; i < filterIdr.length; i++) {
            if (filterIdr[i].initialLimit !== null) {
              result = result + Number(filterIdr[i].initialLimit);
            }
          }
        }
      }

      if (value === 'USD') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].initialLimit !== undefined) {
              dolar = dolar + Number(filterUsd[i].initialLimit);
            }
          }
        }
      }

      if (value === 'both') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].initialLimit !== undefined) {
              dolar = dolar + Number(filterUsd[i].initialLimit) * Number(filterUsd[i].kurs);
            }
          }
        }
      }
    }
    if (value === 'both') {
      this.creditProposal.attributes['facilityDetail'].totalInitialLimit = result + dolar;
    }
    if (value === 'USD') {
      this.creditProposal.attributes['facilityDetail'].totalInitialLimitUsd = result + dolar;
    }
    if (value === 'IDR') {
      this.creditProposal.attributes['facilityDetail'].totalInitialLimitIdr = result + dolar;
    }
    return result + dolar;
  }

  fungsiSumchange(value: string) {
    let result: number;
    let dolar: number;
    let filterUsd = [];
    let filterIdr = [];
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      if (value === 'USD' || value === 'both') {
        filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      }

      if (value === 'IDR' || value === 'both') {
        filterIdr = dataFilter.filter(obj => obj.currencyId === 'IDR');
      }

      if (value === 'IDR' || value === 'both') {
        if (filterIdr.length > 0) {
          for (let i = 0; i < filterIdr.length; i++) {
            if (filterIdr[i].changes !== null) {
              result = result + Number(filterIdr[i].changes);
            }
          }
        }
      }

      if (value === 'USD') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].changes !== null) {
              dolar = dolar + Number(filterUsd[i].changes);
            }
          }
        }
      }

      if (value === 'both') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].changes !== null) {
              dolar = dolar + Number(filterUsd[i].changes) * Number(filterUsd[i].kurs);
            }
          }
        }
      }
    }
    if (value === 'both') {
      this.creditProposal.attributes['facilityDetail'].totalChanges = result + dolar;
    }
    if (value === 'USD') {
      this.creditProposal.attributes['facilityDetail'].totalChangesUsd = result + dolar;
    }
    if (value === 'IDR') {
      this.creditProposal.attributes['facilityDetail'].totalChangesIdr = result + dolar;
    }
    return result + dolar;
  }

  public fungsiSumOS(value: string) {
    let result: number;
    let dolar: number;
    let filterIdr = [];
    let filterUsd = [];
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      if (value === 'USD' || value === 'both') {
        filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      }

      if (value === 'IDR' || value === 'both') {
        filterIdr = dataFilter.filter(obj => obj.currencyId === 'IDR');
      }

      if (value === 'IDR' || value === 'both') {
        if (filterIdr.length > 0) {
          for (let i = 0; i < filterIdr.length; i++) {
            if (filterIdr[i].outstanding !== null) {
              result = result + Number(filterIdr[i].outstanding);
            }
          }
        }
      }

      if (value === 'USD') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].outstanding !== null) {
              dolar = dolar + Number(filterUsd[i].outstanding);
            }
          }
        }
      }

      if (value === 'both') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].outstanding !== null) {
              dolar = dolar + Number(filterUsd[i].outstanding) * Number(filterUsd[i].kurs);
            }
          }
        }
      }
    }
    if (value === 'both') {
      this.creditProposal.attributes['facilityDetail'].totalOs = result + dolar;
    }
    if (value === 'USD') {
      this.creditProposal.attributes['facilityDetail'].totalOsUsd = result + dolar;
    }
    if (value === 'IDR') {
      this.creditProposal.attributes['facilityDetail'].totalOsIdr = result + dolar;
    }
    return result + dolar;
  }

  fungsiSumavailable() {
    let result: number;
    result = 0;

    if (this._creditProposal.products.length > 0) {
      for (let i = 0; i < this._creditProposal.products.length; i++) {
        if (this._creditProposal.products[i].availableLimit !== null) {
          result = result + Number(this._creditProposal.products[i].availableLimit);
        }
      }
    }
    return result;
  }

  fungsiSumcredit(value: string) {
    let result: number;
    let dolar: number;
    let filterIdr = [];
    let filterUsd = [];
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(obj => obj.subLimit === false);

    if (dataFilter.length > 0) {
      if (value === 'USD' || value === 'both') {
        filterUsd = dataFilter.filter(obj => obj.currencyId === 'USD');
      }

      if (value === 'IDR' || value === 'both') {
        filterIdr = dataFilter.filter(obj => obj.currencyId === 'IDR');
      }

      if (value === 'IDR' || value === 'both') {
        if (filterIdr.length > 0) {
          for (let i = 0; i < filterIdr.length; i++) {
            if (filterIdr[i].totalPlafond !== undefined) {
              result = result + Number(filterIdr[i].totalPlafond);
            }
          }
        }
      }

      if (value === 'USD') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].totalPlafond !== undefined) {
              dolar = dolar + Number(filterUsd[i].totalPlafond);
            }
          }
        }
      }

      if (value === 'both') {
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].totalPlafond !== undefined) {
              dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
            }
          }
        }
      }
    }
    if (value === 'both') {
      this.creditProposal.attributes['facilityDetail'].totalPlafond = result + dolar;
    }
    if (value === 'USD') {
      this.creditProposal.attributes['facilityDetail'].totalPlafondUsd = result + dolar;
    }
    if (value === 'IDR') {
      this.creditProposal.attributes['facilityDetail'].totalPlafondIdr = result + dolar;
    }
    return result + dolar;
  }
}
