export interface ICreditRating {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  partyName?: string;
  partyId?: string;
  applicationId?: number;
  credit_rating?: string;
  internal_max_lll?: string;
  equity_position?: number;
  lll_idr_mio?: number;
  pefindo?: string;
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
    public redit_rating?: string,
    public internal_max_lll?: string,
    public equity_position?: number,
    public lll_idr_mio?: number,
    public pefindo?: string,
    public snp?: string,
    public fitch?: string,
    public moodys?: string
  ) {}
}
