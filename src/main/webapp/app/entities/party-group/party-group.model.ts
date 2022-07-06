import { IPartyRole } from 'app/entities/party-role/party-role.model';
import { IPartyClassification } from 'app/entities/party-classification/party-classification.model';

export interface IPartyGroup {
  id?: string;
  groupName?: string;
  prefix?: string;
  officeMail?: string;
  officePhone?: string;
  otherPhone?: string;
  faxOffice?: string;
  taxIdNumber?: string;
  partyTypeDescription?: string;
  partyTypeId?: string;
  roles?: IPartyRole[];
  classifications?: IPartyClassification[];
  postalAddressId?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
}

export class PartyGroup implements IPartyGroup {
  constructor(
    public id?: string,
    public groupName?: string,
    public prefix?: string,
    public officeMail?: string,
    public officePhone?: string,
    public otherPhone?: string,
    public faxOffice?: string,
    public taxIdNumber?: string,
    public partyTypeDescription?: string,
    public partyTypeId?: string,
    public roles?: IPartyRole[],
    public classifications?: IPartyClassification[],
    public postalAddressId?: number,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {}
}
