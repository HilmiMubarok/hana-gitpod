export interface ICalculationExposure {
  totalDebiturCashLoan?: number;
  totalDebiturNonCashLoan?: number;
  totalGroubCashLoan?: number;
  totalGroubNonCashLoan?: number;
  initialLimitDebtor?: number;
  subTotalLimitDebtor?: number;
  totalChangeDebtor?: number;
  totalPLafondDebtor?: number;
  initialLimitGroub?: number;
  subTotalLimitGroubOs?: number;
  totalChangeGroub?: number;
  totalPLafondGroub?: number;
}

export class CalculationExposure implements ICalculationExposure {
  constructor(
    public totalDebiturCashLoan?: number,
    public totalDebiturNonCashLoan?: number,
    public totalGroubCashLoan?: number,
    public totalGroubNonCashLoan?: number,
    public initialLimitDebtor?: number,
    public subTotalDebtor?: number,
    public totalChangeDebtor?: number,
    public totalPLafondDebtor?: number,
    public initialLimitGroub?: number,
    public subTotalLimitGroubOs?: number,
    public totalChangeGroub?: number,
    public totalPLafondGroub?: number
  ) {
    this.totalDebiturCashLoan = 0;
    this.totalDebiturNonCashLoan = 0;
    this.totalGroubCashLoan = 0;
    this.totalGroubNonCashLoan = 0;
    this.initialLimitDebtor = 0;
    this.subTotalDebtor = 0;
    this.totalChangeDebtor = 0;
    this.totalPLafondDebtor = 0;
    this.initialLimitGroub = 0;
    this.subTotalLimitGroubOs = 0;
    this.totalChangeGroub = 0;
    this.totalPLafondGroub = 0;
  }
}
