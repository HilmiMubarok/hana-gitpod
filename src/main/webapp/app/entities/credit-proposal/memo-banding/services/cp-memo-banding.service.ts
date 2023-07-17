import { Injectable } from '@angular/core';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CpMemoBandingService extends AbstractEntityService<any> {
  loadingData$ = new BehaviorSubject<ILoading[]>([]);
  loadingData = this.loadingData$.asObservable();

  setLoadingData(data: ILoading) {
    // push data to loadingData$
    this.loadingData$.next([...this.loadingData$.getValue(), data]);
  }

  removeLoadingData(type: string) {
    const filteredData = this.loadingData$.getValue().filter(data => data.type !== type);
    this.loadingData$.next(filteredData);
  }

  getLoadingData(): Observable<ILoading[]> {
    return this.loadingData$;
  }

  compareObjects(obj1, obj2, customizer) {
    const keys = Object.keys(customizer);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }
  compareDeepDataNew(firstData, secondData) {
    // console.log('Data', { firstData, secondData });
    const customizer = {
      // id: true,
      categoryId: true,
      applicationType: true,
      productTypeId: true,
      subLimit: true,
      currencyId: true,
      initialLimit: true,
      outstanding: true,
      changes: true,
      totalPlafond: true,
      intResetFrequency: true,
      intResetPeriod: true,
      rateTypeName: true,
      currentInterestRate: true,
      // requiredSpread: true,
      provisionFeeAmount: true,
      tenor: true,
      periodType: true,
      // maturityDate: true,
      // firstDisbursementDate: true,
    };

    const comparedData = firstData.map(data => {
      const matchingData = secondData.find(d => d.id === data.id);
      const appealStatus = matchingData ? (this.compareObjects(data, matchingData, customizer) ? 'Not changed' : 'Changed') : 'Removed';
      return { ...data, appealStatus };
    });

    secondData.forEach(data => {
      if (!firstData.some(d => d.id === data.id)) {
        comparedData.push({ ...data, appealStatus: 'Added' });
      }
    });

    // console.log('comparedData', comparedData);

    return comparedData;
  }
  compareDeepData(firstData, secondData) {
    // console.log('Data', { firstData, secondData });

    const comparedData = firstData.map(data => {
      const matchingData = secondData.find(d => d.id === data.id);
      const appealStatus = matchingData ? (_.isEqualWith(data, matchingData) ? 'Not changed' : 'Changed') : 'Removed';
      return { ...data, appealStatus };
    });

    secondData.forEach(data => {
      if (!firstData.some(d => d.id === data.id)) {
        comparedData.push({ ...data, appealStatus: 'Added' });
      }
    });

    // console.log('comparedData', comparedData);

    return comparedData;
  }
  compareSingleObject(firsObject: Object, secondObject: Object): Object {
    return Object.keys(firsObject).map(key => ({
      [key]: firsObject[key],
      appealStatus: _.isEqual(firsObject, secondObject) ? 'Not changed' : 'Changed',
    }));

    console.log({
      firsObject,
      secondObject,
    });

    // create function like compareDeepData
    const comparedObject = Object.keys(firsObject).map(key => {
      const matchingData = secondObject[key];
      if (matchingData) {
        return {
          [key]: firsObject[key],
          status: _.isEqual(firsObject[key], matchingData) ? 'Not changed' : 'Changed',
        };
      } else {
        return {
          [key]: firsObject[key],
          status: 'Removed',
        };
      }
    });

    console.log('comparedObject', comparedObject);
    return comparedObject;
  }

  parseAttrCp(creditProposal: any) {
    const parsed = {};
    // console.log('creditProposal', creditProposal);

    // Check if creditProposal has attributes['previousOfferingLetter']
    if (creditProposal.attributes['previousOfferingLetter']) {
      const previousOfferingLetter = JSON.parse(creditProposal.attributes['previousOfferingLetter']);
      parsed['previousOfferingLetter'] = previousOfferingLetter;
    }
    console.log('creditProposal after', parsed);
  }

  parsePrevOfferingLetter(creditProposal: any) {
    const parsed = {};

    // Check if creditProposal has attributes['previousOfferingLetter']
    if (creditProposal.attributes['previousOfferingLetter']) {
      const parsedPrevOL = JSON.parse(creditProposal.attributes['previousOfferingLetter']);
      // Loop over each key in previousOfferingLetter, and parse it
      Object.keys(parsedPrevOL).forEach(key => {
        // === parse each key's value if it's a string
        // console.log('kjsakdjhsd', parsed[key]);
        if (typeof parsedPrevOL[key] === 'string') {
          parsed[key] = JSON.parse(parsedPrevOL[key]);
        } else {
          parsed[key] = parsedPrevOL[key];
        }
      });
    }

    return parsed;
  }
}

export interface ILoading {
  type: string;
  value: boolean;
  message: string;
  percentage: number;
}
