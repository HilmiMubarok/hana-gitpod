export interface IPartyClassification {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  categoryDescription?: string;
  categoryId?: string;
  partyId?: string;
}

export class PartyClassification implements IPartyClassification {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public categoryDescription?: string,
    public categoryId?: string,
    public partyId?: string
  ) {}
}
