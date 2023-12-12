import { Pipe, PipeTransform } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Pipe({
  name: 'getMarketability',
})
export class GetMarketabilityPipe implements PipeTransform {
  transform(collateral: ICollateral, collateralProperties: ICollateralProperty[]) {
    let data: ICollateralProperty;
    if (collateral) {
      data = collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data !== undefined) {
        if (data.marketability === undefined || data.marketability === null) {
          return 'N/A';
        } else {
          return data.marketability;
        }
      }
    }
    return 'N/A';
  }
}
