import * as uuid from 'uuid';
export interface IApplicationProductTakeOver {
  // TakeOverBank
  id?: number;
  facilityTypeBank?: string;
  maturityBank?: number;
  initialLimitBank?: number;
  outstandingBank?: number;
  currency?: string;
  maturityPeriodType?: string;
  currency2?: string;
  changes?: number;
}

export class ApplicationProductTakeOver implements IApplicationProductTakeOver {
  constructor(
    // TakeOverBank
    public id?: number,
    public facilityTypeBank?: string,
    public changes?: number,
    public maturityBank?: number,
    public initialLimitBank?: number,
    public outstandingBank?: number,
    public currency?: string,
    public maturityPeriodType?: string,
    public currency2?: string
  ) {
    this.id = uuid.v4();
    this.facilityTypeBank = '';
    this.maturityPeriodType = '';
    this.changes = 0;
    this.maturityBank = 0;
    this.initialLimitBank = 0;
    this.outstandingBank = 0;
    this.currency = '';
    this.currency2 = '';
  }
}
