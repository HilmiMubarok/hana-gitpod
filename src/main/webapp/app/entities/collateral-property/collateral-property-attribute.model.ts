import * as uuid from 'uuid';

export interface ICollateralPropertyDepositAttribute {
  id?: string;
  collateralDetailType?: string;
  currency?: string;
  certNumber?: string;
  certName?: string;
  certCreatedDate?: Date;
  amount?: number;
  bank?: string;
  managementBranch?: string;
  address?: string;
  marketValue?: number;
  installmentAmount?: number;
  installmentTime?: number;
}

export class CollateralPropertyDepositAttribute implements ICollateralPropertyDepositAttribute {
  constructor(
    public id?: string,
    public collateralDetailType?: string,
    public currency?: string,
    public certNumber?: string,
    public certName?: string,
    public amount?: number,
    public bank?: string,
    public managementBranch?: string,
    public address?: string,
    public marketValue?: number,
    public certCreatedDate?: Date,
    public installmentAmount?: number,
    public installmentTime?: number
  ) {
    this.id = uuid.v4();
    this.certCreatedDate = new Date();
  }
}
