import { CustomerType } from 'app/shared/model/enumerations/customer-type.model';

export interface ICustomerGroup {
  id?: number;
  partyIdFrom?: string;
  partyNameFrom?: string;
  partyIdTo?: string;
  partyNameTo?: string;
  cifFrom?: string;
  cifTo?: string;
  customerToType?: CustomerType;
}

export class CustomerGroup implements ICustomerGroup {
  constructor(
    public id?: number,
    public partyIdFrom?: string,
    public partyNameFrom?: string,
    public partyIdTo?: string,
    public partyNameTo?: string,
    public cifFrom?: string,
    public cifTo?: string,
    public customerToType?: CustomerType
  ) {}
}
