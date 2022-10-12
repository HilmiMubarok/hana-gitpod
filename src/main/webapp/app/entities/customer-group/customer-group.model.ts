export interface ICustomerGroup {
  id?: number;
  partyIdFrom?: string;
  partyNameFrom?: string;
  partyIdTo?: string;
  partyNameTo?: string;
  cifFrom?: string;
  cifTo?: string;
}

export class CustomerGroup implements ICustomerGroup {
  constructor(
    public id?: number,
    public partyIdFrom?: string,
    public partyNameFrom?: string,
    public partyIdTo?: string,
    public partyNameTo?: string,
    public cifFrom?: string,
    public cifTo?: string
  ) {}
}
