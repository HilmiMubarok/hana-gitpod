export interface IPaymentApplication {
  id?: number;
  amountApplied?: number;
  amountBase?: number;
  paymentPaymentNumber?: string;
  paymentId?: number;
  billingBillingNumber?: string;
  billingId?: number;
  billingItemId?: number;
}

export class PaymentApplication implements IPaymentApplication {
  constructor(
    public id?: number,
    public amountApplied?: number,
    public amountBase?: number,
    public paymentPaymentNumber?: string,
    public paymentId?: number,
    public billingBillingNumber?: string,
    public billingId?: number,
    public billingItemId?: number
  ) {}
}
