export interface ICollateralProposePricingParam {
  id?: number;
  proposePricing?: string;
  proposePricingCode?: string;
  collateralParameterId?: number;
  collateralParameterDetailType?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
}

export class CollateralProposePricingParameter implements ICollateralProposePricingParam {
  constructor(
    public id?: number,
    public proposePricing?: string,
    public proposePricingCode?: string,
    public collateralParameterId?: number,
    public collateralParameterDetailType?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {}
}
