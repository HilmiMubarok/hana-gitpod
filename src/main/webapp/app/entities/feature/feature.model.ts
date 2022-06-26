export interface IFeature {
  id?: string;
  description?: string;
  featureTypeDescription?: string;
  featureTypeId?: string;
  parentDescription?: string;
  parentId?: string;
}

export class Feature implements IFeature {
  constructor(
    public id?: string,
    public description?: string,
    public featureTypeDescription?: string,
    public featureTypeId?: string,
    public parentDescription?: string,
    public parentId?: string
  ) {}
}
