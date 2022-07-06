export interface ICustomerInfo {
  id?: number;
  attributes?: any;
}

export class CustomerInfo implements ICustomerInfo {
  constructor(public id?: number, public attributes?: any) {}
}
