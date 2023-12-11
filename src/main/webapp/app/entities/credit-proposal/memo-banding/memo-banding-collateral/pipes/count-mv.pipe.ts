import { Pipe, PipeTransform } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Pipe({
  name: 'countMV',
})
export class CountMVPipe implements PipeTransform {
  transform(collateral: ICollateral, collateralProperties: ICollateralProperty[]): number {
    let data: ICollateralProperty;
    // console.log("collateral in above grid",collateral);
    if (collateral.collateralTypeId) {
      data = collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.marketValue === null) {
          return 0;
        } else {
          return data.marketValue;
        }
      }
    }
    return 0;
  }
}
