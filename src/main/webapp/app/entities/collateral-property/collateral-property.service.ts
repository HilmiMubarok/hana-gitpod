import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICollateralProperty } from './collateral-property.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import lodash from 'lodash';
import { ICollateral, ICollateralLandAttribute } from '../collateral/collateral.model';
import { CollateralAppraisalValuationPropertyComponent } from '../collateral-appraisal/valuation/details/collateral-appraisal-valuation-property.component';
import { Observable } from 'rxjs';

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

  public certificates: ICollateralLandAttribute[];
  public totalCountAreaLand: number;

  getCertificateAndLiquidation(collateral, properties) {
    // Extract land certificates
    const landCertificates = collateral.attributes['landCertificates'] ? JSON.parse(collateral.attributes['landCertificates']) : [];
    let totalCountAreaLand = 0;

    // Calculate total land area from certificates
    if (landCertificates.length > 0) {
      totalCountAreaLand = landCertificates.reduce((total, cert) => total + Number(cert.certArea), 0);

      totalCountAreaLand -= collateral.truncatedArea + collateral.publicFacilities;
    }

    // Calculate total liquidation value Tata Kota if properties provided
    let totalLiquidationValueTataKota = 0;
    if (properties?.length > 0) {
      properties.forEach(property => {
        if (property.propertyMarketValueTataKotaPerMeter && property.propertyPercentageTataKota) {
          const liquidationValue =
            property.propertyMarketValueTataKotaPerMeter * totalCountAreaLand * (property.propertyPercentageTataKota / 100);
          totalLiquidationValueTataKota += liquidationValue;
        }
      });
    }

    return { totalCountAreaLand, totalLiquidationValueTataKota };
  }

  getValuationAndProperties(
    collateral: ICollateral,
    appraisalId: number,
    collateralAppraisalValuationPropertyComponent: CollateralAppraisalValuationPropertyComponent
  ): Observable<any> {
    return new Observable(observer => {
      this.queryFilterBy({
        idCollateral: collateral.id,
        size: 9999,
      }).subscribe(
        res => {
          const collateralProperties = res.body.filter(
            o =>
              o.propertyType === CollateralPropertyType.MACHINE ||
              o.propertyType === CollateralPropertyType.VEHICLE ||
              o.propertyType === CollateralPropertyType.BUILDING ||
              o.propertyType === CollateralPropertyType.LAND
          );

          console.log('Filtered collateral properties:', collateralProperties);

          const { totalCountAreaLand, totalLiquidationValueTataKota } = this.getCertificateAndLiquidation(collateral, collateralProperties);
          const result = collateralProperties.map(collateralProperty => {
            let landSizePerCertificate = 0;
            let area = 0;
            let imbArea = 0;
            let propertyTatakota = 0;
            let marketValue = 0;
            let marketValueIMB = 0;
            let marketValueTataKota = 0;
            let liquidationValue = 0;
            let liquidationValueIMB = 0;
            let liquidationValueTataKota = 0;

            if (collateralProperty.propertyType === CollateralPropertyType.BUILDING) {
              landSizePerCertificate = collateralProperty.landSizePerCertificate;
              area = collateralAppraisalValuationPropertyComponent.countTotalArea(collateralProperty);
              imbArea = collateralProperty.imbArea;
              propertyTatakota = collateralProperty.propertyAreaTataKota;
              marketValue = collateralAppraisalValuationPropertyComponent.fnCountTotalMVbuil([collateralProperty]);
              marketValueIMB = collateralAppraisalValuationPropertyComponent.fnCountTotalMVIMBbuil([collateralProperty]);
              marketValueTataKota = collateralAppraisalValuationPropertyComponent.fnCountTotalMVTataKotabuil([collateralProperty]);
              liquidationValue = collateralAppraisalValuationPropertyComponent.fnCountTotalLiquidBuil([collateralProperty]);
              liquidationValueIMB = collateralAppraisalValuationPropertyComponent.fnCountTotalLiquidIMBbuil([collateralProperty]);
              liquidationValueTataKota = collateralAppraisalValuationPropertyComponent.fnCountTotalLiquidTataKotabuil([collateralProperty]);
            } else if (collateralProperty.propertyType === CollateralPropertyType.LAND) {
              landSizePerCertificate = collateralProperty.landSizePerCertificate;
              area = totalCountAreaLand; // Menggunakan totalCountAreaLand yang dihitung
              imbArea = collateralProperty.imbArea;
              propertyTatakota = collateralProperty.propertyAreaTataKota;
              marketValue = collateralAppraisalValuationPropertyComponent.fnCountTotalMV([collateralProperty]);
              marketValueIMB = collateralAppraisalValuationPropertyComponent.fnCountTotalMVIMB([collateralProperty]);
              marketValueTataKota = collateralAppraisalValuationPropertyComponent.fnCountTotalMVTataKota([collateralProperty]);
              liquidationValue = collateralAppraisalValuationPropertyComponent.fnCountTotalLiquid([collateralProperty]);
              liquidationValueIMB = collateralAppraisalValuationPropertyComponent.fnCountTotalLiquidIMB([collateralProperty]);
              liquidationValueTataKota = totalLiquidationValueTataKota; // Menggunakan liquidation value Tata Kota yang dihitung
            } else if (collateralProperty.propertyType === CollateralPropertyType.VEHICLE) {
              marketValue = this.roundHundred(collateralProperty.vehicleMarketValue);
              liquidationValue = this.roundHundred(this.fnCountTotalLiquidVehicle([collateralProperty]));
            } else if (collateralProperty.propertyType === CollateralPropertyType.MACHINE) {
              marketValue = this.roundHundred(collateralProperty.machineMarketValue);
              liquidationValue = this.roundHundred(this.fnCountTotalLiquidMachine([collateralProperty]));
            }

            console.log('Processed collateral property:', {
              propertyType: collateralProperty.propertyType,
              landSizePerCertificate,
              area,
              imbArea,
              propertyTatakota,
              marketValue,
              marketValueIMB,
              marketValueTataKota,
              liquidationValue,
              liquidationValueIMB,
              liquidationValueTataKota,
            });

            return collateralProperty.propertyType === CollateralPropertyType.MACHINE ||
              collateralProperty.propertyType === CollateralPropertyType.VEHICLE
              ? {
                  appraisalId,
                  collateralId: collateralProperty.collateralId,
                  propertyType: collateralProperty.propertyType,
                  marketValue: collateralAppraisalValuationPropertyComponent.roundHundred(marketValue),
                  liquidationValue: collateralAppraisalValuationPropertyComponent.roundHundred(liquidationValue),
                }
              : {
                  appraisalId,
                  collateralId: collateralProperty.collateralId,
                  propertyType: collateralProperty.propertyType,
                  landSizePerCertificate,
                  area,
                  imbArea,
                  propertyTatakota,
                  marketValue: collateralAppraisalValuationPropertyComponent.roundHundred(marketValue),
                  marketValueIMB: collateralAppraisalValuationPropertyComponent.roundHundred(marketValueIMB),
                  marketValueTataKota: collateralAppraisalValuationPropertyComponent.roundHundred(marketValueTataKota),
                  liquidationValue: collateralAppraisalValuationPropertyComponent.roundHundred(liquidationValue),
                  liquidationValueIMB: collateralAppraisalValuationPropertyComponent.roundHundred(liquidationValueIMB),
                  liquidationValueTataKota: collateralAppraisalValuationPropertyComponent.roundHundred(liquidationValueTataKota),
                };
          });

          observer.next(result);
          observer.complete();
        },
        err => {
          observer.error(err);
        }
      );
    });
  }
}
