export interface IPartyIdentification {
  id?: number;
  value?: string;
  identificationTypeDescription?: string;
  identificationTypeId?: string;
  partyId?: string;
}

export class PartyIdentification implements IPartyIdentification {
  constructor(
    public id?: number,
    public value?: string,
    public identificationTypeDescription?: string,
    public identificationTypeId?: string,
    public partyId?: string
  ) {}
}
