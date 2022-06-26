export interface IFacilityType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class FacilityType implements IFacilityType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
