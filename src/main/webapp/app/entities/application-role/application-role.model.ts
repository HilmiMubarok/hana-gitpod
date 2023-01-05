export interface IApplicationRole {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  roleId?: string;
  roleDescription?: string;
  partyFromId?: string;
  partyFromName?: string;
  relationTypeId?: string;
  relationTypeDescription?: string;
  partyId?: string;
  partyName?: string;
  applicationId?: Number;
  attributes?: any;
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
    public partyFromId?: string,
    public partyFromName?: string,
    public relationTypeId?: string,
    public relationTypeDescription?: string,
    public attributes?: any
  ) {}
}
