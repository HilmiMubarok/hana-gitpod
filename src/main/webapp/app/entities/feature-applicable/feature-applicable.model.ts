export interface IFeatureApplicable {
  id?: number;
  enable?: boolean;
  valueAmount?: number;
  valueConfig?: string;
  fromDate?: Date;
  thruDate?: Date;
  featureDescription?: string;
  featureId?: string;
  productName?: string;
  productId?: number;
}

export class FeatureApplicable implements IFeatureApplicable {
  constructor(
    public id?: number,
    public enable?: boolean,
    public valueAmount?: number,
    public valueConfig?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public featureDescription?: string,
    public featureId?: string,
    public productName?: string,
    public productId?: number
  ) {
    this.enable = this.enable || false;
  }
}
