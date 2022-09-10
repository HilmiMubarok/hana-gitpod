export interface ICriteria {
  parameter?: string;
  remarks?: string;
  value?: number;
}

export class RisksAcceptenceCriteria implements ICriteria {
  constructor(
    public parameter?: string,
    public remarks?: string,
    public value?: number,
    public GeneralRiskAcceptanceCriteria?: ICriteria[],
    public RiskAcceptanceCriteria?: ICriteria[],
    public dataValue?: ICriteria[]
  ) {
    this.parameter = '';
    this.remarks = '';
    this.value = 0;
    this.GeneralRiskAcceptanceCriteria = [];
    this.RiskAcceptanceCriteria = [];
    this.dataValue = [];
  }
}

// code lu taru di folder ini
