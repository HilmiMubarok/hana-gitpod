import { IPostalAddress, PostalAddress } from '../postal-address/postal-address.model';

export interface IPartyPostalAddress {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  partyId?: string;
  purposeTypeId?: string;
  purposeTypeDescription?: string;
  address?: IPostalAddress;
}

export class PartyPostalAddress implements IPartyPostalAddress {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public partyId?: string,
    public purposeTypeId?: string,
    public purposeTypeDescription?: string,
    public address?: PostalAddress
  ) {
    this.address = new PostalAddress();
  }
}
