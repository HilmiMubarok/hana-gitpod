export interface IProduct {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  introDate?: Date;
  discontinueDate?: Date;
  productTypeDescription?: string;
  productTypeId?: string;
  configId?: number;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public code?: string,
    public name?: string,
    public description?: string,
    public introDate?: Date,
    public discontinueDate?: Date,
    public productTypeDescription?: string,
    public productTypeId?: string,
    public configId?: number
  ) {}
}
