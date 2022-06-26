export interface IProductCategoryType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class ProductCategoryType implements IProductCategoryType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
