export interface IPartyPostalAddress {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  partyName?: string;
  partyId?: string;
  addressDescription?: string;
  addressId?: number;
  purposeTypeDescription?: string;
  purposeTypeId?: string;
}

export class PartyPostalAddress implements IPartyPostalAddress {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public partyName?: string,
    public partyId?: string,
    public addressDescription?: string,
    public addressId?: number,
    public purposeTypeDescription?: string,
    public purposeTypeId?: string
  ) {}
}
