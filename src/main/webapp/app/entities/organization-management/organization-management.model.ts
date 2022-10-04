import { IPartyIdentification } from '../party-identification/party-identification.model';
import { IPerson, Person } from '../person/person.model';
import { IPostalAddress, PostalAddress } from '../postal-address/postal-address.model';

export interface IOrganizationManagementAttributeShareholder {
  ownership?: number;
}

export class OrganizationManagementAttributeShareholder implements IOrganizationManagementAttributeShareholder {
  constructor(public ownership?: number) {}
}

// ---------------------------------------------------------------
export interface IOrganizationManagementAttributeManagementData {
  position?: string;
}

export class OrganizationManagementAttributeManagementData implements IOrganizationManagementAttributeManagementData {
  constructor(public position?: string) {}
}

// ---------------------------------------------------------------
export interface IOrganizationManagement {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  organizationName?: string;
  organizationId?: string;
  cifNumber?: string;
  organizationManagementTypeId?: string;
  organizationManagementTypeDescription?: string;
  person?: IPerson;
  identification?: IPartyIdentification;
  postalAddress?: IPostalAddress;
  attributes?: any;
}

export class OrganizationManagement implements IOrganizationManagement {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public organizationName?: string,
    public organizationId?: string,
    public cifNumber?: string,
    public organizationManagementTypeId?: string,
    public organizationManagementTypeDescription?: string,
    public person?: IPerson,
    public identification?: IPartyIdentification,
    public postalAddress?: IPostalAddress,
    public attributes?: any
  ) {
    this.person = new Person();
    this.postalAddress = new PostalAddress();
    this.identification = null;
  }
}
