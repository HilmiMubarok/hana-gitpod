import { Injectable } from '@angular/core';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class CpMemoBandingService extends AbstractEntityService<any> {
  compareDeepData(firstData, secondData) {
    // console.log('Data', { firstData, secondData });

    const comparedData = firstData.map(data => {
      const matchingData = secondData.find(d => d.id === data.id);
      const status = matchingData ? (_.isEqual(data, matchingData) ? 'Not changed' : 'Changed') : 'Removed';
      return { ...data, status };
    });

    secondData.forEach(data => {
      if (!firstData.some(d => d.id === data.id)) {
        comparedData.push({ ...data, status: 'Added' });
      }
    });

    // console.log('comparedData', comparedData);

    return comparedData;
  }
  compareSingleObject(firsObject: Object, secondObject: Object): Object {
    return Object.keys(firsObject).map(key => ({
      [key]: firsObject[key],
      status: _.isEqual(firsObject, secondObject) ? 'Not changed' : 'Changed',
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
