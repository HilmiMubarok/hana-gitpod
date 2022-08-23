export interface IPartyGroup {
  id?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  name?: string;
  partyTypeId?: string;
  groupName?: string;
  prefix?: string;
  afiks?: string;
  officePhone?: string;
  otherPhone1?: string;
  otherPhone2?: string;
  officeMail?: string;
  faxOffice?: string;
  taxIdNumber?: string;
  lineOfBusiness?: string;
  postalCode?: string;
  companyType?: string;
  attributes?: object;
}

export class PartyGroup implements IPartyGroup {
  constructor(
    public id?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public name?: string,
    public partyTypeId?: string,
    public groupName?: string,
    public prefix?: string,
    public afiks?: string,
    public officePhone?: string,
    public otherPhone1?: string,
    public otherPhone2?: string,
    public officeMail?: string,
    public faxOffice?: string,
    public taxIdNumber?: string,
    public lineOfBusiness?: string,
    public postalCode?: string,
    public companyType?: string,
    public attributes?: object
  ) {}
}
