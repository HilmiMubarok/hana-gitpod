import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import _ from 'lodash';

@Component({
  selector: 'jhi-credit-proposal-memo-banding',
  templateUrl: './credit-proposal-memo-banding.component.html',
})
export class MemoBandingComponent implements OnInit {
  ngOnInit(): void {
    this.compareData();
  }
  @Input() creditProposal: ICreditProposal;

  public loanFacilityData: unknown;
  public collateralData: unknown;
  public convenantData: unknown;

  /**
   * steps for compare data
   * 1. get data from creditProposal.products / creditProposal.collaterals / creditProposal.attributes['covenants'] => the current data (data1)
   * 2. get data from creditProposal.attributes['previousOfferingLetter'] => next data (data2)
   * 3. compare data1 and data2 using lodash
   * 4. if result is false, then add key 'isChanged' to changed data, add key 'isRemoved' to removed data, and add key 'noChanged' to no changed data
   * 5. assign data to loanFacilityData, collateralData, and convenantData. use this data to show in html
   */

  compareArrays(d1, d2) {
    const comparedData = d1.map(data => {
      const matchingData = d2.find(d => d.id === data.id);
      if (matchingData) {
        return {
          ...data,
          status: _.isEqual(data, matchingData) ? 'noChanged' : 'Changed',
        };
      } else {
        return {
          ...data,
          status: 'Removed',
        };
      }
    });

    // Add data from d2 that doesn't exist in d1
    d2.forEach(data => {
      const matchingData = d1.find(d => d.id === data.id);
      if (!matchingData) {
        comparedData.push({ ...data, status: 'Added' });
      }
    });

    return comparedData;
  }

  public d1 = [
    {
      id: 1,
      name: 'john',
      age: 24,
    },
    {
      id: 2,
      name: 'Doe',
      age: 24,
    },
    {
      id: 3,
      name: 'John Doe',
      age: 24,
    },
  ];

  public d2 = [
    {
      id: 1,
      name: 'john',
      age: 24,
    },
    {
      id: 2,
      name: 'Doe',
      age: 25,
    },
    {
      id: 4,
      name: 'Jane Doe',
      age: 24,
    },
  ];

  compareData(): void {
    const test = this.compareArrays(this.d1, this.d2);
    console.log('TEST', test);
  }

  fungsiSumcredit() {
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
    return result + dolar;
  }
}
