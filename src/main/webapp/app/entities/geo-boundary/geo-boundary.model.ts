export interface IGeoBoundary {
  id?: number;
  code?: string;
  description?: string;
  abbreviation?: string;
  boundaryTypeDescription?: string;
  boundaryTypeId?: string;
  parentId?: number;
  parentDescription?: string;
  attributes?: any;
}

export class GeoBoundary implements IGeoBoundary {
  constructor(
    public id?: number,
    public code?: string,
    public description?: string,
    public abbreviation?: string,
    public boundaryTypeDescription?: string,
    public boundaryTypeId?: string,
    public parentDescription?: string,
    public attributes?: any
  ) {}
}
