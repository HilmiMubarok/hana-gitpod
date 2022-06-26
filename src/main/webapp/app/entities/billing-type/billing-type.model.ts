import { IBillingItemTypeMap } from 'app/entities/billing-item-type-map/billing-item-type-map.model';

export interface IBillingType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
  typeMaps?: IBillingItemTypeMap[];
  paymentTypeDescription?: string;
  paymentTypeId?: string;
}

export class BillingType implements IBillingType {
  constructor(
    public id?: string,
    public description?: string,
    public parentDescription?: string,
    public parentId?: string,
    public typeMaps?: IBillingItemTypeMap[],
    public paymentTypeDescription?: string,
    public paymentTypeId?: string
  ) {}
}
