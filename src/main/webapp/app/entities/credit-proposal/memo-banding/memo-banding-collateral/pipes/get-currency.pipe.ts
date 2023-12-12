import { Pipe, PipeTransform } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Pipe({
  name: 'getCurrency',
})
export class GetCurrencyPipe implements PipeTransform {
  transform(collateral: ICollateral, collateralProperties: ICollateralProperty[]): string {
    let data: ICollateralProperty;
    if (collateral) {
      data = collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
      if (data) {
        if (data.marketValueOriginalCcy === undefined || data.marketValueOriginalCcy === null) {
          return '';
        }
        return data.marketValueOriginalCcy;
      }
    }
    return 'IDR';
  }
}
