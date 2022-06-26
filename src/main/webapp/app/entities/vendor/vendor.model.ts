export interface IVendor {
  id?: string;
  code?: string;
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

export class Vendor implements IVendor {
  constructor(
    public id?: string,
    public code?: string,
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
