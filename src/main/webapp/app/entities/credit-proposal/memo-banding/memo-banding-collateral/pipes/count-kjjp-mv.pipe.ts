import { Pipe, PipeTransform } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Pipe({ name: 'countKjjpMv' })
export class CountKjjpMvPipe implements PipeTransform {
  transform(collateral: ICollateral, collateralProperties: ICollateralProperty[]) {
    let result: number;
    result = 0;
    let data: ICollateralProperty;
    if (collateral.collateralTypeId) {
      data = collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === true
      );
      if (data !== undefined) {
        if (data.marketValue === null) {
          result = 0;
        } else {
          result = data.marketValue;
        }
      }
    }
    return result;
  }
}
