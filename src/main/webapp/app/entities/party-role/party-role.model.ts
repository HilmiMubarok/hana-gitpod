export interface IPartyRole {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  roleId?: string;
  partyId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  attributes?: any;
}

export class PartyRole implements IPartyRole {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public roleId?: string,
    public partyId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public attributes?: any
  ) {}
}
