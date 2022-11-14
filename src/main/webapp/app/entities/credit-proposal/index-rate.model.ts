export interface IindexRate {
  id?: number;
  effectiveDate?: Date;
  rateCurrency?: string;
  rateType?: string;
  rate1M?: number;
  rate2M?: number;
  rate3M?: number;
  rate4M?: number;
  rate5M?: number;
  rate6M?: number;
  rate7M?: number;
  rate8M?: number;
  rate9M?: number;
  rate10M?: number;
  rate11M?: number;
  rate12M?: number;
}

export class IndexRate implements IindexRate {
  constructor(
    public id?: number,
    public effectiveDate?: Date,
    public rateCurrency?: string,
    public rateType?: string,
    public rate1M?: number,
    public rate2M?: number,
    public rate3M?: number,
    public rate4M?: number,
    public rate5M?: number,
    public rate6M?: number,
    public rate7M?: number,
    public rate8M?: number,
    public rate9M?: number,
    public rate10M?: number,
    public rate11M?: number,
    public rate12M?: number
  ) {}
}
