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

  public roundHundred(value: number): number {
    const limit: Number = 500000;
    if (value < limit) {
      // under 500k
      return 0;
    } else {
      if (value > limit && value < Number(limit) * 2) {
        // between 500k and 1000k
        return Number(limit) * 2;
      } else {
        // above 1000k
        const stringValue: string = value.toString();
        const stringFiveHundred: string = stringValue.substring(stringValue.length - 6, stringValue.length);
        const numberFiveHundred: number = parseInt(stringFiveHundred, 10);
        if (numberFiveHundred < limit) {
          // under 500k
          return value - numberFiveHundred;
        } else {
          // above 500k
          return value + (Number(limit) * 2 - numberFiveHundred);
        }
      }
    }
  }

  public fnCountTotalLiquidBuilding(param: ICollateralProperty[] = null): number {
    if (param.length > 0 && param) {
      let result: number;
      result = 0;
      for (let i = 0; i < param.length; i++) {
        if (param[i].propertyMarketValuePerMeter && this.countTotalArea(param[i]) && param[i].propertyPercentage / 100) {
          result = result + param[i].propertyMarketValuePerMeter * this.countTotalArea(param[i]) * (param[i].propertyPercentage / 100);
        }
      }
      return result;
    }
    return 0;
  }

  public fnCountTotalLiquidLand(param: ICollateralProperty[] = null): number {
    if (param.length > 0 && param) {
      let result: number;
      result = 0;
      for (let i = 0; i < param.length; i++) {
        if (param[i].propertyMarketValuePerMeter && param[i].landSizePerCertificate && param[i].propertyPercentage) {
          result = result + param[i].propertyMarketValuePerMeter * param[i].landSizePerCertificate * (param[i].propertyPercentage / 100);
        }
      }
      return result;
    }
    return 0;
  }

  public fnCountTotalLiquidMachine(param: ICollateralProperty[] = null) {
    if (param && param.length > 0) {
      let result: number;
      result = 0;
      for (let i = 0; i < param.length; i++) {
        if (param[i].machineMarketValue && param[i].machinePercentage) {
          result = result + param[i].machineMarketValue * (param[i].machinePercentage / 100);
        }
      }
      return result;
    }
    return 0;
  }

  public fnCountTotalLiquidVehicle(param: ICollateralProperty[]): number {
    if (param && param.length > 0) {
      let result: number;
      result = 0;
      for (let i = 0; i < param.length; i++) {
        if (param[i].vehicleMarketValue && param[i].vehiclePercentage) {
          result = result + param[i].vehicleMarketValue * (param[i].vehiclePercentage / 100);
        }
      }
      return result;
    }
    return 0;
  }

  public countVehicleLiquidationMarketValueRounding(colPropVehicle: ICollateralProperty[]): number {
    return this.roundHundred(this.fnCountTotalLiquidVehicle(colPropVehicle));
  }

  public countMachineLiquidationMarketValueRounding(colPropMachine: ICollateralProperty[]): number {
    return this.roundHundred(this.fnCountTotalLiquidMachine(colPropMachine));
  }

  public countRealEstateLiquidationMarketValueRounding(
    colPropLand: ICollateralProperty[] = null,
    colPropBuilding: ICollateralProperty[]
  ): number {
    return this.roundHundred(this.fnCountTotalLiquidLand(colPropLand) + this.fnCountTotalLiquidBuilding(colPropBuilding));
  }

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
