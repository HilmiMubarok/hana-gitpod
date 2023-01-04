import * as uuid from 'uuid';

export interface IFacilityTypeOverBank {
  id?: string;
  label: string;
}

export interface IApplicationProductTakeOverBank {
  // TakeOverBank
  id?: number;
  facilityTypeOverBank?: IFacilityTypeOverBank;
  maturityBankOver?: number;
  initialLimitBankOver?: number;
  outstandingBankOver?: number;
  maturityPeriodType?: string;
  currency?: string;
}

export class ApplicationProductTakeOverBank implements IApplicationProductTakeOverBank {
  constructor(
    // TakeOverBank
    public id?: number,
    public facilityTypeOverBank?: IFacilityTypeOverBank,
    public maturityBankOver?: number,
    public initialLimitBankOver?: number,
    public outstandingBankOver?: number,
    public maturityPeriodType?: string,
    public currency?: string
  ) {
    this.id = uuid.v4();
    this.facilityTypeOverBank = {
      id: '',
      label: '',
    };
    this.maturityBankOver = 0;
    this.initialLimitBankOver = 0;
    this.outstandingBankOver = 0;
    this.maturityPeriodType = '';
  }
}
