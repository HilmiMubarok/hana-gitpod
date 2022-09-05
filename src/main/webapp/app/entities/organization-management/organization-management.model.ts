import { IPartyIdentification } from '../party-identification/party-identification.model';
import { IPerson } from '../person/person.model';
import { IPostalAddress } from '../postal-address/postal-address.model';

export interface IOrganizationManagement {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  organizationName?: string;
  organizationId?: string;
  cifNumber?: string;
  person?: IPerson;
  postalAddress?: IPostalAddress;
  attributes?: any;
  identification?: IPartyIdentification;
}

export class OrganizationManagement implements IOrganizationManagement {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public organizationName?: string,
    public organizationId?: string,
    public cifNumber?: string,
    public person?: IPerson,
    public postalAddress?: IPostalAddress,
    public attributes?: any,
    public identification?: IPartyIdentification
  ) {}
}
