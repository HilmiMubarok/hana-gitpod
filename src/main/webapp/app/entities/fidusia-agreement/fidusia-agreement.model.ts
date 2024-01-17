import * as uuid from 'uuid';

export interface IFidusiaAgremeent {
  id?: number;
  agreementNumber?: string;
  dateAgreement?: string;
  description?: string;
  name?: string;
  internalId?: string;
  internalName?: string;
  toPartyId?: string;
  notes?: string;
  fromDate?: Date;
  thruDate?: Date;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  agreementTypeId?: string;
  agreementTypeDescription?: string;
  roles?: IRoles[];
  attributes?: any;
  applicationId?: number;
  collateralId?: number;
  rank?: number;
  cover?: string;
  value?: number;
}

export class FidusiaAgreement implements IFidusiaAgremeent {
  constructor(
    public id?: number,
    public agreementNumber?: string,
    public dateAgreement?: string,
    public description?: string,
    public name?: string,
    public internalId?: string,
    public internalName?: string,
    public toPartyId?: string,
    public notes?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public agreementTypeId?: string,
    public agreementTypeDescription?: string,
    public roles?: IRoles[],
    public attributes?: any,
    public applicationId?: number,
    public collateralId?: number,
    public rank?: number,
    public cover?: string,
    public value?: number
  ) {
    this.id = uuid.v4();
  }
}

export interface IRoles {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  roleId?: string;
  roleDescription?: string;
  partyId?: string;
  partyName?: string;
  agreementId?: number;
  relationTypeId?: string;
  relationTypeDescription?: string;
}

export class Roles implements IRoles {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public roleId?: string,
    public roleDescription?: string,
    public partyId?: string,
    public partyName?: string,
    public agreementId?: number,
    public relationTypeId?: string,
    public relationTypeDescription?: string
  ) {
    this.id = uuid.v4();
  }
}
