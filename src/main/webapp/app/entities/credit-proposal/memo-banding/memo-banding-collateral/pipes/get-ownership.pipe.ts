import { Pipe, PipeTransform } from '@angular/core';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';

@Pipe({
  name: 'getOwnership',
})
export class GetOwnershipPipe implements PipeTransform {
  transform(collateral: ICollateral, collateralProperties: ICollateralProperty[]): string {
    let data: ICollateralProperty;
    let string2: string;

    if (collateral.collateralTypeId !== COLLATERAL_TYPE['personalCorporateGuarantee']) {
      data = collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
    } else {
      data = collateralProperties.find(
        obj => obj.propertyType === 'GENERAL' && obj.collateralId === collateral.id && obj.external === false
      );
    }

    if (data !== undefined) {
      string2 = data.attributes.certificateNumber || data.certificateNumber || '';
    } else {
      string2 = '';
    }

    return string2;
  }
}
