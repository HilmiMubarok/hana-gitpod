import { IPartyRole } from 'app/entities/party-role/party-role.model';
import { IPartyClassification } from 'app/entities/party-classification/party-classification.model';

export interface IPartyGroup {
  id?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;

  name?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  partyTypeId?: string;
  partyTypeDescription?: string;
  groupName?: string;
  prefix?: string;
  afiks?: string;
  officePhone?: string;
  otherPhone?: string;
  officeMail?: string;
  faxOffice?: string;
  taxIdNumber?: string;
  postalAddressId?: number;
  establishNotary?: string;
  fiscalDate?: Date;
  establishPlace?: string;
  decreeMinstrDate?: Date;
  number?: string;
  value?: string;
  bodTermEndDate?: Date;
}

export class PartyGroup implements IPartyGroup {
  constructor(
    public id?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,

    public name?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public partyTypeId?: string,
    public partyTypeDescription?: string,
    public groupName?: string,
    public prefix?: string,
    public afiks?: string,
    public officePhone?: string,
    public otherPhone?: string,
    public officeMail?: string,
    public faxOffice?: string,
    public postalAddressId?: number,
    public taxIdNumber?: string,
    public establishNotary?: string,
    public fiscalDate?: Date,
    public establishPlace?: string,
    public decreeMinstrDate?: Date,
    public number?: string,
    public value?: string,
    public bodTermEndDate?: Date
  ) {}
}
