export interface ICustomer {
  loan?: number;
  loanProvision?: number;
  totalLoanProvision?: number;
  casa?: number;
  insurancePremium?: number;
  totalDepositInsurancePremium?: number;
  other?: number;
  provision?: number;
  avarage?: number;
  profit?: number;
  roa?: number;
  parameter?: string;
  remarks?: string;
  remarks1?: string;
  value?: string;
}

export class TabCustomerProfitability implements ICustomer {
  constructor(
    public loan?: number,
    public loanProvision?: number,
    public totalLoanProvision?: number,
    public casa?: number,
    public insurancePremium?: number,
    public totalDepositInsurancePremium?: number,
    public other?: number,
    public provision?: number,
    public avarage?: number,
    public profit?: number,
    public roa?: number,
    public parameter?: string,
    public remarks?: string,
    public remarks1?: string,
    public value?: string,
    public GeneralTabCustomerProfitability?: ICustomer[]
  ) {
    this.parameter = '';
    this.remarks = '';
    this.remarks1 = '';
    this.value = '';
    this.GeneralTabCustomerProfitability = [];
  }
}
