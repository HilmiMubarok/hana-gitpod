export interface IFeatureType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class FeatureType implements IFeatureType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
