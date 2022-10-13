export interface IManagementInfo {
  parameter?: string;
  remarks?: string;
  value?: string;
  message?: string;
  notes?: string;
}

export class CreditManagementInfo implements IManagementInfo {
  constructor(
    public parameter?: string,
    public remarks?: string,
    public value?: string,
    public message?: string,
    public notes?: string,
    public DebtorPerformentCriteria?: IManagementInfo[],
    public ManagementInfo?: IManagementInfo[]
  ) {
    this.parameter = '';
    this.remarks = '';
    this.value = '';
    this.notes = '';
    this.message = '<p>Healty of Key Management</p><br/><p>Repatition</p><br/><br/><p>Any Evidence of Shareholderes Support</p>';
    this.DebtorPerformentCriteria = [];
    this.ManagementInfo = [];
  }
}
