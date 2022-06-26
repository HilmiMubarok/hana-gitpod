export interface IProductClassification {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  categoryDescription?: string;
  categoryId?: string;
  productName?: string;
  productId?: string;
}

export class ProductClassification implements IProductClassification {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public categoryDescription?: string,
    public categoryId?: string,
    public productName?: string,
    public productId?: string
  ) {}
}
