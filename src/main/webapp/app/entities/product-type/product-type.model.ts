export interface IProductType {
  id?: string;
  description?: string;
  physical?: boolean;
  digital?: boolean;
  parentDescription?: string;
  parentId?: string;
}

export class ProductType implements IProductType {
  constructor(
    public id?: string,
    public description?: string,
    public physical?: boolean,
    public digital?: boolean,
    public parentDescription?: string,
    public parentId?: string
  ) {
    this.physical = this.physical || false;
    this.digital = this.digital || false;
  }
}
