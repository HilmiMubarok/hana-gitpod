export interface ICustomer {
  loan?: number;
  casa?: number;
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
    public casa?: number,
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