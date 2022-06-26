export interface ITaxType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
  attributes?: any;
}

export class TaxType implements ITaxType {
  constructor(
    public id?: string,
    public description?: string,
    public parentDescription?: string,
    public parentId?: string,
    public attributes?: any
  ) {}
}
