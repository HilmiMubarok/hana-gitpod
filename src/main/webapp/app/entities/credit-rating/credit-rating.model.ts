export interface ICreditRating {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  partyName?: string;
  partyId?: string;
  applicationId?: number;
}

export class CreditRating implements ICreditRating {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public partyName?: string,
    public partyId?: string,
    public applicationId?: number
  ) {}
}
