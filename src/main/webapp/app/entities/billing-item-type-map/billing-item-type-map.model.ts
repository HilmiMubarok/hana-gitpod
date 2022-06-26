export interface IBillingItemTypeMap {
  id?: number;
  orderItemTypeId?: string;
  orderAdjustmentTypeId?: string;
  productTypeId?: string;
  billingTypeDescription?: string;
  billingTypeId?: string;
  itemTypeDescription?: string;
  itemTypeId?: string;
}

export class BillingItemTypeMap implements IBillingItemTypeMap {
  constructor(
    public id?: number,
    public orderItemTypeId?: string,
    public orderAdjustmentTypeId?: string,
    public productTypeId?: string,
    public billingTypeDescription?: string,
    public billingTypeId?: string,
    public itemTypeDescription?: string,
    public itemTypeId?: string
  ) {}
}
