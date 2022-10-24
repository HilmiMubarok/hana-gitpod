import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { IPartyRole } from '../party-role/party-role.model';
import { IPerson, Person } from '../person/person.model';

export interface IPartner extends IPartyRole {
  partnerId?: string;
  customer?: boolean;
  vendor?: boolean;
  paymentProvider?: boolean;
  organization?: IPartyGroup;
  contact?: IPerson;
}

export class Partner implements IPartner {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public roleId?: string,
    public partyId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public attributes?: any,
    public partnerId?: string,
    public customer?: boolean,
    public vendor?: boolean,
    public paymentProvider?: boolean,
    public organization?: IPartyGroup,
    public contact?: IPerson
  ) {
    this.organization = new PartyGroup();
    this.contact = new Person();
    this.customer = this.customer || false;
    this.vendor = this.vendor || false;
    this.paymentProvider = this.paymentProvider || false;
  }
}
