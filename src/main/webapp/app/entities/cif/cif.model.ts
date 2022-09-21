import { ICustomer } from '../customer/customer.model';

export interface ICif extends ICustomer {
  accounts?: [];
}

export class Cif implements ICif {
  constructor(public accounts?: []) {
    this.accounts = [];
  }
}
