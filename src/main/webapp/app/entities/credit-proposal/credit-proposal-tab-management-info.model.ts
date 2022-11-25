export interface IManagementInfo {
  parameter?: string;
  remarks?: string;
  value?: string;
  message?: string;
  notes?: string;
  date?: Date;
}

export class CreditManagementInfo implements IManagementInfo {
  constructor(
    public parameter?: string,
    public remarks?: string,
    public value?: string,
    public message?: string,
    public notes?: string,
    public date?: Date,
    public DebtorPerformentCriteria?: IManagementInfo[],
    public ManagementInfo?: IManagementInfo[]
  ) {
    this.parameter = '';
    this.date = date;
    this.remarks = '';
    this.value = '';
    this.notes = '';
    this.message = '<p>Health of key management?</p><br/><p>Reputation</p><br/><br/><p>Any evidence of shareholders’ support</p>';
    this.DebtorPerformentCriteria = [];
    this.ManagementInfo = [];
  }
}
