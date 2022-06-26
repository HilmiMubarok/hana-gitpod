import { IFeatureType } from "../feature-type/feature-type.model";
import { IFeature } from "../feature/feature.model";

export interface IProductTypeConfig {
  id?: string;
  description?: string;
  physical?: boolean;
  digital?: boolean;
  parentDescription?: string;
  parentId?: string;
  features?: IFeature[];
  featureTypes?: IFeatureType[];
}

export class ProductTypeConfig implements IProductTypeConfig {
  constructor(
    public id?: string,
    public description?: string,
    public physical?: boolean,
    public digital?: boolean,
    public parentDescription?: string,
    public parentId?: string,
    public features?: IFeature[],
    public featureTypes?: IFeatureType[]
  ) {
    this.physical = this.physical || false;
    this.digital = this.digital || false;
    this.features = [];
  }
}
