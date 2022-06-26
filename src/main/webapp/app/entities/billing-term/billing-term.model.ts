export interface IBillingTerm {
  id?: number;
  description?: string;
  value?: string;
  billingBillingNumber?: string;
  billingId?: number;
  termTypeDescription?: string;
  termTypeId?: string;
}

export class BillingTerm implements IBillingTerm {
  constructor(
    public id?: number,
    public description?: string,
    public value?: string,
    public billingBillingNumber?: string,
    public billingId?: number,
    public termTypeDescription?: string,
    public termTypeId?: string
  ) {}
}
