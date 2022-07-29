import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';

export interface ICollateralProperty {
  id?: number;
  propertyType?: CollateralPropertyType;
  description?: string;
  partyId?: string;
  collateralId?: number;
  appraisalId?: number;
  attributes?: any;
}

export class CollateralProperty implements ICollateralProperty {
  constructor(
    public id?: number,
    public propertyType?: CollateralPropertyType,
    public description?: string,
    public partyId?: string,
    public collateralId?: number,
    public appraisalId?: number,
    public attributes?: any
  ) {}
}
