export interface ICustomer {
          parameter?: string;
          remarks?: string;
          value?: string;
        }

export class TabCustomerProfitability implements ICustomer{
          constructor(
                    public parameter?: string,
                    public remarks?: string,
                    public value?: string,
                    public GeneralTabCustomerProfitability?: ICustomer[],
                    public CustomerProfitability?: ICustomer[]

          )
          {
                    this.parameter = '';
                    this.remarks = '';
                    this.value = '';
                    this.GeneralTabCustomerProfitability = [];
                    this.CustomerProfitability = [];
  }

          }
        
        