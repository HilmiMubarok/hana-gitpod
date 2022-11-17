import { Facility, IFacility } from '../facility/facility.model';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { IPostalAddress, PostalAddress } from '../postal-address/postal-address.model';
export interface IInternal {
  id?: number;
  code?: string;
  name?: string;
  internalTypeDescription?: string;
  internalTypeId?: string;
  parentName?: string;
  parentId?: number;
  partyOwnerName?: string;
  partyOwnerId?: string;
  postalAddressId?: number;
  organizationName?: string;
  organizationId?: string;
  facilityName?: string;
  facilityId?: number;
  organization?: IPartyGroup;
  postalAddress?: IPostalAddress;
  facility?: IFacility;
  statusDescription?: string;
  attributes?: IInternalAttribute;
  statusId?: string;
}

export class Internal implements IInternal {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public internalTypeDescription?: string,
    public internalTypeId?: string,
    public parentName?: string,
    public parentId?: number,
    public partyOwnerName?: string,
    public partyOwnerId?: string,
    public postalAddressId?: number,
    public organizationName?: string,
    public organizationId?: string,
    public facilityName?: string,
    public facilityId?: number,
    public organization?: IPartyGroup,
    public postalAddress?: IPostalAddress,
    public facility?: IFacility,
    public statusDescription?: string,
    public attributes?: IInternalAttribute,
    public statusId?: string
  ) {
    this.organization = new PartyGroup();
    this.postalAddress = new PostalAddress();
    this.facility = new Facility();
    this.attributes = new InternalAttribute();
  }
}

// ===================================
export interface IInternalAttribute {
  officePhone?: string;
}
export class InternalAttribute {
  constructor(public officePhone?: string) {}
}
