import * as uuid from 'uuid';
export interface IApplicationProductTakeOver {
  // TakeOverBank
  id?: number;
  facilityTypeBank?: string;
  maturityBank?: number;
  initialLimitBank?: number;
  outstandingBank?: number;
  currency?: string;
}

export class ApplicationProductTakeOver implements IApplicationProductTakeOver {
  constructor(
    // TakeOverBank
    public id?: number,
    public facilityTypeBank?: string,
    public maturityBank?: number,
    public initialLimitBank?: number,
    public outstandingBank?: number,
    public currency?: string
  ) {
    this.id = uuid.v4();
    this.facilityTypeBank = '';
    this.maturityBank = 0;
    this.initialLimitBank = 0;
    this.outstandingBank = 0;
  }
}
