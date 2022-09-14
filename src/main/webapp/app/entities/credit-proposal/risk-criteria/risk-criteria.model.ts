export interface ICriteria {
  parameter?: string;
  remarks?: string;
  value?: string;
}

export class RisksAcceptenceCriteria implements ICriteria {
  constructor(
    public parameter?: string,
    public remarks?: string,
    public value?: string,
    public GeneralRiskAcceptanceCriteria?: ICriteria[],
    public RiskAcceptanceCriteria?: ICriteria[]
  ) {
    this.parameter = '';
    this.remarks = '';
    this.value = '';
    this.GeneralRiskAcceptanceCriteria = [];
    this.RiskAcceptanceCriteria = [];
  }
}
