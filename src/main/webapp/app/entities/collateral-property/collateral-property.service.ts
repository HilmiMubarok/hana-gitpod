import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICollateralProperty } from './collateral-property.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import lodash from 'lodash';

@Injectable({ providedIn: 'root' })
export class CollateralPropertyService extends AbstractEntityService<ICollateralProperty> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/collateral-properties');
  }

  protected isNew(entity: ICollateralProperty): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected preSave(entity: ICollateralProperty) {}

  public countTotalArea(element: ICollateralProperty): number {
    let total: number;
    total = 0;

    if (element.propertyType === CollateralPropertyType.BUILDING) {
      if (lodash.has(element.attributes, 'floors')) {
        const floors: object[] = JSON.parse(element.attributes['floors']);
        if (floors.length > 0) {
          for (let i = 0; i < floors.length; i++) {
            const floor: object = floors[i];
            total = total + parseInt(floor['area'], 10);
          }
        }
      }
    }

    if (element.propertyType === CollateralPropertyType.LAND) {
      return element.landSizePerCertificate;
    }

    return total;
  }
}
