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
    public facilityId?: number
  ) {}
}
