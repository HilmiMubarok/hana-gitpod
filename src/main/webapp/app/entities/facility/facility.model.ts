export interface IFacility {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  facilityTypeDescription?: string;
  facilityTypeId?: string;
  partOfDescription?: string;
  partOfId?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  roles?: any;
  attributes?: any;
}

export class Facility implements IFacility {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public description?: string,
    public facilityTypeDescription?: string,
    public facilityTypeId?: string,
    public partOfDescription?: string,
    public partOfId?: number,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public roles?: any,
    public attributes?: any
  ) {}
}
