import { IPartyGroup } from '../party-group/party-group.model';
import { IPartyIdentification } from '../party-identification/party-identification.model';
import { IPartySlik } from '../party-slik/party-slik.model';
import { IPerson, Person } from '../person/person.model';
import { IPostalAddress, PostalAddress } from '../postal-address/postal-address.model';

export interface IOrganizationManagementAttributeShareholder {
  ownership?: number;
  nomShares?: number;
  pep?: string;
}

export class OrganizationManagementAttributeShareholder implements IOrganizationManagementAttributeShareholder {
  constructor(public ownership?: number, public nomShares?: number, public pep?: string) {}
}

// ---------------------------------------------------------------
export interface IOrganizationManagementAttributeManagementData {
  position?: string;
  pep?: string;
}

export class OrganizationManagementAttributeManagementData implements IOrganizationManagementAttributeManagementData {
  constructor(public position?: string, public pep?: string) {}
}

// ---------------------------------------------------------------
export interface IOrganizationManagement {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  organization?: IPartyGroup;
  cifNumber?: string;
  organizationManagementTypeId?: string;
  organizationManagementTypeDescription?: string;
  person?: IPerson;
  identification?: IPartyIdentification;
  postalAddress?: IPostalAddress;
  attributes?: any;
  partySliks?: IPartySlik[];
  dataSource?: string;
}

export class OrganizationManagement implements IOrganizationManagement {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public organization?: IPartyGroup,
    public cifNumber?: string,
    public organizationManagementTypeId?: string,
    public organizationManagementTypeDescription?: string,
    public person?: IPerson,
    public identification?: IPartyIdentification,
    public postalAddress?: IPostalAddress,
    public attributes?: any,
    public partySliks?: IPartySlik[],
    public dataSource?: string
  ) {
    this.organization = null;
    this.person = new Person();
    this.postalAddress = new PostalAddress();
    this.identification = null;
  }
}
