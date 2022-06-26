import { IPaymentApplication } from 'app/entities/payment-application/payment-application.model';

export interface IBillingItem {
  id?: number;
  itemDescription?: string;
  taxable?: boolean;
  qty?: number;
  unitPrice?: number;
  unitCost?: number;
  totalAmount?: number;
  sequence?: number;
  billingBillingNumber?: string;
  billingId?: number;
  itemTypeDescription?: string;
  itemTypeId?: string;
  payments?: IPaymentApplication[];
  productName?: string;
  productId?: string;
  featureDescription?: string;
  featureId?: string;
  attributes?: any;
}

export class BillingItem implements IBillingItem {
  constructor(
    public id?: number,
    public itemDescription?: string,
    public taxable?: boolean,
    public qty?: number,
    public unitPrice?: number,
    public unitCost?: number,
    public totalAmount?: number,
    public sequence?: number,
    public billingBillingNumber?: string,
    public billingId?: number,
    public itemTypeDescription?: string,
    public itemTypeId?: string,
    public payments?: IPaymentApplication[],
    public productName?: string,
    public productId?: string,
    public featureDescription?: string,
    public featureId?: string,
    public attributes?: any
  ) {
    this.taxable = this.taxable || false;
  }
}
