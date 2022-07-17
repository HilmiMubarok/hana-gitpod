export interface ICollateralAppraisal {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  applicationId?: number;
  collateralId?: number;
  partyId?: number;
  attributes?: any;
}

export class CollateralAppraisal implements ICollateralAppraisal {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public applicationId?: number,
    public collateralId?: number,
    public partyId?: number,
    public attributes?: any
  ) {}
}
