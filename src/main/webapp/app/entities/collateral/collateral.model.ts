export interface ICollateral {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  collateralTypeDescription?: string;
  collateralTypeId?: string;
  partyName?: string;
  partyId?: string;
  applicationId?: number;
  attributes?: any;
}

export class Collateral implements ICollateral {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public collateralTypeDescription?: string,
    public collateralTypeId?: string,
    public partyName?: string,
    public partyId?: string,
    public applicationId?: number,
    public attributes?: any
  ) {}
}
