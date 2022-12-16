import { IPostalAddressWharehouse, PostalAddressWarehouse } from '../postal-address/postal-address-warehouse.model';

export interface IPartyPostalAddressWarehouse {
  fromDate?: Date;
  thruDate?: Date;
  partyId?: string;
  purposeTypeId?: string;
  purposeTypeDescription?: string;
  address?: IPostalAddressWharehouse;
}

export class PartyPostalAddressWarehouse implements IPartyPostalAddressWarehouse {
  constructor(
    public fromDate?: Date,
    public thruDate?: Date,
    public partyId?: string,
    public purposeTypeId?: string,
    public purposeTypeDescription?: string,
    public address?: PostalAddressWarehouse
  ) {
    this.fromDate = new Date();
    this.thruDate = new Date();
    this.partyId = '';
    this.address = new PostalAddressWarehouse();
    this.purposeTypeId = '';
  }
}
