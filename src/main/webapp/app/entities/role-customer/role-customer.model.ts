import { IPartyRole } from "../party-role/party-role.model";

export interface IRoleCustomer extends IPartyRole {
  customerNumber?: string;
}

export class RoleCustomer implements IRoleCustomer {
  constructor(
    public id?: number,
    public customerNumber?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public roleDescription?: string,
    public roleId?: string,
    public partyName?: string,
    public partyId?: string
  ) {}
}
