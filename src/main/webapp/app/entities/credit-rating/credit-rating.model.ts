export interface ICreditRating {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  partyName?: string;
  partyId?: string;
  applicationId?: number;
  creditRating?: string;
  internalMaxLLL?: number;
  equityPosition?: string;
  idrMioLLL?: number;
  pefindo?: number;
  snp?: string;
  fitch?: string;
  moodys?: string;
}

export class CreditRating implements ICreditRating {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public partyName?: string,
    public partyId?: string,
    public applicationId?: number,
    public creditRating?: string,
    public internalMaxLLL?: number,
    public equityPosition?: string,
    public idrMioLLL?: number,
    public pefindo?: number,
    public snp?: string,
    public fitch?: string,
    public moodys?: string
  ) {}
}
