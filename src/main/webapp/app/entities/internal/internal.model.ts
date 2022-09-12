export interface IInternal {
  id?: string;
  code?: string;
  name?: string;
  internalTypeDescription?: string;
  internalTypeId?: string;
  parentName?: string;
  parentId?: string;
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
    public id?: string,
    public code?: string,
    public name?: string,
    public internalTypeDescription?: string,
    public internalTypeId?: string,
    public parentName?: string,
    public parentId?: string,
    public partyOwnerName?: string,
    public partyOwnerId?: string,
    public postalAddressId?: number,
    public organizationName?: string,
    public organizationId?: string,
    public facilityName?: string,
    public facilityId?: number
  ) {}
}
