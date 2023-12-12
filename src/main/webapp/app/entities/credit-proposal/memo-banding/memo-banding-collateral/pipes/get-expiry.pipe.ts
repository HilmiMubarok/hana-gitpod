import { Pipe, PipeTransform } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';

@Pipe({
  name: 'getExpiry',
})
export class GetExpiryPipe implements PipeTransform {
  transform(collateral: ICollateral, collateralProperties: ICollateralProperty[]) {
    let result: any;
    let data: ICollateralProperty;

    if (
      collateral.collateralTypeId === COLLATERAL_TYPE['realestate'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['machine'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['vehicle'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['property'] ||
      collateral.collateralTypeId === COLLATERAL_TYPE['other']
    ) {
      data = collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.expiry === undefined) {
          result = '';
        } else {
          result = data.attributes.expiry;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['guaranteeLetter']) {
      data = collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.certificateExpiryDate === undefined) {
          result = '';
        } else {
          result = data.attributes.certificateExpiryDate;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['securities'] || collateral.collateralTypeId === COLLATERAL_TYPE['deposit']) {
      data = collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.attributes.maturityDate === undefined) {
          result = '';
        } else {
          result = data.attributes.maturityDate;
        }
      }
    }
    if (collateral.collateralTypeId === COLLATERAL_TYPE['personalCorporateGuarantee']) {
      data = collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.certificateExpiryDate === undefined) {
          result = '';
        } else {
          result = data.certificateExpiryDate;
        }
      }
    }
    return result;
  }
}
