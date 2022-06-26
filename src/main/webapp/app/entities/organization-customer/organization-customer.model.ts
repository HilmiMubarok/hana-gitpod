export interface IOrganizationCustomer {
  id?: string;
  name?: string;
  officeMail?: string;
  officePhone?: string;
  otherPhone?: string;
  faxOffice?: string;
  taxIdNumber?: string;
  partyTypeDescription?: string;
  partyTypeId?: string;
  postalAddressId?: number;
  roleId?: number;
}

export class OrganizationCustomer implements IOrganizationCustomer {
  constructor(
    public id?: string,
    public name?: string,
    public officeMail?: string,
    public officePhone?: string,
    public otherPhone?: string,
    public faxOffice?: string,
    public taxIdNumber?: string,
    public partyTypeDescription?: string,
    public partyTypeId?: string,
    public postalAddressId?: number,
    public roleId?: number
  ) {}
}
