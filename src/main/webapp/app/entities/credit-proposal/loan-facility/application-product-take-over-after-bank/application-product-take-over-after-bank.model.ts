export interface IApplicationProductTakeOverBank {
  // TakeOverBank
  facilityTypeOverBank?: string;
  maturityBankOver?: number;
  initialLimitBankOver?: number;
  outstandingBankOver?: number;
}

export class ApplicationProductTakeOverBank implements IApplicationProductTakeOverBank {
  constructor(
    // TakeOverBank

    public facilityTypeOverBank?: string,
    public maturityBankOver?: number,
    public initialLimitBankOver?: number,
    public outstandingBankOver?: number
  ) {
    this.maturityBankOver = 0;
    this.initialLimitBankOver = 0;
    this.outstandingBankOver = 0;
  }
}
