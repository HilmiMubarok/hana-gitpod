import { Injectable } from '@angular/core';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class CpMemoBandingService extends AbstractEntityService<any> {
  compareDeepData(firstData: Array<any>, secondData: Array<any>): Array<any> {
    const comparedData = firstData.map(data => {
      const matchingData = secondData.find(d => d.id === data.id);
      if (matchingData) {
        return {
          ...data,
          status: _.isEqual(data, matchingData) ? 'Not changed' : 'Changed',
        };
      } else {
        return {
          ...data,
          status: 'Removed',
        };
      }
    });

    secondData.forEach(data => {
      const matchingData = firstData.find(d => d.id === data.id);
      if (!matchingData) {
        comparedData.push({ ...data, status: 'Added' });
      }
    });

    console.log('comparedData', comparedData);

    return comparedData;
  }

  compareSingleObject(firsObject: Object, secondObject: Object): Object {
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
    console.log('creditProposal', creditProposal);

    // Check if creditProposal has attributes['previousOfferingLetter']
    if (creditProposal.attributes['previousOfferingLetter']) {
      const previousOfferingLetter = JSON.parse(creditProposal.attributes['previousOfferingLetter']);
      parsed['previousOfferingLetter'] = previousOfferingLetter;
    }
    console.log('creditProposal after', parsed);
  }
}
