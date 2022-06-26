import { IPartyRole } from 'app/entities/party-role/party-role.model';

export interface IParty {
  id?: string;
  name?: string;
  partyTypeDescription?: string;
  partyTypeId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  attributes?: any;
}

export class Party implements IParty {
  constructor(
    public id?: string,
    public name?: string,
    public partyTypeDescription?: string,
    public partyTypeId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public attributes?: any
  ) {}
}
