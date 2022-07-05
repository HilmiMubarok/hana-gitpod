export interface ICustomerInfo {
  id?: number;
}

export class CustomerInfo implements ICustomerInfo {
  constructor(public id?: number) {}
}

export function getCustomerInfoIdentifier(customerInfo: ICustomerInfo): number | undefined {
  return customerInfo.id;
}
