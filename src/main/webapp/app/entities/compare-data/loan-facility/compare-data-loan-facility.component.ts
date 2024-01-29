import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal/credit-proposal.model';
import { CompareDataService } from '../services/compare-data.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IApplicationProduct } from '../../application-product/application-product.model';

type Currency = 'USD' | 'IDR' | 'both';

@Component({
  selector: 'jhi-compare-data-loan-facility',
  templateUrl: './compare-data-loan-facility.component.html',
  styleUrls: [
    '../../credit-proposal/loan-facility/grid/loan.scss',
    '../../credit-proposal/loan-facility/credit-proposal-tab-loan-facility-detail.css',
  ],
})
export class CompareDataLoanFacilityComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dataFrom!: string;

  public creditProposal!: ICreditProposal;
  public loadingPreviousDar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  #destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(protected actRoute: ActivatedRoute, private compareDataService: CompareDataService) {
    this.compareDataService.creditProposal.pipe(takeUntil(this.#destroy$)).subscribe((data: ICreditProposal) => {
      this.creditProposal = data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataFrom) {
      this.dataFrom = changes.dataFrom.currentValue;
    }
  }

  ngOnInit(): void {
    this.getHistoryAttributes();
  }

  ngOnDestroy(): void {
    this.#destroy$.next(true);
    this.#destroy$.unsubscribe();
  }

  public cpDynamicAttributeData: any;
  getHistoryAttributes() {
    if (this.dataFrom === 'previousHistory') {
      this.cpDynamicAttributeData = this.creditProposal.attributes.previousHistory;
    } else if (this.dataFrom === 'previousReturn') {
      this.cpDynamicAttributeData = this.creditProposal.attributes.previousReturn;
    } else if (this.dataFrom === 'darRevHistory') {
      this.cpDynamicAttributeData = this.creditProposal.attributes.darRevHistory;
    } else if (this.dataFrom === 'previousDar') {
      this.compareDataService.creditProposalPreviousDar.pipe(takeUntil(this.#destroy$)).subscribe(data => {
        this.cpDynamicAttributeData = data;
      });
    } else {
      this.cpDynamicAttributeData = this.creditProposal;
    }
  }

  /**
   * Calculates the sum of initial limits for a given currency.
   * @param currency - The currency to filter by ('USD', 'IDR', or 'both').
   * @returns The sum of initial limits for the specified currency.
   */
  sumInitialLimit(currency: Currency): number {
    let result = 0;
    let dollar = 0;
    let filterUsd: any[] = [];
    let filterIdr: any[] = [];

    const dataFilter = this.cpDynamicAttributeData.products.filter((obj: IApplicationProduct) => obj.subLimit === false);

    if (dataFilter.length > 0) {
      if (currency === 'USD' || currency === 'both') {
        filterUsd = dataFilter.filter((obj: IApplicationProduct) => obj.currencyId === 'USD');
      }

      if (currency === 'IDR' || currency === 'both') {
        filterIdr = dataFilter.filter((obj: IApplicationProduct) => obj.currencyId === 'IDR');
      }

      if (currency === 'IDR' || currency === 'both') {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].initialLimit !== null) {
            result += Number(filterIdr[i].initialLimit);
          }
        }
      }

      if (currency === 'USD') {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].initialLimit !== undefined) {
            dollar += Number(filterUsd[i].initialLimit);
          }
        }
      }

      if (currency === 'both') {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].initialLimit !== undefined) {
            dollar += Number(filterUsd[i].initialLimit) * Number(filterUsd[i].kurs);
          }
        }
      }
    }

    return result + dollar;
  }

  /**
   * Calculates the sum of changes for a given currency.
   * @param currency - The currency to filter by ('USD', 'IDR', or 'both').
   * @returns The sum of changes for the specified currency.
   */
  sumTotalChange(currency: Currency): number {
    let result = 0;
    let dollar = 0;

    const dataFilter: any[] = this.cpDynamicAttributeData.products.filter((obj: IApplicationProduct) => obj.subLimit === false);

    if (dataFilter.length > 0) {
      const filterUsd: any[] =
        currency === 'USD' || currency === 'both' ? dataFilter.filter((obj: IApplicationProduct) => obj.currencyId === 'USD') : [];
      const filterIdr: any[] =
        currency === 'IDR' || currency === 'both' ? dataFilter.filter((obj: IApplicationProduct) => obj.currencyId === 'IDR') : [];

      if (currency === 'IDR' || currency === 'both') {
        result = filterIdr.reduce((acc: number, obj: IApplicationProduct) => {
          if (obj.changes !== null) {
            return acc + Number(obj.changes);
          } else {
            return acc;
          }
        }, result);
      }

      if (currency === 'USD') {
        dollar = filterUsd.reduce((acc: number, obj: IApplicationProduct) => {
          if (obj.changes !== null) {
            return acc + Number(obj.changes);
          } else {
            return acc;
          }
        }, dollar);
      }

      if (currency === 'both') {
        dollar = filterUsd.reduce((acc: number, obj: IApplicationProduct) => {
          if (obj.changes !== null) {
            return acc + Number(obj.changes) * Number(obj.kurs);
          } else {
            return acc;
          }
        }, dollar);
      }
    }

    return result + dollar;
  }

  /**
   * Calculates the sum of outstanding amounts in the specified currency.
   *
   * @param currency - The currency to calculate the sum for.
   *                   Possible values are 'IDR', 'USD', or 'both'.
   * @returns The sum of outstanding amounts.
   */
  sumTotalOS(currency: Currency): number {
    let result = 0;
    let dollar = 0;
    let filterIdr: any[] = [];
    let filterUsd: any[] = [];

    const dataFilter = this.cpDynamicAttributeData.products.filter((obj: IApplicationProduct) => obj.subLimit === false);

    if (dataFilter.length > 0) {
      if (currency === 'USD' || currency === 'both') {
        filterUsd = dataFilter.filter((obj: IApplicationProduct) => obj.currencyId === 'USD');
      }

      if (currency === 'IDR' || currency === 'both') {
        filterIdr = dataFilter.filter((obj: IApplicationProduct) => obj.currencyId === 'IDR');
      }

      if (currency === 'IDR' || currency === 'both') {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].outstanding !== null) {
            result += Number(filterIdr[i].outstanding);
          }
        }
      }

      if (currency === 'USD') {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].outstanding !== null) {
            dollar += Number(filterUsd[i].outstanding);
          }
        }
      }

      if (currency === 'both') {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].outstanding !== null) {
            dollar += Number(filterUsd[i].outstanding) * Number(filterUsd[i].kurs);
          }
        }
      }
    }
    return result + dollar;
  }

  /**
   * Calculates the sum of total credits for a given currency.
   *
   * @param currency - The currency to filter by ('USD', 'IDR', or 'both').
   * @returns The sum of total credits for the specified currency.
   */
  sumTotalCredit(currency: Currency): number {
    let result = 0;
    let dollar = 0;
    let filterIdr: Array<any> = [];
    let filterUsd: Array<any> = [];

    const dataFilter = this.cpDynamicAttributeData.products.filter((obj: IApplicationProduct) => obj.subLimit === false);

    if (dataFilter.length > 0) {
      if (currency === 'USD' || currency === 'both') {
        filterUsd = dataFilter.filter((obj: IApplicationProduct) => obj.currencyId === 'USD');
      }

      if (currency === 'IDR' || currency === 'both') {
        filterIdr = dataFilter.filter((obj: IApplicationProduct) => obj.currencyId === 'IDR');
      }

      if (currency === 'IDR' || currency === 'both') {
        result = filterIdr.reduce(
          (acc: number, obj: IApplicationProduct) => (obj.totalPlafond !== undefined ? acc + Number(obj.totalPlafond) : acc),
          result
        );
      }

      if (currency === 'USD') {
        dollar = filterUsd.reduce(
          (acc: number, obj: IApplicationProduct) => (obj.totalPlafond !== undefined ? acc + Number(obj.totalPlafond) : acc),
          dollar
        );
      }

      if (currency === 'both') {
        dollar = filterUsd.reduce(
          (acc: number, obj: IApplicationProduct) =>
            obj.totalPlafond !== undefined ? acc + Number(obj.totalPlafond) * Number(obj.kurs) : acc,
          dollar
        );
      }
    }
    return result + dollar;
  }
}
