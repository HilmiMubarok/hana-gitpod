import { Pipe, PipeTransform } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Pipe({
  name: 'countLV',
})
export class CountLVPipe implements PipeTransform {
  transform(collateral: ICollateral, collateralProperties: ICollateralProperty[]): number {
    let result: number;
    let data: ICollateralProperty;
    result = 0;

    if (collateral.collateralTypeId) {
      data = collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.liquidationValue === null) {
          result = 0;
        } else {
          result = data.liquidationValue;
        }
      }
    }
    return result;
  }
}
