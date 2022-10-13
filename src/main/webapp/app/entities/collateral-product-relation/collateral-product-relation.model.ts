import { IApplicationProduct } from '../application-product/application-product.model';

export interface ICollateralProductRelation {
  id?: number;
  collateralId?: number;
  bindingValue?: number;
  applicationProduct?: IApplicationProduct;
  attributes?: any;
}

export class CollateralProductRelation implements ICollateralProductRelation {
  constructor(
    public id?: number,
    public collateralId?: number,
    public bindingValue?: number,
    public applicationProduct?: IApplicationProduct,
    public attributes?: any
  ) {
    this.attributes = {};
  }
}
