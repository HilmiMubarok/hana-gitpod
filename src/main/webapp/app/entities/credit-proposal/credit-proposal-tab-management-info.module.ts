export interface IManagement {
  parameter?: string;
  remarks?: string;
  value?: string;
}

export class CreditProposaTabManagementInfo implements IManagement {
  constructor(
    public parameter?: string,
    public remarks?: string,
    public value?: string,
    public GeneralRiskAcceptanceCriteria?: IManagement[],
    public CreditProposaTabManagementInfo?: IManagement[]
  ) {
    this.parameter = '';
    this.remarks = '';
    this.value = '';
    this.GeneralRiskAcceptanceCriteria = [];
    this.CreditProposaTabManagementInfo = [];
  }
}
