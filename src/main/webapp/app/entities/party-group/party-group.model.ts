import { IPartyClassification } from 'app/entities/party-classification/party-classification.model';
import { IParty } from '../party/party.model';

export interface IPartyGroup extends IParty {
  officeMail?: string;
  officePhone?: string;
  otherPhone?: string;
  faxOffice?: string;
  taxIdNumber?: string;
  classifications?: IPartyClassification[];
  postalAddressId?: number;
}

export class PartyGroup implements IPartyGroup {
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
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {}
}
