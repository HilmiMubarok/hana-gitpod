export interface ICollateralType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
  attributes?: any;
}

export class CollateralType implements ICollateralType {
  constructor(
    public id?: string,
    public description?: string,
    public parentDescription?: string,
    public parentId?: string,
    public attributes?: any
  ) {}
}
