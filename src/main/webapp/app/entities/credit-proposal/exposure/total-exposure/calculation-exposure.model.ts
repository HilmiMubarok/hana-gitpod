export interface ICalculationExposure {
  totalDebiturCashLoan?: number;
  totalDebiturNonCashLoan?: number;
  totalGroubCashLoan?: number;
  totalGroubNonCashLoan?: number;
}

export class CalculationExposure implements ICalculationExposure {
  constructor(
    public totalDebiturCashLoan?: number,
    public totalDebiturNonCashLoan?: number,
    public totalGroubCashLoan?: number,
    public totalGroubNonCashLoan?: number
  ) {
    this.totalDebiturCashLoan = 0;
    this.totalDebiturNonCashLoan = 0;
    this.totalGroubCashLoan = 0;
    this.totalGroubNonCashLoan = 0;
  }
}
