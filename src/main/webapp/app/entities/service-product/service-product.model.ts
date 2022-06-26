import { IProductClassification } from 'app/entities/product-classification/product-classification.model';
import { IFeatureApplicable } from 'app/entities/feature-applicable/feature-applicable.model';
import { IVendorProduct } from 'app/entities/vendor-product/vendor-product.model';

export interface IServiceProduct {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  introDate?: Date;
  discontinueDate?: Date;
  productTypeDescription?: string;
  productTypeId?: string;
  configId?: number;
  classifications?: IProductClassification[];
  features?: IFeatureApplicable[];
  vendors?: IVendorProduct[];
}

export class ServiceProduct implements IServiceProduct {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public description?: string,
    public introDate?: Date,
    public discontinueDate?: Date,
    public productTypeDescription?: string,
    public productTypeId?: string,
    public configId?: number,
    public classifications?: IProductClassification[],
    public features?: IFeatureApplicable[],
    public vendors?: IVendorProduct[]
  ) {}
}
