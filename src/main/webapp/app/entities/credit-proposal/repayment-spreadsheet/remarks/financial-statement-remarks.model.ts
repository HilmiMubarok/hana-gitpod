export interface IFinancialStatementRemarksEntity {
    remarks?: string;
  }
  
  export class FinancialState implements IFinancialStatementRemarksEntity {
    constructor(public remarks?: string) // public FinancialState?: IFinancialStatementRemarksEntity[]
    {
      this.remarks = '';
    }
  }
  