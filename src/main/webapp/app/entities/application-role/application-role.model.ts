export interface IApplicationRole {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  roleId?: string;
  roleDescription?: string;
  fromPartyId?: string;
  fromPartyName?: string;
  relationTypeId?: string;
  relationTypeDescription?: string;
  partyId?: string;
  partyName?: string;
  applicationId?: Number;
  attributes?: any;
  idPosition?: number;
}

export class ApplicationRole implements IApplicationRole {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public roleId?: string,
    public roleDescription?: string,
    public partyId?: string,
    public partyName?: string,
    public applicationId?: Number,
    public fromPartyId?: string,
    public fromPartyName?: string,
    public relationTypeId?: string,
    public relationTypeDescription?: string,
    idPosition?: number,
    public attributes?: any
  ) {}
}
