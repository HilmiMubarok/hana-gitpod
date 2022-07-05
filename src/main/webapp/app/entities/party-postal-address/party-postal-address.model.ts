import dayjs from 'dayjs/esm';

export interface IPartyPostalAddress {
  id?: number;
  fromDate?: dayjs.Dayjs | null;
  thruDate?: dayjs.Dayjs | null;
  partyId?: string | null;
  partyName?: string | null;
  addressId?: number | null;
  addressDescription?: string | null;
  purposeTypeId?: string | null;
  purposeTypeDescription?: string | null;
}

export class PartyPostalAddress implements IPartyPostalAddress {
  constructor(
    public id?: number,
    public fromDate?: dayjs.Dayjs | null,
    public thruDate?: dayjs.Dayjs | null,
    public partyId?: string | null,
    public partyName?: string | null,
    public addressId?: number | null,
    public addressDescription?: string | null,
    public purposeTypeId?: string | null,
    public purposeTypeDescription?: string | null
  ) {}
}

export function getPartyPostalAddressIdentifier(partyPostalAddress: IPartyPostalAddress): number | undefined {
  return partyPostalAddress.id;
}
