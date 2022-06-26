export interface IProductCategory {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
  categoryTypeDescription?: string;
  categoryTypeId?: string;
}

export class ProductCategory implements IProductCategory {
  constructor(
    public id?: string,
    public description?: string,
    public parentDescription?: string,
    public parentId?: string,
    public categoryTypeDescription?: string,
    public categoryTypeId?: string
  ) {}
}
