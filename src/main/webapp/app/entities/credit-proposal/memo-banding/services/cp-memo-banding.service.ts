import { Injectable } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
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

  // Loan Facility
  compareObjectsLoanFacility(obj1, obj2, customizer) {
    const keys = Object.keys(customizer);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (key === 'collateralAddress') {
        if (obj1[key]['address1'] !== obj2[key]['address1']) {
          return false;
        }
      } else {
        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }
    }

    return true;
  }

  compareLoanFacility(firstData, secondData) {
    const customizer = {
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
      provisionFeeAmount: true,
      tenor: true,
      periodType: true,
      pricingRate: true,
    };

    const comparedData = [];

    secondData.forEach(data => {
      const matchingData = firstData.find(d => d.id === data.id);
      const appealStatus = matchingData
        ? this.compareObjectsLoanFacility(data, matchingData, customizer)
          ? 'Not Changed'
          : 'Changed'
        : 'Added';
      comparedData.push({ ...data, appealStatus });
    });

    const removedData = firstData.filter(data => !secondData.some(d => d.id === data.id));
    removedData.forEach(data => comparedData.push({ ...data, appealStatus: 'Removed' }));

    this.comparedData$.next(_.sortBy(comparedData, ['id']));

    return comparedData;
  }

  comparedData$ = new BehaviorSubject<any[]>([]);
  comparedData = this.comparedData$.asObservable();

  // Collateral Info
  compareCollateralInfo(firstData, secondData) {
    const customizer = {
      collateralTypeDescription: true,
      collateralAddress: true,
      nomorSertifikat: true,
      mvInternal: true,
      mvExternal: true,
      lvInternal: true,
      lvExternal: true,
    };

    const comparedData = [];

    secondData.forEach(data => {
      const matchingData = firstData.find(d => d.id === data.id);
      const appealStatus = matchingData
        ? this.compareObjectsLoanFacility(data, matchingData, customizer)
          ? 'Not Changed'
          : 'Changed'
        : 'Added';
      comparedData.push({ ...data, appealStatus });
    });

    const removedData = firstData.filter(data => !secondData.some(d => d.id === data.id));
    removedData.forEach(data => comparedData.push({ ...data, appealStatus: 'Removed' }));

    this.comparedCollateralInfoData$.next(_.sortBy(comparedData, ['id']));

    return comparedData;
  }

  comparedCollateralInfoData$ = new BehaviorSubject<any[]>([]);
  comparedCollateralInfoData = this.comparedCollateralInfoData$.asObservable();

  compareDeepDataNew(firstData, secondData, where) {
    // console.log('Data', { firstData, secondData });

    let customizer = {};
    if (where === 'loan-facility') {
      customizer = {
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
        provisionFeeAmount: true,
        tenor: true,
        periodType: true,
        pricingRate: true,
      };
    } else {
      customizer = {
        jenisCollateral: true,
        alamat: true,
        nomorSertifikat: true,
        mvInternal: true,
        mvExternal: true,
        lvInternal: true,
        lvExternal: true,
      };
    }

    const comparedData = secondData.map(data => {
      const matchingData = firstData.find(d => d.id === data.id);
      const appealStatus = matchingData ? (this.compareObjects(data, matchingData, customizer) ? 'Not changed' : 'Changed') : 'Added';
      return { ...data, appealStatus };
    });

    const addedData = secondData.filter(data => !firstData.some(d => d.id === data.id));

    const final = [...comparedData, ...addedData.map(data => ({ ...data, appealStatus: 'Removed' }))];

    return _.uniqBy(final, 'id');

    // console.log('RES FINAL', {
    //   ori: final,
    //   flattened: _.flatten(final),
    //   uniqById: _.uniqBy(final, 'id'),
    //   flattenDeep: _.flattenDeep(final),
    //   uniqByFlattenDeep: _.uniqBy(_.flattenDeep(final), 'id'),
    // });

    return where === 'loan-facility' ? _.uniqBy(final, 'id') : final;
    // const comparedData = firstData.map(data => {
    //   const matchingData = secondData.find(d => d.id === data.id);
    //   const appealStatus = matchingData ? (this.compareObjects(data, matchingData, customizer) ? 'Not changed' : 'Changed') : 'Removed';
    //   return { ...data, appealStatus };
    // });

    // secondData.forEach(data => {
    //   if (!firstData.some(d => d.id === data.id)) {
    //     comparedData.push({ ...data, appealStatus: 'Added' });
    //   }
    // });

    // console.log('comparedData', comparedData);

    // return comparedData;
  }

  compareOtherCovenant(firstData, secondData) {
    firstData.sort((a, b) => a.id - b.id);
    secondData.sort((a, b) => a.id - b.id);

    const comparedData = secondData.map(data => {
      const matchingData = firstData.find(d => d.id === data.id);
      const appealStatus = matchingData ? (_.isEqualWith(data, matchingData) ? 'Not changed' : 'Changed') : 'Added';
      return { ...data, appealStatus };
    });

    firstData.forEach(data => {
      if (!secondData.some(d => d.id === data.id)) {
        comparedData.push({ ...data, appealStatus: 'Removed' });
      }
    });

    return comparedData;
  }

  compareDeepData(beforeData, afterData) {
    beforeData.sort((a, b) => a.id - b.id);
    afterData.sort((a, b) => a.id - b.id);

    const comparedData = afterData.map(data => {
      const matchingData = beforeData.find(d => d.id === data.id);
      const appealStatus = matchingData ? (_.isEqualWith(data, matchingData) ? 'Not changed' : 'Changed') : 'Added';
      return { ...data, appealStatus };
    });

    beforeData.forEach(data => {
      if (!afterData.some(d => d.id === data.id)) {
        comparedData.push({ ...data, appealStatus: 'Removed' });
      }
    });

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
      if (typeof creditProposal.attributes['previousOfferingLetter'] === 'string') {
        const parsedPrevOL = JSON.parse(creditProposal.attributes['previousOfferingLetter']);
        // Loop over each key in previousOfferingLetter, and parse it
        Object.keys(parsedPrevOL).forEach(key => {
          if (typeof parsedPrevOL[key] === 'string') {
            parsed[key] = JSON.parse(parsedPrevOL[key]);
          } else {
            parsed[key] = parsedPrevOL[key];
          }
        });
      } else {
        Object.keys(creditProposal.attributes['previousOfferingLetter']).forEach(key => {
          if (typeof creditProposal.attributes['previousOfferingLetter'][key] === 'string') {
            parsed[key] = JSON.parse(creditProposal.attributes['previousOfferingLetter'][key]);
          } else {
            parsed[key] = creditProposal.attributes['previousOfferingLetter'][key];
          }
        });
      }
    }

    return parsed;
  }

  mapDataCollateral(collaterals: ICollateral[], collateralProperties: ICollateralProperty[]) {
    const mappedData = [];

    for (const coll of collaterals) {
      const collId = coll.id;
      const externalProperty = collateralProperties.find(entry => entry.collateralId === collId && entry.external);
      const internalProperty = collateralProperties.find(entry => entry.collateralId === collId && !entry.external);
      if (externalProperty && internalProperty) {
        mappedData.push({
          coll,
          externalProperty,
          internalProperty,
        });
      }
    }

    /**
     * Mapped data structure
     * {
     * coll: ICollateral,
     * externalProperty: ICollateralProperty -> external = true,
     * internalProperty: ICollateralProperty -> external = false,
     * }
     */
    const dataToCompare = mappedData.map(data => {
      const { coll, externalProperty, internalProperty } = data;

      // const a = {
      //   jenisCollateral: coll.collateralTypeDescription,
      //   alamat: coll.collateralAddress.address1,
      //   nomorSertifikat: internalProperty.attributes['certificateNumber'],
      //   mvInternal: internalProperty.marketValue === null ? 0 : internalProperty.marketValue,
      //   mvExternal: externalProperty.marketValue === null ? 0 : externalProperty.marketValue,
      //   lvInternal: internalProperty.liquidationValue === null ? 0 : internalProperty.liquidationValue,
      //   lvExternal: externalProperty.liquidationValue === null ? 0 : externalProperty.liquidationValue,
      // };

      // insert coll
      return {
        ...coll,
        ...{
          jenisCollateral: coll.collateralTypeDescription,
          alamat: coll.collateralAddress.address1,
          nomorSertifikat: internalProperty.attributes['certificateNumber'],
          mvInternal: internalProperty.marketValue === null ? 0 : internalProperty.marketValue,
          mvExternal: externalProperty.marketValue === null ? 0 : externalProperty.marketValue,
          lvInternal: internalProperty.liquidationValue === null ? 0 : internalProperty.liquidationValue,
          lvExternal: externalProperty.liquidationValue === null ? 0 : externalProperty.liquidationValue,
        },
      };
    });
    return dataToCompare;
  }
}

export interface ILoading {
  type: string;
  value: boolean;
  message: string;
  percentage: number;
}
