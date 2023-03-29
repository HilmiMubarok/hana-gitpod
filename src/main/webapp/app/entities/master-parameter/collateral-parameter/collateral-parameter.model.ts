export interface ICollateralParameter {
  id?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: Date;
  lastModifiedDate?: Date;
  collateralType?: string;
  collateralTypeCode?: string;
  collateralTypeCodeDescription?: string;
  collateralDetailTypeCode?: string;
  collateralDetailTypeDescription?: string;
}

export class CollateralParameter implements ICollateralParameter {
  constructor(
    public id?: number,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: Date,
    public lastModifiedDate?: Date,
    public collateralType?: string,
    public collateralTypeCode?: string,
    public collateralTypeCodeDescription?: string,
    public collateralDetailTypeCode?: string,
    public collateralDetailTypeDescription?: string
  ) {}
}
