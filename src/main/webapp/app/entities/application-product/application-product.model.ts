export interface IApplicationProduct {
  id?: number;
  amount?: number;
  tenor?: number;
  applicationId?: number;
  productId?: number;
  attributes?: any;
}

export class ApplicationProduct implements IApplicationProduct {
  constructor(
    public id?: number,
    public amount?: number,
    public tenor?: number,
    public applicationId?: number,
    public productId?: number,
    public attributes?: any
  ) {}
}
