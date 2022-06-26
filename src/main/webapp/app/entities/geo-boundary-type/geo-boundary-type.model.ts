export interface IGeoBoundaryType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class GeoBoundaryType implements IGeoBoundaryType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
